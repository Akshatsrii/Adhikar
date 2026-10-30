from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEV_KEY = "dev-only-internal-key"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    database_url: str = "postgresql+psycopg2://postgres:postgres@127.0.0.1:5433/adhikar_ai"
    cors_origin: str = "http://localhost:5173"
    gemini_api_key: str = ""
    internal_ai_key: str = ""

    @model_validator(mode="after")
    def _check_key(self) -> "Settings":
        if not self.internal_ai_key:
            if self.app_env == "production":
                raise ValueError("INTERNAL_AI_KEY must be set in production")
            self.internal_ai_key = DEV_KEY
        return self


settings = Settings()
