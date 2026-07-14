from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import Player
from app.schemas.schemas import PlayerResponse
from app.rag.pipeline import generate_rag_answer

router = APIRouter(prefix="/api/players", tags=["Players"])

@router.get("/", response_model=List[PlayerResponse])
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()

@router.get("/search", response_model=PlayerResponse)
def get_player_by_name(name: str = Query(..., description="Name of the player to search"), db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.name.ilike(f"%{name}%")).first()
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{name}' not found")
    return player

@router.get("/{player_id}", response_model=PlayerResponse)
def get_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.get("/compare/stats")
def compare_players(
    player1: str = Query(..., description="First player name"),
    player2: str = Query(..., description="Second player name"),
    db: Session = Depends(get_db)
):
    p1 = db.query(Player).filter(Player.name.ilike(f"%{player1}%")).first()
    p2 = db.query(Player).filter(Player.name.ilike(f"%{player2}%")).first()
    
    if not p1 or not p2:
        raise HTTPException(
            status_code=404, 
            detail=f"One or both players not found. Checked for '{player1}' and '{player2}'"
        )
        
    # Generate RAG Comparison summary
    query = f"Compare cricket players {p1.name} and {p2.name}. Detail their averages, formats, strengths, and who is more dominant in pressure situations."
    rag_result = generate_rag_answer(query)
    
    # Pack radar comparison data
    formats = ["Test", "ODI", "T20I"]
    comparison_charts = []
    
    for f in formats:
        # Standardize stats extraction
        p1_stats = p1.stats.get(f, {})
        p2_stats = p2.stats.get(f, {})
        
        comparison_charts.append({
            "format": f,
            f"{p1.name}_avg": p1_stats.get("average", 0),
            f"{p2.name}_avg": p2_stats.get("average", 0),
            f"{p1.name}_sr": p1_stats.get("strike_rate", 0),
            f"{p2.name}_sr": p2_stats.get("strike_rate", 0),
            f"{p1.name}_hundreds": p1_stats.get("hundreds", 0),
            f"{p2.name}_hundreds": p2_stats.get("hundreds", 0)
        })

    return {
        "player1": p1,
        "player2": p2,
        "charts": comparison_charts,
        "ai_summary": rag_result["answer"],
        "confidence_score": rag_result["confidence_score"]
    }
