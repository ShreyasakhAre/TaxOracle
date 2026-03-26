import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api.routes import router as api_router
from app.db.database import init_db
from app.api.middleware import ErrorHandlingMiddleware
from app.utils.logging_config import setup_logging
from app.utils.env_config import settings

# Initialize logging
setup_logging()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Premium Tax Compliance Engine"
)


@app.on_event("startup")
async def startup_event() -> None:
    init_db()

# Internal performance metrics
METRICS = {
    "start_time": time.time(),
    "total_requests": 0,
    "total_processing_time": 0.0,
}

# Advanced metrics middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    METRICS["total_requests"] += 1
    response = await call_next(request)
    process_time = time.time() - start_time
    METRICS["total_processing_time"] += process_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Standard Middlewares
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "env": settings.env,
        "uptime": f"{time.time() - METRICS['start_time']:.2f}s"
    }

@app.get("/metrics")
async def metrics():
    avg_time = (
        METRICS["total_processing_time"] / METRICS["total_requests"]
        if METRICS["total_requests"] > 0
        else 0
    )
    return {
        "requests_total": METRICS["total_requests"],
        "avg_latency": f"{avg_time:.4f}s",
        "uptime_seconds": round(time.time() - METRICS["start_time"], 2),
    }

app.include_router(api_router)
