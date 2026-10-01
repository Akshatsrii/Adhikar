<div align="center">
  <img src="docs/assets/banner.png" alt="Adhikar project banner" width="100%" />
</div>

<br/>

<div align="center">
  <p><strong>Because claiming a government scheme shouldn't feel like a government scheme.</strong></p>
  <p><i>A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>
  <br/>
  <h3>🚀 <a href="https://adhikar-seven.vercel.app/" target="_blank">Live Demo: adhikar-seven.vercel.app</a> 🚀</h3>
</div>

<br/>

<div align="center">

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20TS-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/AI%20Service-FastAPI-009688?logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white)
![Postgres](https://img.shields.io/badge/Vector%20DB-PostgreSQL%20%2B%20pgvector-4169E1?logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/LLM-Gemini%202.0%20Flash-8E75B2?logo=googlegemini&logoColor=white)
![Status](https://img.shields.io/badge/Roadmap-19%20stages%20complete-success)

</div>

---

## 📑 Table of Contents

- [What is Adhikar?](#-what-is-adhikar)
- [Key Features](#-key-features)
- [Adhikar vs Traditional Platforms](#-adhikar-vs-traditional-platforms)
- [Why Two Backends?](#-why-two-backends)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Roadmap](#-roadmap)
- [Resilience & Security](#-resilience--security)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎯 What is Adhikar?

India has hundreds of welfare schemes, yet citizens face a **fragmentation crisis**: finding what they qualify for, decoding legal eligibility language, tracking deadlines, resolving overlapping family-level conflicts, and understanding why an application was rejected.

**Adhikar** is an end-to-end intelligent platform that solves this. It:

1. **Ingests** complex government PDFs and portals.
2. **Converts** them into strict, deterministic eligibility rules.
3. **Matches** those rules against citizen and family profiles.
4. **Guides** applications with an AI Copilot and OCR-based field extraction.
5. **Debugs** rejections with multimodal reasoning and exact rule citations.
6. **Monitors** government sources continuously and auto-updates rules through a human-approved Regulatory Pipeline.

> **Design principle:** the LLM never decides eligibility. Eligibility is always computed by a deterministic, explainable rule engine. AI is used only for understanding, extraction, and explanation.

---

## ✨ Key Features

| Area | What Adhikar does |
|---|---|
| 🔍 **Scheme Discovery** | RAG assistant with Gemini embeddings + pgvector search, returning grounded answers with source citations |
| ⚖️ **Eligibility Engine** | Rule-based pass / fail / unknown per rule (e.g. `income <= 300000`), fully explainable |
| 🏆 **Recommendations** | Top matches with weighted match-percentage scoring |
| 👨‍👩‍👧 **Family Optimizer** | Per-member eligibility with mutually-exclusive / one-per-family conflict detection |
| 🌱 **Life Event Engine** | Free-text life events (marriage, job loss, birth…) classified into scheme categories |
| 📄 **Document Intelligence** | Tesseract OCR + Gemini field extraction, expiry detection, structured preview |
| ✅ **Pre-submit Checks** | Form mistake detector + DBT readiness checker (fuzzy name matching, cross-field comparison) |
| 🚨 **Rejection Debugger** | Rejection letter + scheme rules + user docs → root-cause explanation with rule citations |
| 🔮 **Counterfactual Simulator** | "What if my income were ₹50k lower?" — re-runs the engine on hypothetical inputs |
| 🤖 **Application Copilot** | Step-by-step form guidance and proactive deadline alerts |
| 📡 **Regulatory Monitoring** | Crawls, diffs, versions, and analyzes impact of every government rule change |
| 🎫 **Helpdesk & Grievance** | Citizen ticketing system for tracking state-level complaints |

---

## 🆚 Adhikar vs Traditional Platforms

| Feature | Traditional Platforms | Adhikar |
|---|---|---|
| Rule interpretation | Manual reading | Automated deterministic evaluation |
| Scope | Individual | Full family optimization |
| Application errors | Caught after rejection | Caught by DBT mismatch checker **before** submit |
| Application help | Helpdesk | AI Copilot + automatic OCR field extraction |
| Rejections | Generic "Not eligible" | Debugger with exact rule citations |
| Regulatory changes | Outdated PDF links | Automated pipeline: crawl → diff → impact → notify |

---

## 🧩 Why Two Backends?

Adhikar is deliberately a **distributed system**, not a monolith:

- **Node.js / Express — Product Backend**
  Owns fast, typed CRUD (users, families, applications, tickets) on **MongoDB**.
- **Python / FastAPI — AI Service**
  Owns reasoning, embeddings, LangGraph workflows, multimodal document extraction, and the deterministic rule engine on **PostgreSQL + pgvector**.

This separation lets each service use the best tooling for its job and scale independently.

---

## 🏗️ System Architecture

![Adhikar System Architecture](docs/assets/architecture.png)

### High-level components

```mermaid
flowchart LR
    C([Citizen]) --> FE[React Frontend]
    FE --> API[Node / Express API]
    API --> M[(MongoDB)]
    API --> AI[Python FastAPI AI Service]
    AI --> PG[(PostgreSQL + pgvector)]
    AI --> G[Google Gemini 2.0 Flash]
    AI --> OCR[Tesseract OCR]
    CR[Regulatory Crawler] --> AI
    AI --> Q[Admin Approval Queue]
    Q --> API
```

### Example flow — RAG question answering

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

### Regulatory monitoring pipeline

```mermaid
flowchart LR
    A[Fetch portals & PDFs] --> B[Hash & text diff]
    B --> C[Rule diff + version history]
    C --> D[Source conflict resolution]
    D --> E[Admin review queue]
    E -->|approved| F[Update live rules]
    F --> G[Impact analysis]
    G --> H[Auto eligibility re-check]
    H --> I[Notify affected citizens]
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, TypeScript, TanStack Router |
| **Product Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt |
| **AI Service** | Python, FastAPI, LangGraph, SQLAlchemy |
| **Databases** | MongoDB, PostgreSQL with `pgvector` |
| **AI / ML** | Google Gemini 2.0 Flash (NLP, OCR assist, embeddings), Tesseract OCR |

---

## 🗺️ Roadmap

All stages below are **implemented**.

### Phase 1 — Core Platform

| Stage | Module | Highlights |
|---|---|---|
| ✅ 1 | **Foundation** | Vite + React + TS + TanStack Router frontend, Express + TS + MongoDB backend, JWT + bcrypt auth |
| ✅ 2 | **Profile & Scheme Data Pipeline** | Profile form (age, state, education, income, occupation); structured scheme DB (schemes, eligibility rules, required documents); optional offline PDF→JSON extraction |
| ✅ 3 | **RAG Assistant** | Gemini embeddings + pgvector similarity search + grounded generation with citations |
| ✅ 4 | **Deterministic Eligibility Engine** | Pass / fail / unknown per rule, fully explainable, never LLM-decided |
| ✅ 5 | **Recommendations & Dashboard** | Top matches, weighted scoring (plain math) — MVP milestone |
| ✅ 6 | **Life Event Engine + Family Optimizer** | LLM-classified life events; per-member eligibility and conflict detection |
| ✅ 7 | **Document Intelligence** | Tesseract OCR + Gemini field extraction, expiry detection |
| ✅ 8 | **Form Mistake Detector + DBT Readiness** | Fuzzy name matching and field cross-comparison (pure algorithms) |
| ✅ 9 | **Risk Predictor + Rejection Debugger** | Rejection letter + rules + docs → root-cause explanation |
| ✅ 10 | **Counterfactual Simulator** | Re-run eligibility with hypothetical inputs |
| ✅ 11 | **Family Benefit Optimizer (Deep)** | Best scheme combination across the whole family (merged into Stage 6) |
| ✅ 12 | **Application Copilot + Deadline Engine** | Proactive deadline alerts and filling guidance |

### Phase 2 — Regulatory Monitoring Pipeline

| Stage | Module | Highlights |
|---|---|---|
| ✅ 13 | **Regulatory Data Collection** | Fetch HTML portals and PDF circulars; content-hash stamping (no ML) |
| ✅ 14 | **Change Detection & Version Control** | Hash compare + line diff filtering cosmetic changes; structured rule diff; immutable `SchemeVersion` history |
| ✅ 15 | **Regulatory Impact Analysis** | Re-run engine on existing profiles to find lost / gained / unchanged eligibility |
| ✅ 16 | **Source Conflict Resolution** | Authority ranking (gazette > circular > portal > press release) plus recency |
| ✅ 17 | **Automatic Eligibility Re-check** | Auto re-evaluate users when an eligibility-critical rule change is approved |
| ✅ 18 | **Affected User Notification** | Citizen alerts with unread badge, mark-as-read, and source link |
| ✅ 19 | **Admin Verification & Approval Queue** | Human review of every change; rules go live and notifications fire only after approval |

---

## 🛡️ Resilience & Security

Recent upgrades bring Adhikar closer to a production-grade government platform:

- **Graceful DB degradation** — the AI service starts with built-in heuristics even if PostgreSQL/pgvector is down, degrading non-essential features while core routing stays alive.
- **Dual-database resilience** — Node.js falls back to MongoDB-based scheme search with dynamic filtering if the Python semantic-search service goes offline.
- **Robust OCR fallbacks** — document extraction degrades to heuristic parsing when the AI model is unavailable, so uploads are never blocked.
- **Strict authentication & security** — bcrypt hashing, API-layer JWT validation, secure password-recovery flows, explicit type checking, and rate limiting on critical endpoints.
- **Helpdesk & grievance redressal** — centralized citizen ticketing, integrated with backend Mongoose models, for tracking state-level complaints.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB running locally on the default port
- PostgreSQL with the `pgvector` extension
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Akshatsrii/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### 3. Backend (Node.js / Express)

> Requires local MongoDB on the default port.

```bash
cd backend
npm install
npm run dev
# http://localhost:5000
```

### 4. AI Service (Python / FastAPI)

> Requires local PostgreSQL with the `pgvector` extension on the default port.

```bash
cd ai-service

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
# python3 -m venv venv
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
# http://localhost:8000
```

> FastAPI interactive docs are available at `http://localhost:8000/docs`.

---

## 🔐 Environment Variables

Create a `.env` file in each service. **Never commit real secrets** — keep `.env` in `.gitignore`.

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

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👤 Author

**Akshat Srivastava**
GitHub: [@Akshatsrii](https://github.com/Akshatsrii)

---

<div align="center">
  <sub><b>Adhikar</b> — Your Right, Delivered. 🇮🇳</sub>
</div>
