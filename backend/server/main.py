from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy import text

from server.api import auth, stocks
from server.utils.database import init_database, close_db_connection, SessionLocal
from server.models.users import User  

ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]

CORS_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting FastAPI application...")
    success = init_database()
    if not success:
        print("WARNING: Database initialization failed, but continuing startup...")
    else:
        print("Application startup complete!")
    
    yield
    
    print("\033[93mINFO:     Shutting down: Closing database connections")
    try:
        close_db_connection()
        print("\033[92mINFO:     Database connections closed successfully")
    except Exception as e:
        print(f"\033[91mERROR:    Error closing database connections: {e}")


app = FastAPI(
    title="Zoku",
    description="This is the documentation for Zoku's API.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "x-vercel-set-bypass-cookie"],
)

app.include_router(auth.router)
app.include_router(stocks.router)


@app.get("/")
def home():
    return {"message": "Zoku server is running", "docs": "/docs", "version": "1.0"}


@app.get("/health")
def health_check():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}
    finally:
        db.close()
