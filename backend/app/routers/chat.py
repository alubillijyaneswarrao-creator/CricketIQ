import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import SavedChat
from app.schemas.schemas import ChatRequest, ChatResponse, SavedChatResponse
from app.rag.pipeline import generate_rag_answer
from app.utils.voice import text_to_speech_base64

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

@router.post("/", response_model=ChatResponse)
def handle_chat_query(
    payload: ChatRequest, 
    generate_voice: bool = Query(False, description="Whether to return synthesized speech audio"),
    db: Session = Depends(get_db)
):
    chat_id = payload.chat_id
    if not chat_id:
        chat_id = str(uuid.uuid4())

    # Get Chat History
    chat_record = db.query(SavedChat).filter(SavedChat.id == chat_id).first()
    history_context = ""
    
    if chat_record:
        # Extract recent conversation memory for RAG context
        recent_msgs = chat_record.messages[-4:]  # Last 4 messages
        history_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_msgs])
    
    # Enrich query with conversational history
    enriched_query = payload.message
    if history_context:
        enriched_query = f"Conversation History:\n{history_context}\n\nUser Question: {payload.message}"

    # Query RAG
    rag_result = generate_rag_answer(enriched_query, document_only=payload.document_only)
    
    # Generate Voice Speech if requested
    audio_data = None
    if generate_voice:
        audio_data = text_to_speech_base64(rag_result["answer"])

    # Update DB
    new_messages = []
    if chat_record:
        new_messages = list(chat_record.messages)
    
    new_messages.append({"role": "user", "content": payload.message})
    new_messages.append({"role": "assistant", "content": rag_result["answer"]})
    
    if chat_record:
        chat_record.messages = new_messages
    else:
        # Generate title from first few words
        title = payload.message[:40] + ("..." if len(payload.message) > 40 else "")
        chat_record = SavedChat(id=chat_id, title=title, messages=new_messages)
        db.add(chat_record)
        
    db.commit()

    return ChatResponse(
        chat_id=chat_id,
        answer=rag_result["answer"],
        sources=rag_result["sources"],
        confidence_score=rag_result["confidence_score"],
        response_time_ms=rag_result["response_time_ms"],
        audio_content=audio_data
    )

@router.get("/history", response_model=List[SavedChatResponse])
def get_chat_history(db: Session = Depends(get_db)):
    return db.query(SavedChat).order_by(SavedChat.created_at.desc()).all()

@router.put("/{chat_id}/bookmark")
def toggle_bookmark(chat_id: str, db: Session = Depends(get_db)):
    chat = db.query(SavedChat).filter(SavedChat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    chat.is_bookmarked = not chat.is_bookmarked
    db.commit()
    return {"chat_id": chat_id, "is_bookmarked": chat.is_bookmarked}

@router.delete("/{chat_id}")
def delete_chat(chat_id: str, db: Session = Depends(get_db)):
    chat = db.query(SavedChat).filter(SavedChat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    db.delete(chat)
    db.commit()
    return {"message": "Chat session deleted successfully"}
