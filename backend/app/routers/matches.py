import time
import random
import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import Match
from app.schemas.schemas import MatchResponse
from app.rag.pipeline import generate_rag_answer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/matches", tags=["Matches"])

# Global In-Memory state for live match simulation
LIVE_SIMULATION_STATE = {}

def get_simulated_live_match(db_match: Match) -> Dict[str, Any]:
    global LIVE_SIMULATION_STATE
    
    current_time = time.time()
    
    # Initialize state if empty or if match changed
    if not LIVE_SIMULATION_STATE or LIVE_SIMULATION_STATE.get("id") != db_match.id:
        scorecard = db_match.scorecard or {}
        charts = db_match.charts_data or {}
        predictions = db_match.predictions or {}
        
        # Parse starting metrics from seeded DB live match
        inn1 = scorecard.get("innings_1", {})
        score = int(inn1.get("score", "154"))
        wickets = int(inn1.get("wickets", "6"))
        overs_str = inn1.get("overs", "18.2")
        
        parts = overs_str.split('.')
        ov = int(parts[0])
        balls = int(parts[1]) if len(parts) > 1 else 0
        
        LIVE_SIMULATION_STATE = {
            "id": db_match.id,
            "title": db_match.title,
            "team_a": db_match.team_a,
            "team_b": db_match.team_b,
            "status": "live",
            "format": db_match.format,
            "date": db_match.date,
            "venue": db_match.venue,
            "score": score,
            "wickets": wickets,
            "overs_ov": ov,
            "overs_balls": balls,
            "batting": list(inn1.get("batting", [])),
            "bowling": list(inn1.get("bowling", [])),
            "recent_balls": list(charts.get("live_meta", {}).get("recent_balls", ["1", "4", "6", "W"])),
            "win_prob_ind": float(predictions.get("win_probability", {}).get("India", 62.0)),
            "last_update": current_time
        }
        
    # Check if we should simulate a new ball (every 8 seconds)
    elapsed = current_time - LIVE_SIMULATION_STATE["last_update"]
    if elapsed >= 8.0:
        # Calculate how many balls to simulate
        balls_to_simulate = int(elapsed // 8.0)
        LIVE_SIMULATION_STATE["last_update"] = current_time - (elapsed % 8.0)
        
        for _ in range(min(balls_to_simulate, 6)): # Cap simulation to max 6 balls at a time
            # 1. Check if innings completed (e.g. 20.0 overs or 10 wickets)
            if LIVE_SIMULATION_STATE["overs_ov"] >= 20 or LIVE_SIMULATION_STATE["wickets"] >= 10:
                # Reset simulation to keep it active endlessly for demo purposes
                LIVE_SIMULATION_STATE["score"] = 145
                LIVE_SIMULATION_STATE["wickets"] = 5
                LIVE_SIMULATION_STATE["overs_ov"] = 18
                LIVE_SIMULATION_STATE["overs_balls"] = 0
                LIVE_SIMULATION_STATE["recent_balls"] = ["1", "2", "4"]
                LIVE_SIMULATION_STATE["win_prob_ind"] = 58.0
                break
                
            # 2. Simulate next ball outcome
            # Outcomes: Dot (0), Single (1), Double (2), Four (4), Six (6), Wicket (W)
            outcomes = ["0", "1", "2", "4", "6", "W"]
            weights = [0.25, 0.40, 0.12, 0.12, 0.06, 0.05]
            ball_result = random.choices(outcomes, weights=weights)[0]
            
            # 3. Apply ball result to state
            LIVE_SIMULATION_STATE["recent_balls"].append(ball_result)
            if len(LIVE_SIMULATION_STATE["recent_balls"]) > 6:
                LIVE_SIMULATION_STATE["recent_balls"].pop(0)
                
            if ball_result == "W":
                LIVE_SIMULATION_STATE["wickets"] += 1
                # Fluctuates win probability negatively for batting team (India)
                LIVE_SIMULATION_STATE["win_prob_ind"] = max(10.0, LIVE_SIMULATION_STATE["win_prob_ind"] - random.uniform(5.0, 9.0))
            else:
                runs = int(ball_result)
                LIVE_SIMULATION_STATE["score"] += runs
                # Fluctuates win probability positively
                prob_add = 3.0 if runs >= 4 else 0.5
                LIVE_SIMULATION_STATE["win_prob_ind"] = min(95.0, LIVE_SIMULATION_STATE["win_prob_ind"] + random.uniform(0.1, prob_add))
                
                # Update batsman score (e.g. Suryakumar Yadav is batting)
                if len(LIVE_SIMULATION_STATE["batting"]) >= 3:
                    # Increment runs of index 2 (Suryakumar Yadav)
                    sky = LIVE_SIMULATION_STATE["batting"][2]
                    sky["runs"] += runs
                    sky["balls"] += 1
                    sky["sr"] = (sky["runs"] / sky["balls"]) * 100
                    if runs == 4: sky["fours"] += 1
                    if runs == 6: sky["sixes"] += 1
            
            # Update overs
            LIVE_SIMULATION_STATE["overs_balls"] += 1
            if LIVE_SIMULATION_STATE["overs_balls"] >= 6:
                LIVE_SIMULATION_STATE["overs_ov"] += 1
                LIVE_SIMULATION_STATE["overs_balls"] = 0

    # 4. Pack into scorecard schema response format
    overs_display = f"{LIVE_SIMULATION_STATE['overs_ov']}.{LIVE_SIMULATION_STATE['overs_balls']}"
    run_rate = (LIVE_SIMULATION_STATE["score"] / (LIVE_SIMULATION_STATE["overs_ov"] + LIVE_SIMULATION_STATE["overs_balls"]/6.0)) if (LIVE_SIMULATION_STATE["overs_ov"] + LIVE_SIMULATION_STATE["overs_balls"]) > 0 else 0.0
    projected_score = int(run_rate * 20.0)
    
    win_prob_ind = round(LIVE_SIMULATION_STATE["win_prob_ind"], 1)
    win_prob_pak = round(100.0 - win_prob_ind, 1)

    ai_insights = (
        f"Suryakumar Yadav is leading India's acceleration phase with aggressive boundaries. "
        f"The current run rate stands at {run_rate:.2f} per over. AI forecasting expects India to finish around {projected_score} runs, "
        f"providing the bowling unit with a {win_prob_ind}% win probability given Barbados' historical second-innings slowdown."
    )

    simulated_match = {
        "id": LIVE_SIMULATION_STATE["id"],
        "title": LIVE_SIMULATION_STATE["title"],
        "team_a": LIVE_SIMULATION_STATE["team_a"],
        "team_b": LIVE_SIMULATION_STATE["team_b"],
        "status": "live",
        "format": LIVE_SIMULATION_STATE["format"],
        "date": LIVE_SIMULATION_STATE["date"],
        "venue": LIVE_SIMULATION_STATE["venue"],
        "summary": db_match.summary,
        "scorecard": {
            "innings_1": {
                "team": LIVE_SIMULATION_STATE["team_a"],
                "score": str(LIVE_SIMULATION_STATE["score"]),
                "wickets": str(LIVE_SIMULATION_STATE["wickets"]),
                "overs": overs_display,
                "batting": LIVE_SIMULATION_STATE["batting"],
                "bowling": LIVE_SIMULATION_STATE["bowling"]
            },
            "innings_2": {
                "team": LIVE_SIMULATION_STATE["team_b"],
                "score": "0",
                "wickets": "0",
                "overs": "0.0",
                "batting": [],
                "bowling": []
            }
        },
        "charts_data": {
            "worm_graph": [
                {"over": 1, "team_a_runs": 8, "team_b_runs": 0},
                {"over": 6, "team_a_runs": 48, "team_b_runs": 0},
                {"over": 12, "team_a_runs": 98, "team_b_runs": 0},
                {"over": 15, "team_a_runs": 120, "team_b_runs": 0},
                {"over": 18, "team_a_runs": 150, "team_b_runs": 0},
                {"over": LIVE_SIMULATION_STATE["overs_ov"], "team_a_runs": LIVE_SIMULATION_STATE["score"], "team_b_runs": 0}
            ],
            "partnership": [
                {"players": "S. Yadav & H. Pandya", "runs": LIVE_SIMULATION_STATE["score"] - 132, "balls": LIVE_SIMULATION_STATE["overs_balls"] + (LIVE_SIMULATION_STATE["overs_ov"]-18)*6, "team": "India"}
            ],
            "live_meta": {
                "overs": overs_display,
                "run_rate": f"{run_rate:.2f}",
                "projected_score_8": str(projected_score),
                "projected_score_10": str(projected_score + 6),
                "recent_balls": LIVE_SIMULATION_STATE["recent_balls"]
            }
        },
        "turning_points": db_match.turning_points,
        "momentum_data": db_match.momentum_data,
        "predictions": {
            "win_probability": {"India": win_prob_ind, "Pakistan": win_prob_pak},
            "projected_score": str(projected_score),
            "ai_insights": ai_insights
        }
    }
    
    return simulated_match

@router.get("/", response_model=List[MatchResponse])
def get_matches(db: Session = Depends(get_db)):
    matches = db.query(Match).all()
    # Replace live match with simulated state
    output = []
    for m in matches:
        if m.status == "live":
            sim = get_simulated_live_match(m)
            # Create a mock MatchResponse structure matching schema
            output.append(sim)
        else:
            output.append(m)
    return output

@router.get("/live")
def get_live_matches(db: Session = Depends(get_db)):
    live_match = db.query(Match).filter(Match.status == "live").first()
    if not live_match:
        return []
    return [get_simulated_live_match(live_match)]

@router.get("/{match_id}")
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if match.status == "live":
        return get_simulated_live_match(match)
    return match

@router.get("/{match_id}/insights")
def get_match_insights(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    actual_match = match
    if match.status == "live":
        actual_match = get_simulated_live_match(match)
        
    # Generate match strategic report
    query = f"Provide a technical cricket analysis and highlights for the match: {actual_match['title']} at {actual_match['venue']}."
    rag_result = generate_rag_answer(query)
    
    return {
        "match_id": match.id,
        "title": actual_match["title"],
        "ai_summary": rag_result["answer"],
        "turning_points": actual_match["turning_points"],
        "win_probability": actual_match["predictions"].get("win_probability", {}) if actual_match["predictions"] else {},
        "response_time_ms": rag_result["response_time_ms"]
    }
