"""AutolystAI — FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, datasets, chat, analysis, teams


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown hooks."""
    # Ensure upload directory exists
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth.router, prefix="/api/v1")
app.include_router(teams.router, prefix="/api/v1")
app.include_router(datasets.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": settings.app_name}
