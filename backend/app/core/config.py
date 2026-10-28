from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Enviquo SM Pvt. Ltd."

    DATABASE_URL: str = "sqlite:///./sm_cleantech.db"

    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    FRONTEND_URL: str
    # FRONTEND_URL: str = "https://sm-tech-platform.vercel.app"

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
