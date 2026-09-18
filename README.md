<div align="center">
  <img src="docs/assets/banner.png" alt="Adhikar project banner" width="100%" />
</div>

<br/>

<div align="center">
  <p><strong>Because claiming a government scheme shouldn't feel like a government scheme.</strong></p>
  <p><i>A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>
</div>

<br/>

## 1. What is Adhikar?
India has hundreds of welfare schemes, but citizens struggle with a fragmentation crisis: discovering what they qualify for, interpreting complex legal eligibility rules, tracking deadlines, resolving overlapping family conflicts, and understanding application rejections.

Adhikar is an end-to-end intelligent platform that solves this. It ingests complex government PDFs, converts them into strict deterministic rules, matches them against user profiles, resolves family-level conflicts, provides an AI Copilot for forms, and debugs rejections using multimodal reasoning. 

<br/>

## 2. Why Two Backends?
Adhikar is deliberately built as a distributed system, not just a monolith:
- **Node.js / Express (Product Backend):** Owns fast, typed CRUD operations (users, families, applications) and MongoDB.
- **Python / FastAPI (AI Service):** Owns complex reasoning, embeddings, LangGraph, multimodal document extraction, and the deterministic rule engine, using PostgreSQL + `pgvector`.

<br/>

## 3. Core Capabilities
| Feature | Traditional Platforms | Adhikar |
|---|---|---|
| Rule interpretation | Manual reading | Automated deterministic evaluation |
| Scope | Individual | Full family optimization |
| Application errors | Caught after rejection | Caught via DBT mismatch checker before submit |
| Application help | Helpdesk | AI Copilot + Auto field extraction (OCR) |
| Rejections | Generic "Not eligible" | Debugger with exact rule citations |

<br/>

## 4. System Architecture

![Adhikar System Architecture](docs/assets/architecture.png)

The AI Service evaluates deterministic rules extracted from government texts and uses Google Gemini 2.0 Flash for NLP and OCR tasks.

```mermaid
sequenceDiagram
    actor Citizen
    participant FE as React Frontend
    participant API as Node/Express API
    participant AI as Python FastAPI
    participant PG as PostgreSQL + pgvector
    participant LLM as Google Gemini

    Citizen->>FE: Ask "Rajasthan B.Tech scholarship?"
    FE->>API: POST /api/ai/ask
    API->>AI: forward query + user profile
    AI->>LLM: embed(query)
    AI->>PG: similarity search (top-k)
    PG-->>AI: scheme chunks + sources
    AI->>LLM: generate answer
    LLM-->>AI: grounded answer
    AI-->>API: answer + citations
    API-->>FE: JSON response
    FE-->>Citizen: Answer card with source links
```

<br/>

## 5. Completed Technical Roadmap

**✅ Stage 1 — Foundation**
Auth system ka poora setup. Frontend (Vite+React+TS+TanStack Router), Backend (Express+TS+MongoDB), JWT+bcrypt login/register. ML: ❌ zaroorat nahi.

**✅ Stage 2 — Profile + Government Scheme Data Pipeline**
User profile form (age/state/education/income/occupation) + PostgreSQL mein structured scheme database (schemes, eligibility_rules, documents_required). ML: LLM sirf offline PDF→JSON extraction ke liye, optional.

**✅ Stage 3 — RAG Assistant**
Chat interface jo Gemini embeddings + pgvector similarity search + Gemini generation use karke grounded answers deta hai, source citations ke saath.

**✅ Stage 4 — Deterministic Eligibility Engine**
Rule-based evaluation (income <= 300000) — kabhi LLM se eligibility decide nahi hoti. Pass/fail/unknown per rule, fully explainable.

**✅ Stage 5 — Recommendation + Dashboard**
Top Matches, match %, weighted scoring (plain math) — MVP complete hone ka milestone.

**✅ Stage 6 — Life Event Engine + Family Optimizer**
Free-text life events (LLM classification) → category mapping. Family members add karke per-member eligibility + mutually-exclusive/one-per-family conflict detection.

**✅ Stage 7 — Document Intelligence**
Tesseract OCR (pretrained) + Gemini field extraction. Expiry detection, structured field preview.

**✅ Stage 8 — Form Mistake Detector + DBT Readiness Checker**
Fuzzy name matching, field cross-comparison — pure algorithm, ML nahi.

**✅ Stage 9 — Application Risk Predictor + Rejection Debugger**
Rejection letter + scheme rules + user docs → LLM reasoning se root-cause explanation.

**✅ Stage 10 — Counterfactual Simulator**
"Agar income ₹50k kam ho toh..." — eligibility engine ko hypothetical inputs ke saath re-run karna.

**✅ Stage 11 — Family Benefit Optimizer (Deep)**
Stage 6 mein hi merge ho gaya — poore family ke liye best combination.

**✅ Stage 12 — Application Copilot + Deadline Engine**
Proactive deadline alerts, application-filling guidance.

<br/>

*Note: Stages 13-19 (Regulatory Monitoring Pipeline & Admin Review) are also fully implemented in the backend/AI-service architecture!*

<br/>

## 6. Local Setup & Getting Started

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### Backend (Node.js/Express)
*Requires local MongoDB running on default port.*
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### AI Service (Python/FastAPI)
*Requires local PostgreSQL with `pgvector` extension running on default port.*
```bash
cd ai-service
# (Windows)
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
# Running on http://localhost:8000
```

<br/>

## 7. Environment Variables

**`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/adhikar
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:8000
```

**`ai-service/.env`**
```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/adhikar_ai
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

<br/>

<div align="center">
  <sub><b>Adhikar</b> â€” Your Right, Delivered.</sub>
</div>

