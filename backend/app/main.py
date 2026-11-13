
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routers.input import router as input_router
from app.routers.mouse_ws import router as mouse_ws_router
from app.routers.media import router as media_router
from app.routers.vlc import router as vlc_router


BASE_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

app = FastAPI(
    title="PC Remote API",
    description="Local network PC remote control API",
    version="1.0.0",
)

# API routers
app.include_router(mouse_ws_router)
app.include_router(input_router)
app.include_router(media_router)
app.include_router(vlc_router)


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Frontend static assets
if (FRONTEND_DIST / "assets").exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="frontend-assets",
    )


# Serve React frontend
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    index_file = FRONTEND_DIST / "index.html"

    requested_file = (FRONTEND_DIST / full_path).resolve()

    if (
        requested_file.is_relative_to(FRONTEND_DIST.resolve())
        and requested_file.is_file()
    ):
        return FileResponse(requested_file)

    if index_file.exists():
        return FileResponse(index_file)

    return {"detail": "Frontend build not found"}
