from fastapi import FastAPI

app = FastAPI(
    title="PC Remote API",
    description="Local network PC remote control API",
    version="1.0.0",
)


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
