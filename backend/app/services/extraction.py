from __future__ import annotations

import io
import re
from dataclasses import dataclass

from pypdf import PdfReader

from app.models.process import FinancialData


@dataclass(frozen=True)
class ExtractionResult:
    data: FinancialData
    raw_text: str
    confidence: float
    flags: list[str]


def _extract_pdf_text(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    pages: list[str] = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()


def _extract_plain_text(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore").strip()


def _first_rupee_amount(pattern: str, text: str) -> int | None:
    m = re.search(pattern, text, flags=re.IGNORECASE)
    if not m:
        return None
    raw = re.sub(r"[^0-9.]", "", m.group(1))
    if not raw:
        return None
    return int(float(raw))


def _extract_financial_fields(text: str) -> FinancialData:
    salary = _first_rupee_amount(r"salary(?:\s+income)?\s*[:\-]?\s*([\d,\.]+)", text)
    other = _first_rupee_amount(r"other(?:\s+income)?\s*[:\-]?\s*([\d,\.]+)", text)
    d80c = _first_rupee_amount(r"80c\s*[:\-]?\s*([\d,\.]+)", text)
    d_other = _first_rupee_amount(r"deductions?(?:\s+other)?\s*[:\-]?\s*([\d,\.]+)", text)
    tds = _first_rupee_amount(r"tds\s*[:\-]?\s*([\d,\.]+)", text)

    return FinancialData(
        income_salary=salary or 1_200_000,
        income_other=other or 50_000,
        deductions_80c=d80c or 80_000,
        deductions_other=d_other or 0,
        tds=tds or 60_000,
    )


def extract_financial_data(file_name: str, file_bytes: bytes) -> ExtractionResult:
    """
    Deterministic extraction for MVP.
    - PDF: extracts text via pypdf.
    - TXT/CSV: utf-8 decode.
    - Images/others: fallback to defaults with lower confidence.
    """
    lowered = file_name.lower()
    flags: list[str] = []

    raw_text = ""
    confidence = 0.55

    try:
        if lowered.endswith(".pdf"):
            raw_text = _extract_pdf_text(file_bytes)
            confidence = 0.89 if raw_text else 0.45
            if not raw_text:
                flags.append("No extractable text found in PDF")
        elif lowered.endswith(".txt") or lowered.endswith(".csv"):
            raw_text = _extract_plain_text(file_bytes)
            confidence = 0.85 if raw_text else 0.5
        else:
            # OCR integration can be added later.
            flags.append("Unsupported format for rich extraction; used fallback parser")
    except Exception:
        flags.append("Extraction failed; used fallback values")

    data = _extract_financial_fields(raw_text)
    return ExtractionResult(data=data, raw_text=raw_text, confidence=confidence, flags=flags)


def mock_extract_financial_data(file_name: str, file_bytes: bytes) -> FinancialData:
    # Backward-compatible alias used by older paths.
    return extract_financial_data(file_name, file_bytes).data

