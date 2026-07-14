from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Player Schemas
class PlayerBase(BaseModel):
    name: str
    country: str
    role: str
    batting_style: Optional[str] = None
    bowling_style: Optional[str] = None
    image_url: Optional[str] = None
    icc_rankings: Optional[Dict[str, Any]] = None
    stats: Optional[Dict[str, Any]] = None
    recent_form: Optional[List[Any]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    bio: Optional[str] = None
    ai_summary: Optional[str] = None

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int
    class Config:
        from_attributes = True

# Match Schemas
class MatchBase(BaseModel):
    title: str
    team_a: str
    team_b: str
    status: str
    format: str
    date: Optional[str] = None
    venue: Optional[str] = None
    scorecard: Optional[Dict[str, Any]] = None
    charts_data: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    turning_points: Optional[List[str]] = None
    momentum_data: Optional[List[Dict[str, Any]]] = None
    predictions: Optional[Dict[str, Any]] = None

class MatchCreate(MatchBase):
    pass

class MatchResponse(MatchBase):
    id: int
    class Config:
        from_attributes = True

# Chat Schemas
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None
    document_only: Optional[bool] = False  # If True, only search within uploaded document Chroma indices

class ChatResponse(BaseModel):
    chat_id: str
    answer: str
    sources: List[Dict[str, Any]] = []
    confidence_score: float = 0.95
    response_time_ms: int
    audio_content: Optional[str] = None # Base64 encoded MP3 speech

class SaveChatRequest(BaseModel):
    chat_id: str
    title: str
    messages: List[ChatMessage]

class SavedChatResponse(BaseModel):
    id: str
    title: str
    messages: List[ChatMessage]
    is_bookmarked: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Semantic Search Schemas
class SearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 5

class SearchResult(BaseModel):
    title: str
    content: str
    category: str
    score: float
    metadata: Dict[str, Any]

# Document Schemas
class DocumentResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    chunk_count: int
    class Config:
        from_attributes = True
