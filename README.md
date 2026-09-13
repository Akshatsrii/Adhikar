<div align="center">
  <img src="docs/assets/banner.png" width="100%" alt="Adhikar banner" />
</div>

<div align="center">
  <h1>Adhikar</h1>
  <h3>अधिकार — Your Right, Delivered</h3>
  <p>An AI system that understands a citizen's life, family, documents and life events — so government benefits find them, instead of the other way around.</p>
</div>

<br/>

<br/>

## Table of Contents
- [1. The Problem](#1-the-problem)
- [2. What Adhikar Actually Does](#2-what-adhikar-actually-does)
- [3. What Makes It Different](#3-what-makes-it-different)
- [4. System Architecture](#4-system-architecture)
- [5. End-to-End Request Flow](#5-end-to-end-request-flow)
- [6. The Eligibility Engine — Why It's Not "Just an LLM"](#6-the-eligibility-engine--why-its-not-just-an-llm)
- [7. Data Model](#7-data-model)
- [8. Tech Stack](#8-tech-stack)
- [9. Feature Roadmap](#9-feature-roadmap)
- [10. Project Structure](#10-project-structure)
- [11. Getting Started](#11-getting-started)
- [12. Environment Variables](#12-environment-variables)

<br/>

## 1. The Problem
India runs thousands of welfare schemes across central, state, and local governments — scholarships, pensions, subsidies, insurance, housing, and skill-development benefits. Yet a huge share of eligible citizens never receive them, for two very different reasons:

| # | Failure | Description | Who addresses it today |
|---|---|---|---|
| 1 | Discovery failure | Citizens don't know a scheme exists, or wrongly assume they don't qualify | myScheme, Jan Soochna, Haqdarshak (partially) |
| 2 | Disbursement failure | Application is approved, but money never arrives — Aadhaar-bank seeding mismatch, name/DOB mismatch, dormant account, wrong IFSC | Nobody, meaningfully |

Almost every existing platform stops at problem #1. Adhikar treats problem #2 as a first-class feature, not an afterthought — because "eligible" means nothing if the benefit never lands in the citizen's account.

<br/>

## 2. What Adhikar Actually Does
- **Understands the citizen** — profile, family, income, education, occupation, and life events (marriage, childbirth, graduation, job loss).
- **Finds every scheme they qualify for** — using a hybrid of semantic search (RAG) and a deterministic rule engine, not LLM guesswork.
- **Optimizes at the family level** — flags mutually-exclusive schemes and suggests the combination that maximizes total benefit.
- **Catches mistakes before submission** — name mismatches, missing documents, expired certificates, DBT/bank-seeding issues.
- **Explains rejections** — reads a rejection letter, cross-checks it against scheme rules and the citizen's documents, and gives a specific, evidence-backed reason.
- **Predicts what's about to be missed** — deadline alerts and "what-if" simulations ("agar aapki income ₹50,000 kam ho, toh aap 3 aur schemes ke liye eligible ho jaate hain").

<br/>

## 3. What Makes It Different

| Capability | myScheme / Haqdarshak | Adhikar |
|---|---|---|
| Scheme discovery + search | ✅ | ✅ |
| Eligibility questionnaire | ✅ | ✅ (deterministic rule engine, not LLM guesswork) |
| Family-level optimization with conflict detection | ❌ | ✅ |
| Benefit-loss prediction (proactive alerts) | ❌ | ✅ |
| Counterfactual "what-if" eligibility simulation | ❌ | ✅ |
| Document / form mismatch detection | ❌ | ✅ |
| DBT / disbursement readiness check | ❌ | ✅ |
| Government rejection-letter root-cause analysis | ❌ | ✅ |
| Source-conflict resolution across govt. documents | ❌ | ✅ |

No single existing platform combines discovery + deterministic eligibility + family optimization + disbursement assurance + rejection diagnostics into one coherent product. That combination — not any single feature — is the actual differentiation.

<br/>

## 4. System Architecture
<div align="center">
  <img src="docs/assets/architecture.png" width="100%" alt="Adhikar system architecture" />
</div>

The system is deliberately split into two backends with distinct responsibilities — this separation is the difference between "a MERN project" and "a real distributed AI application":
- **Node.js / Express** owns product data — users, families, applications. Fast, simple, strongly-typed CRUD.
- **Python / FastAPI + LangGraph** owns AI reasoning — RAG, eligibility-rule extraction, document intelligence — because the Python AI ecosystem (LangGraph, embeddings, OCR) is far more mature than Node's for this class of problem.
- **MongoDB** stores flexible, user-shaped data (profiles, families, life events).
- **PostgreSQL + pgvector** stores structured government knowledge and its vector embeddings side by side, so a rule and the source text it was extracted from always live together.

<br/>

## 5. End-to-End Request Flow
```mermaid
sequenceDiagram
    actor Citizen
    participant FE as React Frontend
    participant API as Node/Express API
    participant AI as FastAPI + LangGraph
    participant PG as PostgreSQL + pgvector
    participant LLM as Google Gemini

    Citizen->>FE: "Rajasthan mein B.Tech scholarship?"
    FE->>API: POST /api/ai/ask
    API->>AI: forward query + user profile
    AI->>LLM: embed(query)
    LLM-->>AI: query vector
    AI->>PG: similarity search (top-k chunks)
    PG-->>AI: relevant scheme chunks + sources
    AI->>LLM: generate(answer | query, chunks)
    LLM-->>AI: grounded answer
    AI-->>API: answer + eligibility + citations
    API-->>FE: JSON response
    FE-->>Citizen: Answer card with source links
```

<br/>

## 6. The Eligibility Engine — Why It's Not "Just an LLM"
Eligibility decisions are never made directly by an LLM. A hallucinated "you're eligible" is a real-world harm here, not just a wrong chatbot answer — so the engine is built to be fully deterministic and explainable.

```mermaid
flowchart TD
    A[Government scheme PDF] -->|LLM: one-time offline extraction| B[Structured rule JSON]
    B --> C[(eligibility_rules table)]
    D[User profile] --> E{Rule Engine}
    C --> E
    E -->|All conditions pass| F[✅ Eligible]
    E -->|Some conditions fail| G[❌ Not eligible + reason]
    E -->|Missing profile data| H[⚠️ Need more information]
```

The LLM is used once, offline, to turn unstructured government text into structured rules. At request time, eligibility is plain rule evaluation — fully reproducible, fully auditable, and impossible to hallucinate.

<br/>

## 7. Data Model
```mermaid
erDiagram
    USER ||--o{ FAMILY_MEMBER : has
    USER ||--o{ APPLICATION : submits
    USER ||--o{ LIFE_EVENT : reports
    USER ||--o{ DOCUMENT : uploads

    APPLICATION }o--|| SCHEME : "applies to"
    SCHEME ||--o{ ELIGIBILITY_RULE : "defined by"
    SCHEME ||--o{ SCHEME_VERSION : "tracked as"
    APPLICATION ||--o{ DOCUMENT : requires

    USER {
        string name
        string email
        object profile
    }
    SCHEME {
        string name
        string department
        string category
        string benefit
        string sourceUrl
    }
    ELIGIBILITY_RULE {
        string field
        string operator
        string value
    }
    APPLICATION {
        string status
        number riskScore
        boolean dbtReady
    }
```

- **MongoDB** — User, Family, LifeEvent, Application, Notification
- **PostgreSQL** — schemes, eligibility_rules, scheme_versions, sources (+ pgvector embeddings)

<br/>

## 8. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite), TanStack Router, Tailwind CSS |
| Main backend | Node.js + Express (TypeScript), Mongoose, JWT |
| AI backend | Python + FastAPI, LangGraph |
| LLM & embeddings | Google Gemini — generation + text-embedding-004 |
| Vector store | PostgreSQL + pgvector |
| Product database | MongoDB |
| OCR / document AI | Pretrained OCR model + Gemini structured extraction |
| Deployment | Docker, GitHub Actions |

A deliberate engineering choice: custom-trained ML models are used in essentially one place (document/OCR understanding, and even there a pretrained model is enough). Everywhere else — eligibility, recommendations, risk scoring, counterfactual simulation, form checking — stays rule-based or LLM-API-based. Determinism where correctness legally matters; LLMs only where language understanding is genuinely needed.

<br/>

## 9. Feature Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | MERN + TypeScript foundation, auth | ✅ Done |
| 2 | Government data pipeline + profile engine | ⏳ Next |
| 3 | RAG engine (Gemini + pgvector) | Planned |
| 4 | Deterministic eligibility engine | Planned |
| 5 | Recommendation engine | Planned |
| 6 | Life-event engine | Planned |
| 7 | Family benefit optimizer | Planned |
| 8 | Document intelligence (OCR) | Planned |
| 9 | Form mistake detector + DBT readiness checker | Planned |
| 10 | Application risk predictor | Planned |
| 11 | Government process debugger | Planned |
| 12 | Benefit-loss predictor + counterfactual simulator | Planned |
| 13 | Government scheme change detection + conflict resolution | Planned |
| 14 | Admin dashboard, evaluation, security, deployment | Planned |

<br/>

## 10. Project Structure
```text
adhikar/
├── frontend/             # React + TypeScript (Vite)
│   ├── src/
│   │   ├── routes/       # TanStack Router file-based routes
│   │   ├── lib/          # Typed API client
│   │   └── components/
│   └── ...
├── backend/              # Node.js + Express (TypeScript) — product API
│   ├── src/
│   │   ├── routes/       # /auth, /profile, /family, /applications
│   │   ├── models/       # Mongoose schemas
│   │   └── middleware/
│   └── ...
├── ai-service/           # Python + FastAPI + LangGraph — RAG, eligibility, docs
│   ├── app/
│   │   ├── routers/      # /ai/ask, /ai/eligibility, /ai/documents
│   │   ├── rag/          # embeddings, retrieval, generation
│   │   └── rules/        # rule engine, rule extraction
│   └── ...
├── docs/
│   └── assets/           # Logo, banner, architecture diagrams
└── README.md
```

<br/>

## 11. Getting Started

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (product API)
cd backend
npm install
cp .env.example .env
npm run dev

# AI service (once Stage 3 is built)
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend requires a running MongoDB instance (local install or Docker). The AI service requires a running PostgreSQL instance with the pgvector extension enabled.

<br/>

## 12. Environment Variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/adhikar
JWT_SECRET=your-secret-key
```

**ai-service/.env**
```env
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/adhikar_ai
```

<br/>

<div align="center">
  <sub>Built as a final-year major project · Rajasthan pilot scope · 30–50 verified government schemes</sub><br/>
  <sub><b>Adhikar</b> — अधिकार — Your Right, Delivered</sub>
</div>
