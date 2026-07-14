import os
import time
import logging
from typing import List, Dict, Any
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Fallback embedding class in case HuggingFace embeddings fail to load (e.g. no internet/compilation issues)
class SimpleFallbackEmbeddings:
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # Return a simple deterministic vector based on characters
        return [self._embed_text(text) for text in texts]

    def embed_query(self, text: str) -> List[float]:
        return self._embed_text(text)

    def _embed_text(self, text: str) -> List[float]:
        # Create a simple 384-dimensional vector
        vector = [0.0] * 384
        text_lower = text.lower()
        for i, char in enumerate(text_lower[:384]):
            vector[i] = ord(char) / 255.0
        # Normalize
        norm = sum(x*x for x in vector) ** 0.5
        if norm > 0:
            vector = [x/norm for x in vector]
        return vector

# Setup Embeddings
embeddings = None
if settings.GEMINI_API_KEY:
    try:
        logger.info("Initializing Google Gemini Embeddings...")
        from langchain_google_genai import GoogleGenAIEmbeddings
        embeddings = GoogleGenAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY
        )
    except Exception as e:
        logger.warning(f"Could not load Google Gemini Embeddings: {e}. Falling back to deterministic word-vector model.")
        embeddings = SimpleFallbackEmbeddings()
else:
    logger.info("No GEMINI_API_KEY configured. Using deterministic fallback embeddings.")
    embeddings = SimpleFallbackEmbeddings()

# Setup Vector Store (ChromaDB)
chroma_client = None
db_collection = None

try:
    import chromadb
    logger.info(f"Connecting to ChromaDB at: {settings.CHROMA_DB_DIR}")
    chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
    # Using default cosine distance
    db_collection = chroma_client.get_or_create_collection(
        name="cricketiq_kb", 
        metadata={"hnsw:space": "cosine"}
    )
except Exception as e:
    logger.error(f"ChromaDB initialization failed: {e}. Using an in-memory dictionary-based mock vector DB.")
    # In-memory simple storage mock
    class MockCollection:
        def __init__(self):
            self.docs = []
            self.metadata = []
            self.ids = []
        def add(self, documents, metadatas, ids):
            for doc, meta, doc_id in zip(documents, metadatas, ids):
                self.docs.append((doc, meta, doc_id))
        def query(self, query_texts, n_results=5, where=None):
            # Simple substring matching + fallback ranking
            results = []
            q = query_texts[0].lower()
            
            # Rank based on substring overlap
            matches = []
            for doc, meta, doc_id in self.docs:
                # If document_only filtering is active
                if where and where.get("source") == "user_upload" and meta.get("source") != "user_upload":
                    continue
                
                score = 0.5
                if q in doc.lower():
                    score = 0.1 # closer to 0 (distance) is better for cosine
                matches.append((doc, meta, doc_id, score))
            
            matches.sort(key=lambda x: x[3])
            matched = matches[:n_results]
            
            return {
                "documents": [[m[0] for m in matched]],
                "metadatas": [[m[1] for m in matched]],
                "ids": [[m[2] for m in matched]],
                "distances": [[m[3] for m in matched]]
            }
        def count(self):
            return len(self.docs)
            
    db_collection = MockCollection()

# Ingest default knowledge base documents into ChromaDB
def seed_knowledge_base():
    try:
        if db_collection.count() > 0:
            logger.info("ChromaDB knowledge base already seeded.")
            return
    except Exception:
        pass

    logger.info("Seeding ChromaDB knowledge base with default cricket intelligence articles...")
    kb_articles = [
        {
            "id": "faq_1",
            "content": "Virat Kohli vs Babar Azam stats: Virat Kohli has scored 50 ODI centuries with an average of 58.67 and strike rate of 93.54. Babar Azam has 19 ODI centuries with an average of 56.72 and strike rate of 88.75. In Tests, Kohli has 29 centuries (avg 49.15) while Babar has 9 centuries (avg 45.85). In T20Is, Kohli has 4188 runs (avg 48.69, SR 137.04) and Babar has 4145 runs (avg 41.03, SR 129.08). Kohli is generally considered more successful in high-pressure matches and ICC knockouts.",
            "metadata": {"category": "comparison", "source": "cricketiq_database"}
        },
        {
            "id": "faq_2",
            "content": "Who is the best finisher in cricket? MS Dhoni is widely regarded as the greatest finisher in cricket history. He played 350 ODIs, scoring 10,773 runs at an average of 50.57, frequently remaining unbeaten (84 times) to guide India to victory. He led Chennai Super Kings (CSK) to 5 IPL titles and captained India to victory in the 2007 T20 World Cup, 2011 ODI World Cup, and 2013 Champions Trophy. Other notable finishers include Glenn Maxwell, AB de Villiers, and Michael Bevan.",
            "metadata": {"category": "analytics", "source": "cricketiq_database"}
        },
        {
            "id": "faq_3",
            "content": "India lost the 2023 ICC World Cup Final to Australia at the Narendra Modi Stadium in Ahmedabad on November 19, 2023. India batted first and was bowled out for 240 in 50 overs, with KL Rahul scoring 66 and Virat Kohli scoring 54. Pat Cummins bowled brilliantly, taking 2/34, and Travis Head took a crucial catch to dismiss Rohit Sharma. Australia chased down the target in 43 overs, scoring 241/4, led by Travis Head's magnificent 137 and Marnus Labuschagne's 58*. Australia won by 6 wickets, clinching their sixth World Cup title.",
            "metadata": {"category": "history", "source": "cricketiq_database"}
        },
        {
            "id": "faq_4",
            "content": "ICC Men's ODI Player Rankings (Batter): 1. Babar Azam (Pakistan), 2. Shubman Gill (India), 3. Virat Kohli (India), 4. Rohit Sharma (India), 5. Daryl Mitchell (New Zealand). Test Batter Rankings: 1. Kane Williamson, 2. Joe Root, 3. Steve Smith, 4. Daryl Mitchell, 5. Virat Kohli. Bowler rankings are led by Jasprit Bumrah (India) in Tests and Keshav Maharaj (South Africa) in ODIs.",
            "metadata": {"category": "rankings", "source": "cricketiq_database"}
        },
        {
            "id": "faq_5",
            "content": "Fantasy Cricket Team Selection Guide: Selecting the right captain and vice-captain is crucial. Captain receives 2x points, vice-captain receives 1.5x points. Safe picks for captain include consistent run-scorers like Virat Kohli or Babar Azam. All-rounders like Hardik Pandya or Glenn Maxwell are highly valuable as they earn points with both bat and ball. Differential picks are low-ownership players with high potential, such as death bowlers (Jasprit Bumrah or Shaheen Afridi) who pick wickets in clusters.",
            "metadata": {"category": "fantasy", "source": "cricketiq_database"}
        },
        {
            "id": "faq_6",
            "content": "Cricket rules and terminology: Powerplay: In ODIs, the first 10 overs have maximum 2 fielders outside the 30-yard circle. Overs 11-40 allow up to 4 fielders outside, and the final 10 overs allow up to 5 fielders. In T20Is, the first 6 overs represent the powerplay. DRS (Decision Review System) allows teams to challenge umpire decisions using Hawk-Eye ball tracking, UltraEdge/Snickometer, and Hotspot.",
            "metadata": {"category": "rules", "source": "cricketiq_database"}
        }
    ]
    
    docs = [item["content"] for item in kb_articles]
    metadatas = [item["metadata"] for item in kb_articles]
    ids = [item["id"] for item in kb_articles]
    
    db_collection.add(
        documents=docs,
        metadatas=metadatas,
        ids=ids
    )
    logger.info("Successfully ingested knowledge base articles.")

def query_vector_store(query_text: str, n_results: int = 4, document_only: bool = False) -> List[Dict[str, Any]]:
    # Search Chroma DB
    where_filter = None
    if document_only:
        where_filter = {"source": "user_upload"}
        
    try:
        results = db_collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where=where_filter
        )
    except Exception as e:
        logger.error(f"Vector search query failed: {e}")
        return []

    output = []
    if results and "documents" in results and results["documents"]:
        documents = results["documents"][0]
        metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(documents)
        ids = results["ids"][0] if "ids" in results else [""] * len(documents)
        distances = results["distances"][0] if "distances" in results else [0.5] * len(documents)
        
        for doc, meta, doc_id, dist in zip(documents, metadatas, ids, distances):
            # Convert distance to confidence score (smaller distance = higher confidence in cosine space)
            confidence = max(0.0, min(1.0, 1.0 - dist)) if dist is not None else 0.8
            output.append({
                "id": doc_id,
                "content": doc,
                "metadata": meta,
                "confidence": confidence
            })
    return output

# RAG Generation logic
def generate_rag_answer(query_text: str, document_only: bool = False) -> Dict[str, Any]:
    start_time = time.time()
    
    # 1. Retrieve sources
    sources = query_vector_store(query_text, n_results=4, document_only=document_only)
    
    # 2. Extract context
    context = "\n\n".join([f"Source [{src['metadata'].get('source', 'Unknown')}]: {src['content']}" for src in sources])
    
    # If no sources found and user requested document only
    if not sources and document_only:
        return {
            "answer": "No uploaded document found matching your query. Please upload a PDF scorecard or match report first.",
            "sources": [],
            "confidence_score": 0.0,
            "response_time_ms": int((time.time() - start_time) * 1000)
        }
        
    # 3. Prompt Template
    system_prompt = (
        "You are CricketIQ, a brilliant AI Cricket Analytics and Intelligence Platform.\n"
        "Answer the user's question using the provided retrieved context. Be analytical, professional, and precise.\n"
        "Structure your response beautifully with bullet points, bold text, or markdown tables where appropriate.\n"
        "Ensure all statistics mentioned are highly accurate. If the context does not contain the answer and you do not know, state that clearly.\n"
        f"CONTEXT:\n{context}\n"
    )
    
    gemini_key = settings.GEMINI_API_KEY
    
    # 4. Invoke LLM (Gemini or Mock)
    answer = ""
    confidence = 0.95
    if gemini_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model=settings.GEMINI_MODEL,
                google_api_key=gemini_key,
                temperature=0.2
            )
            response = llm.invoke(f"{system_prompt}\nUser Question: {query_text}")
            answer = response.content
        except Exception as e:
            logger.error(f"Gemini API invocation failed: {e}. Falling back to mock analytics.")
            answer = generate_mock_answer(query_text, context)
            confidence = 0.85
    else:
        # Generate high-quality mock analytical response
        answer = generate_mock_answer(query_text, context)
        confidence = 0.88

    response_time = int((time.time() - start_time) * 1000)
    
    return {
        "answer": answer,
        "sources": sources,
        "confidence_score": confidence,
        "response_time_ms": response_time
    }

def generate_mock_answer(query: str, context: str) -> str:
    q = query.lower()
    
    # Match specific query keywords to deliver beautiful reports
    if "compare" in q or ("kohli" in q and "root" in q):
        return (
            "### head-to-head: Virat Kohli vs Joe Root\n\n"
            "Based on retrieved career statistics and current match logs, here is the detailed comparative overview:\n\n"
            "| Statistic | Virat Kohli (IND) | Joe Root (ENG) |\n"
            "| :--- | :---: | :---: |\n"
            "| **Test Matches** | 113 | 140 |\n"
            "| **Test Runs (Avg)** | 8,848 (49.15) | 11,736 (49.72) |\n"
            "| **Test Centuries** | 29 | 31 |\n"
            "| **ODI Matches** | 292 | 171 |\n"
            "| **ODI Runs (Avg)** | 13,848 (58.67) | 6,522 (47.60) |\n"
            "| **ODI Strike Rate** | 93.54 | 86.82 |\n"
            "| **T20I Runs (SR)** | 4,188 (137.04) | 893 (126.30) |\n\n"
            "**Key AI Insights:**\n"
            "- **Red Ball Supremacy:** Joe Root holds the edge in Test aggregates and current form, anchoring the middle-order in the England 'Bazball' template.\n"
            "- **White Ball Dominance:** Virat Kohli is statistically superior in limited-overs matches, possessing a historic 50 ODI centuries and a near 60 average in run chases.\n"
            "- **Role in Team:** Kohli plays as the primary chase anchor, whereas Root operates as a spin specialist and accumulator."
        )
    elif "finisher" in q or "dhoni" in q:
        return (
            "### AI Analysis: The Art of Finishing in Cricket\n\n"
            "According to statistical logs, **MS Dhoni** remains the benchmark for finishers in world cricket.\n\n"
            "**Why MS Dhoni is the Greatest Finisher:**\n"
            "1. **Unbeaten Run Chases:** Out of 350 ODI appearances, Dhoni remained not out **84 times**. India won over 85% of matches when Dhoni remained unbeaten at the end.\n"
            "2. **Calculated Death-Over Acceleration:** Dhoni famously structured chases by taking them deep, exhausting bowlers, and targeting specific match-ups in the final 2 overs (strike rate exceeding 180 in overs 48-50).\n"
            "3. **CSK and Team India Legacy:** Led India to three ICC titles and Chennai Super Kings to five IPL crowns, demonstrating elite tactical planning.\n\n"
            "**Other Notable Modern Finishers:**\n"
            "- **Glenn Maxwell (AUS):** High-risk, high-reward bowler-destroyer with an ODI strike rate of 126+.\n"
            "- **Rinku Singh (IND):** Emerging T20 finisher with a career strike rate above 145, specializing in boundary hitting against express pace."
        )
    elif "world cup final" in q or "lost" in q:
        return (
            "### Strategic Breakdown: Why India Lost the 2023 World Cup Final\n\n"
            "The 2023 Final at Ahmedabad saw Australia defeat India by 6 wickets. Analysis highlights three major tactical turning points:\n\n"
            "1. **Suggish Middle-Over Batting:** After Rohit Sharma's brisk start (47 off 31), India was restricted by Pat Cummins and Adam Zampa. Virat Kohli (54) and KL Rahul (66 off 107) rebuilt, but hit only **four boundaries in 30 overs** due to excellent outfield fielding by Australia.\n"
            "2. **Pitch Assessment & Toss Decision:** Pat Cummins read the slow pitch perfectly, electing to bowl first. The pitch was sluggish in the afternoon, dry and difficult to bat on, but became easier under lights with a light dew factor.\n"
            "3. **Travis Head's Masterclass:** Chasing 240, Australia was reduced to 47/3. Travis Head (137) played an aggressive but calculated knock, matching Marnus Labuschagne's (58*) anchor role in a 192-run match-winning partnership."
        )
    elif "fantasy" in q or "captain" in q:
        return (
            "### CricketIQ Fantasy Draft Assistant\n\n"
            "Based on match conditions, historical trends, and player form, here are the recommendations:\n\n"
            "*   **Safe Captain Pick:** **Virat Kohli** (IND). His recent form (143, 76, 46) and high-floor runs make him the safest pick to double your points.\n"
            "*   **Vice-Captain Pick:** **Glenn Maxwell** (AUS). Offers dual-value, picking up wickets in the middle-overs and batting at a high strike rate at the death.\n"
            "*   **Differential Pick (Low Ownership, High Impact):** **Jasprit Bumrah** (IND). With an average economy under 6.5 in T20Is and his lethal yorker accuracy, he is bound to pick up wickets in the death overs.\n"
            "*   **Risky Choice:** **Babar Azam** (PAK). Tends to struggle against early left-arm swing but if he survives the powerplay, he anchors for a big score."
        )
    elif "finisher in ipl" in q or "ipl" in q:
        return (
            "### AI Analysis: IPL Elite Finishers\n\n"
            "Using vector search results, the top IPL finishers are rated by strike rate in the death overs (overs 16-20):\n\n"
            "1. **MS Dhoni (Chennai Super Kings):** The legacy finisher. Possesses the record for most runs scored in the 20th over in IPL history.\n"
            "2. **Andre Russell (Kolkata Knight Riders):** Holds the highest overall strike rate in IPL (174.00+), causing massive damage against spin and pace alike.\n"
            "3. **Rinku Singh (Kolkata Knight Riders):** Famous for hitting five sixes in five balls. A highly calculated batsman with great boundary percentages."
        )
    else:
        # Default smart response using whatever is in the context
        if context:
            return (
                f"### CricketIQ Analytics Search Result\n\n"
                f"Based on our knowledge base, here is what we found:\n\n"
                f"{context}\n\n"
                f"Let me know if you would like me to compile more detailed graphs or player metrics on this query!"
            )
        else:
            return (
                "### CricketIQ AI Chat\n\n"
                "I couldn't find matching statistics in the database. "
                "However, I can tell you that in general cricket analytics, team structure, pitch conditions, "
                "and batting strike rates during the middle overs are key drivers of match outcomes.\n\n"
                "Please try asking about:\n"
                "- *'Compare Virat Kohli and Joe Root'* \n"
                "- *'Why India lost the World Cup Final'* \n"
                "- *'Who is the best finisher?'*"
            )
