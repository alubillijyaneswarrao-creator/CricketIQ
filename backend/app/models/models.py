import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from app.database.connection import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    country = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)  # Batter, Bowler, All-rounder, Wicketkeeper
    batting_style = Column(String)
    bowling_style = Column(String)
    image_url = Column(String)
    icc_rankings = Column(JSON)  # e.g., {"Test": 3, "ODI": 1, "T20I": 12}
    stats = Column(JSON)  # Detailed formats: Test, ODI, T20I (runs, avg, sr, etc.)
    recent_form = Column(JSON)  # List of scores/wickets in recent matches
    timeline = Column(JSON)  # Key career milestones
    bio = Column(Text)
    ai_summary = Column(Text)  # Pre-generated or cached AI summary

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)  # e.g., "India vs Australia - 2023 World Cup Final"
    team_a = Column(String, nullable=False)
    team_b = Column(String, nullable=False)
    status = Column(String, default="completed")  # completed, live, scheduled
    format = Column(String, default="ODI")  # Test, ODI, T20I
    date = Column(String)
    venue = Column(String)
    scorecard = Column(JSON)  # Detailed scores, batters, bowlers lists
    charts_data = Column(JSON)  # Run rates, worm graph, partnership lists, etc.
    summary = Column(Text)  # Match summary
    turning_points = Column(JSON)  # Turning points checklist/text
    momentum_data = Column(JSON)  # Momentum metrics per over
    predictions = Column(JSON)  # AI predictions (win probability, score prediction)

class SavedChat(Base):
    __tablename__ = "saved_chats"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    messages = Column(JSON, default=list)  # List of dicts [{"role": "user", "content": "..."}, ...]
    is_bookmarked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class IngestedDocument(Base):
    __tablename__ = "ingested_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_hash = Column(String, unique=True, index=True, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    chunk_count = Column(Integer)
