import uvicorn

from server.utils.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=8000,
        lifespan="on",
        workers=3,
        reload=bool(settings.DEBUG),
    )