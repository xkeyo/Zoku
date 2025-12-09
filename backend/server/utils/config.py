from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    JWT_ALGORITHM: str = "HS256"
    JWT_SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_PLEASE_USE_ENV_VARIABLE"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = ""
    FRONTEND_URL: str = ""

    FASTAPI_CONFIG: str = "development"
    NS_DATABASE_URL: str = ""
    DEBUG: str = "FALSE"

settings = Settings()