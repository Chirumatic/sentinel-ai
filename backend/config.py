from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Splunk Configuration
    splunk_host: str = "localhost"
    splunk_port: int = 8089
    splunk_username: str = "admin"
    splunk_password: str = ""
    splunk_scheme: str = "https"
    
    # AI Configuration
    openai_api_key: Optional[str] = None
    ollama_endpoint: str = "http://localhost:11434"
    ai_provider: str = "openai"
    
    # Database
    database_url: Optional[str] = None
    
    # Application
    backend_port: int = 8000
    frontend_port: int = 3000
    debug: bool = True
    
    # Security
    jwt_secret: str = "change-this-secret-key"
    cors_origins: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
