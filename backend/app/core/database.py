from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import settings
from ..models.base_class import Base

db_url = settings.DATABASE_URL
# ponytail: auto-detect postgres driver or fall back to sqlite
if db_url.startswith("postgresql://") or db_url.startswith("postgresql+psycopg2://"):
    try:
        import psycopg2  # noqa: F401
    except ImportError:
        try:
            import psycopg  # noqa: F401
            db_url = db_url.replace("postgresql+psycopg2://", "postgresql+psycopg://").replace("postgresql://", "postgresql+psycopg://")
        except ImportError:
            db_url = "sqlite:///./instance/pegorion.db"

connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
engine = create_engine(db_url, connect_args=connect_args)
# ponytail: ensure tables exist in dev database
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
