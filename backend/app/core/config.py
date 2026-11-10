import os
from pathlib import Path
from typing import Optional, Tuple
from secrets import token_urlsafe
from dotenv import load_dotenv

# ponytail: auto-load .env from backend or root directory
_backend_dir = Path(__file__).resolve().parent.parent.parent
_backend_env = _backend_dir / ".env"
_root_env = _backend_dir.parent / ".env"
if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env)
if _root_env.exists():
    load_dotenv(dotenv_path=_root_env)

ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.rtf', '.eml'}

_default_sqlite = (_backend_dir / "instance" / "pegorion.db").resolve()
_default_sqlite.parent.mkdir(parents=True, exist_ok=True)
_raw_db_url = os.getenv("DATABASE_URL", "").strip()

if not _raw_db_url or "pegorion.db" in _raw_db_url:
    _db_url = f"sqlite:///{_default_sqlite.as_posix()}"
elif _raw_db_url.startswith("sqlite:///./"):
    _rel = _raw_db_url[len("sqlite:///./"):]
    _resolved = (_backend_dir / _rel).resolve()
    _resolved.parent.mkdir(parents=True, exist_ok=True)
    _db_url = f"sqlite:///{_resolved.as_posix()}"
else:
    _db_url = _raw_db_url

class Settings:
    DATABASE_URL: str = _db_url
    SECRET_KEY: str = os.getenv("SECRET_KEY", token_urlsafe(32)).strip()
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256").strip()
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Document storage
    DOCUMENT_STORAGE_PATH: str = os.getenv("DOCUMENT_STORAGE_PATH", (_backend_dir / "data" / "documents").as_posix()).strip()
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))

    # AI Provider settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    GITHUB_TOKEN: Optional[str] = os.getenv("GITHUB_TOKEN")

    class Config:
        case_sensitive = True

settings = Settings()
MAX_FILE_SIZE_MB = settings.MAX_FILE_SIZE_MB

def validate_file_upload(filename: str, file_size: int) -> Tuple[bool, Optional[str]]:
    """Validate file upload against security rules."""
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"File type '{ext}' not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        return False, f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit"
    return True, None
