import os
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "TaxOracle"
    env: str = Field("development", env="ENV")
    host: str = Field("127.0.0.1", env="HOST")
    port: int = Field(8001, env="PORT")
    allow_origins: list = ["*"]
    database_url: str = Field("sqlite:///./taxoracle.db", env="DATABASE_URL")
    redis_url: str = Field("redis://localhost:6379/0", env="REDIS_URL")
    storage_dir: str = Field("./storage/uploads", env="STORAGE_DIR")
    
    class Config:
        env_file = ".env"

settings = Settings()
