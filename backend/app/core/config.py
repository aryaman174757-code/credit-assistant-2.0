import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Credit Assistant 2.0 API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "super-secret-production-quality-jwt-key-for-credit-assistant-2.0-fintech-saas-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./credit_assistant.db"
    GEMINI_API_KEY: str = ""
    ENCRYPTION_KEY: str = "uY7z0fXQ-t-W1G9Jb4Z7Z7dK1n9q7W-y9T7e9t5R3A="
    WHATSAPP_API_TOKEN: str = "MOCK_WHATSAPP_SANDBOX_TOKEN"
    WHATSAPP_PHONE_NUMBER_ID: str = "919876543210"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
