import logging
import time
from threading import Lock

from fastapi import APIRouter, BackgroundTasks, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.db.database import AnalysisResult, Document, SessionLocal
from app.engine.insight import generate_actions, generate_insights
from app.engine.risk import compute_risk
from app.engine.rule import compare_and_recommend
from app.models.process import ProcessResponse, ReportData
from app.services.explanation import generate_explanation
from app.services.extraction import extract_financial_data
from app.services.qa import answer_question, build_chunks
from app.services.storage import save_upload
from app.services.validation import validate_financial_data

router = APIRouter(prefix="/api/v1", tags=["v1"])
logger = logging.getLogger("taxoracle.api")

_TASKS: dict[str, dict] = {}
_TASK_LOCK = Lock()


class QARequest(BaseModel):
    task_id: str
    question: str


def _append_log(task_id: str, message: str) -> None:
    ts = time.strftime("%H:%M:%S")
    with _TASK_LOCK:
        if task_id in _TASKS:
            _TASKS[task_id]["logs"].append({"time": ts, "message": message})


def _update_task(task_id: str, **kwargs) -> None:
    with _TASK_LOCK:
        if task_id in _TASKS:
            _TASKS[task_id].update(kwargs)


def _persist_result(task_id: str, result: ProcessResponse) -> None:
    db = SessionLocal()
    try:
        row = db.query(AnalysisResult).filter(AnalysisResult.task_id == task_id).first()
        payload = result.model_dump_json()
        if not row:
            row = AnalysisResult(
                task_id=task_id,
                compliance_score=result.compliance_score,
                risk_score=result.risk.score,
                confidence=result.confidence,
                summary=result.report.summary if result.report else "",
                result_json=payload,
            )
            db.add(row)
        else:
            row.compliance_score = result.compliance_score
            row.risk_score = result.risk.score
            row.confidence = result.confidence
            row.summary = result.report.summary if result.report else ""
            row.result_json = payload

        doc = db.query(Document).filter(Document.task_id == task_id).first()
        if doc:
            doc.status = "completed"
        db.commit()
    finally:
        db.close()


def _run_pipeline(task_id: str, file_name: str, file_path: str) -> None:
    try:
        _update_task(task_id, status="processing", progress=8)
        _append_log(task_id, "Reading uploaded document")
        with open(file_path, "rb") as handle:
            file_bytes = handle.read()

        _update_task(task_id, progress=24)
        _append_log(task_id, "Extracting structured financial fields")
        extracted = extract_financial_data(file_name, file_bytes)

        _update_task(task_id, progress=40)
        _append_log(task_id, "Validating extracted values")
        validated = validate_financial_data(extracted.data)
        flags = list(validated.flags) + list(extracted.flags)

        _update_task(task_id, progress=58)
        _append_log(task_id, "Running deterministic tax rule engine")
        rules = compare_and_recommend(validated.data)

        _update_task(task_id, progress=74)
        _append_log(task_id, "Computing compliance risk profile")
        risk, compliance_score = compute_risk(validated.data, flags)
        insights, savings_score = generate_insights(validated.data, rules.tax_result, risk)
        actions = generate_actions(validated.data, rules.tax_result, risk)

        _update_task(task_id, progress=88)
        _append_log(task_id, "Preparing explanation and report")
        explanation = generate_explanation(
            total_income=rules.total_income,
            deductions_applied=rules.deductions_applied,
            tax=rules.tax_result,
            data=validated.data,
        )

        result = ProcessResponse(
            session_id=task_id,
            extracted_data=validated.data,
            tax_result=rules.tax_result,
            risk=risk,
            compliance_score=compliance_score,
            savings_score=savings_score,
            insights=insights,
            actions=actions,
            confidence=max(0.0, min(1.0, extracted.confidence - (0.06 * len(flags)))),
            explanation=explanation,
            report=ReportData(
                summary=f"Analysis complete for {file_name}. Potential savings: ₹{abs(rules.tax_result.old_tax - rules.tax_result.new_tax):,}.",
                generated_at=time.strftime("%Y-%m-%d %H:%M:%S"),
            ),
        )

        chunks = build_chunks(extracted.raw_text)
        _persist_result(task_id, result)

        _update_task(
            task_id,
            status="completed",
            progress=100,
            result=result.model_dump(),
            chunks=chunks,
        )
        _append_log(task_id, "Pipeline completed")
    except Exception as exc:
        logger.exception("Task failed: %s", task_id)
        _update_task(task_id, status="failed", error=str(exc))
        _append_log(task_id, f"Pipeline failed: {exc}")

        db = SessionLocal()
        try:
            doc = db.query(Document).filter(Document.task_id == task_id).first()
            if doc:
                doc.status = "failed"
                db.commit()
        finally:
            db.close()

@router.get("/health")
async def health():
    return {"status": "ok"}

@router.post("/analyze")
async def analyze(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        if not file or not file.filename:
            return JSONResponse(status_code=400, content={"detail": "No file received"})

        file_bytes = await file.read()
        if not file_bytes:
            return JSONResponse(status_code=400, content={"detail": "Empty file uploaded"})

        task_id, file_path = save_upload(file.filename, file_bytes)

        with _TASK_LOCK:
            _TASKS[task_id] = {
                "status": "queued",
                "progress": 0,
                "logs": [{"time": time.strftime("%H:%M:%S"), "message": "Task accepted"}],
                "result": None,
                "error": None,
                "chunks": [],
            }

        db = SessionLocal()
        try:
            db.add(
                Document(
                    task_id=task_id,
                    filename=file.filename,
                    file_path=file_path,
                    content_type=file.content_type or "application/octet-stream",
                    status="queued",
                )
            )
            db.commit()
        finally:
            db.close()

        background_tasks.add_task(_run_pipeline, task_id, file.filename, file_path)
        return {"task_id": task_id, "status": "queued"}

    except Exception as e:
        logger.exception("Analysis failed")
        return JSONResponse(status_code=500, content={"detail": f"Analysis error: {str(e)}"})


@router.get("/status/{task_id}")
async def status(task_id: str):
    with _TASK_LOCK:
        task = _TASKS.get(task_id)

    if not task:
        return JSONResponse(status_code=404, content={"detail": "Task not found"})

    return {
        "task_id": task_id,
        "status": task["status"],
        "progress": task["progress"],
        "logs": task["logs"],
        "result": task["result"],
        "error": task["error"],
    }


@router.post("/qa")
async def qa(payload: QARequest):
    with _TASK_LOCK:
        task = _TASKS.get(payload.task_id)

    if not task:
        return JSONResponse(status_code=404, content={"detail": "Task not found"})
    if task["status"] != "completed":
        return JSONResponse(status_code=409, content={"detail": "Task is not ready for Q&A"})

    response = answer_question(payload.question, task.get("chunks", []))
    return response

# Backward compatibility alias (deprecated)
@router.post("/process", include_in_schema=False)
async def process_alias(file: UploadFile = File(...)):
    bg = BackgroundTasks()
    return await analyze(bg, file)
