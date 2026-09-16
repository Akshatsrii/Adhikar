from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/adhikar_ai"
    cors_origin: str = "http://localhost:5173"
    gemini_api_key: str = ""
    internal_ai_key: str = "default-internal-key-12345"


settings = Settings()
