import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.connection import engine, Base, get_db
from app.services.database_seeder import seed_database
from app.rag.pipeline import seed_knowledge_base
from app.routers import players, matches, chat, upload, search

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Create database tables
logger.info("Initializing relational database tables...")
Base.metadata.create_all(bind=engine)

# Seed database on start
db_session = next(get_db())
try:
    seed_database(db_session)
except Exception as e:
    logger.error(f"Error seeding database: {e}")
finally:
    db_session.close()

# Seed ChromaDB knowledge base on start
try:
    seed_knowledge_base()
except Exception as e:
    logger.error(f"Error seeding ChromaDB: {e}")

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for CricketIQ - AI Cricket Analytics & RAG Platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify front-end domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(chat.router)
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(upload.router)
app.include_router(search.router)

@app.get("/")
def home():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_api": "configured" if settings.GEMINI_API_KEY else "unconfigured (using mock fallback)"
    }
