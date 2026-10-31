from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    APP_NAME: str = "Enviquo SM Pvt. Ltd."

    DATABASE_URL: str
    UPLOAD_DIR: str

    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    FRONTEND_URL: str
   

    # Admin credentials
    ADMIN_EMAIL: str = "admin@smcleantech.com"
    ADMIN_PASSWORD: str = "Admin@12345"


    # SMTP
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Enviquo SM Pvt. Ltd."

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()

# Centralized PDF upload directories
UPLOAD_ROOT = (BACKEND_DIR / settings.UPLOAD_DIR).resolve()

ENQUIRY_REPORTS_DIR = UPLOAD_ROOT / "enquiry_reports"
QUESTION_FILES_DIR = UPLOAD_ROOT / "question_files"

# Create folders automatically if they do not exist
ENQUIRY_REPORTS_DIR.mkdir(parents=True, exist_ok=True)
QUESTION_FILES_DIR.mkdir(parents=True, exist_ok=True)
