# 🏏 CricketIQ – AI Powered Cricket Analytics & RAG Platform

CricketIQ is an enterprise-grade SaaS intelligence platform built with **FastAPI**, **React (TypeScript)**, **LangChain**, and **ChromaDB**. It implements a complete Retrieval-Augmented Generation (RAG) pipeline to query and synthesize cricket analytics, compare player metrics, forecast live scores, and conduct document Q&A on uploaded scorecard PDFs.

---

## Key Features

1.  **RAG AI Chat**: Compare players, ask tactical questions, and view context citations with confidence scores and latency metrics.
2.  **Player Analytics Hub**: Search player metrics, examine recent form logs, and view interactive career timelines and AI assessments.
3.  **Head-to-Head Comparison**: Compare averages and strike rates via polar radar maps, format bar charts, and comparative AI reports.
4.  **Live Match forecasting**: Track simulated live scorefeeds, view ball logs, and check winner probabilities and projected score forecasts.
5.  **Post-Match Analytics**: Review scorecards, over run-rate worms, partnerships, win probability timelines, and turning points.
6.  **Document Upload Q&A**: Ingest custom cricket scorecard PDFs into ChromaDB vector collections for isolated document query search.
7.  **Semantic Search**: Query naturally (e.g. "IPL death finishers") to retrieve ranked matches based on similarity index distances.
8.  **Speech Synthesis & Voice Recognition**: Voice command inquiries using Web Speech recognition and vocal playback using gTTS.

---

## System Architecture

```
                                  +-----------------------+
                                  |    React Frontend     |
                                  |     (Vite / TS)       |
                                  +-----------+-----------+
                                              |
                                              v (API Calls via Axios)
                                  +-----------+-----------+
                                  |    FastAPI Backend    |
                                  +-----+-----+-----+-----+
                                        |     |     |
             +--------------------------+     |     +--------------------------+
             v (SQLAlchemy queries)           v (Embedding / Retrieval)        v (Text-to-Speech)
  +----------+----------+             +-------+-------+             +----------+----------+
  |    PostgreSQL DB    |             |   ChromaDB    |             |      gTTS / TTS     |
  | (SQLite fallback)   |             | (Vector DB)   |             |  (Base64 MP3 chunks)|
  +---------------------+             +-------+-------+             +---------------------+
                                              |
                                              v (Generative RAG)
                                      +-------+-------+
                                      |  Gemini API   |
                                      +---------------+
```

---

## Project Structure

```
cricketiq/
├── backend/
│   ├── app/
│   │   ├── config/          # App settings
│   │   ├── database/        # Session connections (PostgreSQL/SQLite fallback)
│   │   ├── models/          # SQLAlchemy schemas
│   │   ├── schemas/         # Pydantic validation structures
│   │   ├── routers/         # Endpoint paths (chat, players, matches, search, upload)
│   │   ├── services/        # Relational database seeders
│   │   ├── rag/             # LangChain embedding and LLM prompt orchestrations
│   │   ├── utils/           # PDF text parser and audio synthesis functions
│   │   └── main.py          # App bootstrapper
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Common navigation and Recharts layout modules
│   │   ├── pages/           # Pages (Dashboard, Compare, Live scorecards, PDF uploads)
│   │   ├── context/         # Theme toggles and Speech contexts
│   │   ├── hooks/           # Polling hooks for simulated live feeds
│   │   └── services/        # Axios API Client triggers
│   ├── index.html
│   └── package.json
└── docker-compose.yml
```

---

## Installation & Setup

### Docker Orchestration (Recommended)
1. Set your Gemini API key in your terminal:
   ```bash
   $env:GEMINI_API_KEY="your-gemini-api-key"
   ```
2. Build and run containers:
   ```bash
   docker-compose up --build
   ```
3. Open `http://localhost` to access the React platform, and `http://localhost:8000/docs` to test FastAPI Swagger interfaces.

### Manual Local Execution
#### Backend (FastAPI)
1. Navigate to `/backend`, initialize virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Boot the API server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend (React / Vite)
1. Navigate to `/frontend`, install packages:
   ```bash
   npm install
   ```
2. Start local development server:
   ```bash
   npm run dev
   ```
3. Browser will open on `http://localhost:5173`.

---

## Security Best Practices
- **Environment variables**: Critical keys (Gemini tokens, DB connection urls) are managed via Pydantic settings.
- **SQLite Fallback**: Dynamic engine checks handle SQLite fallback when PostgreSQL credentials are not provided.
- **Input Validation**: Request bodies validate formatting using strict Pydantic schemas.
