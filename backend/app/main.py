from fastapi import FastAPI
from app.routers.input import router as input_router

app = FastAPI(
    title="PC Remote API",
    description="Local network PC remote control API",
    version="1.0.0",
)

app.include_router(input_router)


@app.get("/")
async def root():
    return {
        "message": "PC Remote API is running!",
        "status": "online",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
    }
