import logging
import os 
import time

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import DisconnectionError, OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool, StaticPool

load_dotenv()

logger = logging.getLogger(__name__)

DB_URL = os.getenv("DB_URL")

if DB_URL.startswith("sqlite"):
    engine = create_engine(
        DB_URL,
        echo=False,
        poolclass=StaticPool,
        connect_args={
            "check_same_thread": False,
            "timeout": 20
        }
    )
else:
    engine = create_engine(
        DB_URL,
        echo=False,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={
            "connect_timeout": 10
        }
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    global engine, SessionLocal
    max_retries = 3
    backoff_factor = 0.5

    for attempt in range(max_retries):
        db = None
        try:
            db = SessionLocal()
            # Test connection
            db.execute(text("SELECT 1"))
            yield db
            return

        except (DisconnectionError, OperationalError) as e:
            if db:
                db.close()
            
            error_msg = str(e).lower()
            logger.warning(f"Database connection attempt {attempt + 1} failed: {error_msg}")

            is_connection_issue = any(
                phrase in error_msg
                for phrase in [
                    "ssl connection has been closed unexpectedly",
                    "server closed the connection unexpectedly",
                    "connection not open",
                    "connection was lost",
                    "server unexpectedly closed the connection",
                    "connection already closed",
                    "connection is closed",
                    "server has gone away",
                    "connection timed out",
                    "could not connect to server",
                    "connection refused",
                    "connection reset by peer",
                    "connection broken",
                    "database is starting up",
                    "password authentication failed",
                    "database does not exist",
                ]
            )

            if is_connection_issue and attempt < max_retries - 1:
                sleep_time = backoff_factor * (2 ** attempt)
                logger.info(f"Retrying database connection in {sleep_time} seconds...")
                time.sleep(sleep_time)
                continue
            else:
                logger.error(f"Database connection failed after {max_retries} attempts")
                # For development, fall back to SQLite if PostgreSQL fails
                if not DB_URL.startswith("sqlite") and attempt == max_retries - 1:
                    logger.info("Falling back to SQLite for development...")
                    engine = create_engine(
                        "sqlite:///./app.db",
                        echo=False,
                        poolclass=StaticPool,
                        connect_args={"check_same_thread": False}
                    )
                    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
                    db = SessionLocal()
                    yield db
                    return
                raise e
        
        except Exception as e:
            if db:
                db.close()
            logger.error(f"Unexpected database error: {e}")
            raise

        finally:
            if db:
                db.close()

def close_db_connection():
    engine.dispose()

def init_database():
    try:
        print("\033[92mINFO:     Creating database tables")
        Base.metadata.create_all(bind=engine)
        print("\033[92mINFO:     Database tables created successfully!")
        return True
    except Exception as e:
        print("\033[91mERROR:    Error creating database tables: {e}")
        return False
            