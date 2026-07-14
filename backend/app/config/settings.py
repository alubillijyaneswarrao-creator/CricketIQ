import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CricketIQ API"
    VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cricketiq.db")
    
    # RAG / Vector Store
    CHROMA_DB_DIR: str = os.getenv("CHROMA_DB_DIR", "./chroma_db")
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # Gemini LLM Config
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # App Mode
    # If True, and GEMINI_API_KEY is missing, it returns intelligent mock responses instead of crashing
    MOCK_AI_FALLBACK: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
