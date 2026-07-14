from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.rag.pipeline import query_vector_store

router = APIRouter(prefix="/api/search", tags=["Semantic Search"])

@router.get("/")
def perform_semantic_search(
    query: str = Query(..., description="The query to search the knowledge base semantically"),
    limit: int = Query(5, description="Number of results to return")
):
    """
    Performs cosine similarity search using HuggingFace embeddings
    across player profiles, match reports, articles, and rules.
    """
    results = query_vector_store(query, n_results=limit)
    
    formatted_results = []
    for res in results:
        # Categorize matches dynamically based on source/id prefix
        category = "General"
        doc_id = res["id"]
        
        if doc_id.startswith("faq"):
            category = "Knowledge Base"
        elif doc_id.startswith("pdf"):
            category = "User Document"
        elif "comparison" in doc_id:
            category = "Player Comparison"
            
        formatted_results.append({
            "id": doc_id,
            "content": res["content"],
            "category": category,
            "confidence": res["confidence"],
            "metadata": res["metadata"]
        })
        
    return {
        "query": query,
        "results": formatted_results
    }
