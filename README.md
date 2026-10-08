<div align="center">
  <img src="docs/assets/banner.png" alt="Adhikar project banner" width="100%" />
</div>

<br/>

<div align="center">

  <a href="https://adhikar-seven.vercel.app/">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=900&color=FF9933&center=true&vCenter=true&width=820&lines=Because+claiming+a+government+scheme;shouldn't+feel+like+a+government+scheme.;Discover+%E2%86%92+Verify+%E2%86%92+Apply+%E2%86%92+Track;Deterministic+eligibility.+Zero+LLM+guesswork.;Your+Right%2C+Delivered.+%F0%9F%87%AE%F0%9F%87%B3" alt="Adhikar animated tagline" />
  </a>

  <p><i>A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>

  <br/>

  <h3>🚀 <a href="https://adhikar-seven.vercel.app/" target="_blank">Live Demo: adhikar-seven.vercel.app</a> 🚀</h3>

  <br/>

  <a href="https://adhikar-seven.vercel.app/"><img src="https://img.shields.io/badge/🌐_LIVE_DEMO-FF9933?style=for-the-badge&logoColor=white" alt="Live demo"/></a>
  <img src="https://img.shields.io/badge/ROADMAP-19%2F19_STAGES-138808?style=for-the-badge" alt="Roadmap"/>
  <img src="https://img.shields.io/badge/ARCHITECTURE-DUAL_BACKEND-000080?style=for-the-badge" alt="Architecture"/>
  <img src="https://img.shields.io/badge/ELIGIBILITY-DETERMINISTIC-8E24AA?style=for-the-badge" alt="Deterministic"/>

  <br/><br/>

  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/pgvector-336791?style=flat-square&logo=postgresql&logoColor=white" alt="pgvector"/>
  <img src="https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square&logo=langchain&logoColor=white" alt="LangGraph"/>
  <img src="https://img.shields.io/badge/Gemini_2.0_Flash-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini"/>

</div>

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF9933,50:FFFFFF,100:138808&height=4" width="100%" alt="divider"/>

## 📑 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

1. [The Problem](#-the-problem)
2. [What is Adhikar?](#-what-is-adhikar)
3. [Feature Highlights](#-feature-highlights)
4. [How It Works](#-how-it-works)
5. [Why Two Backends?](#-why-two-backends)
6. [System Architecture](#-system-architecture)
7. [Deep Dives](#-deep-dives)
8. [Regulatory Monitoring Pipeline](#-regulatory-monitoring-pipeline)
9. [Roadmap](#-roadmap)
10. [Resilience & Security](#-resilience--security)
11. [Tech Stack](#-tech-stack)
12. [Screenshots](#-screenshots)
13. [Getting Started](#-getting-started)
14. [Environment Variables](#-environment-variables)
15. [Project Structure](#-project-structure)
16. [Contributing](#-contributing)
17. [Author](#-author)

</details>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF9933,50:FFFFFF,100:138808&height=4" width="100%" alt="divider"/>

## 💔 The Problem

India runs **hundreds of welfare schemes**, yet millions of eligible citizens never claim them. The system is fragmented:

| 😵 Pain point | What citizens face today |
|---|---|
| **Discovery** | No single place to find what you qualify for |
| **Eligibility** | Rules buried inside dense legal PDFs and gazettes |
| **Family conflicts** | Overlapping or mutually exclusive schemes, no guidance |
| **Application errors** | Name mismatches and wrong documents found only *after* rejection |
| **Rejections** | A generic "Not eligible" with zero explanation |
| **Stale information** | Rules change, old PDFs and portal links stay online |

## 🏛️ What is Adhikar?

**Adhikar** is an end-to-end intelligent platform that fixes this. It:

1. 📥 **Ingests** complex government PDFs and portals
2. 🧮 **Converts** them into strict, deterministic eligibility rules
3. 🎯 **Matches** those rules against citizen and family profiles
4. 🧑‍✈️ **Guides** applications with an AI Copilot and OCR field extraction
5. 🔧 **Debugs** rejections with multimodal reasoning and exact rule citations
6. 📡 **Monitors** government sources and auto-updates rules through a human-approved pipeline

> [!IMPORTANT]
> **Design principle:** the LLM **never** decides eligibility. Eligibility is always computed by a deterministic, fully explainable rule engine. AI is used only for understanding, extraction, and explanation.

### 🆚 Adhikar vs Traditional Platforms

| Feature | 🐢 Traditional Platforms | 🚀 Adhikar |
|---|---|---|
| Rule interpretation | Manual reading | Automated deterministic evaluation |
| Scope | Individual | Full **family** optimization |
| Application errors | Caught after rejection | Caught by DBT mismatch checker **before** submit |
| Application help | Helpdesk | AI Copilot + automatic OCR field extraction |
| Rejections | Generic "Not eligible" | Debugger with **exact rule citations** |
| Regulatory changes | Outdated PDF links | Automated pipeline: crawl → diff → impact → notify |

## ✨ Feature Highlights

<table>
<tr>
<td width="33%" valign="top">

### 🔍 Smart Discovery
RAG assistant using Gemini embeddings + pgvector. Every answer is **grounded** with source citations.

</td>
<td width="33%" valign="top">

### ⚖️ Deterministic Engine
Pass / fail / unknown **per rule** (e.g. `income <= 300000`). Fully explainable, never LLM-decided.

</td>
<td width="33%" valign="top">

### 🏆 Match Scoring
Top matches with weighted match-percentage scoring, plain math, on a clean dashboard.

</td>
</tr>
<tr>
<td valign="top">

### 👨‍👩‍👧 Family Optimizer
Per-member eligibility with **mutually-exclusive** and **one-per-family** conflict detection.

</td>
<td valign="top">

### 🌱 Life Event Engine
Free-text events (marriage, job loss, birth…) classified into scheme categories.

</td>
<td valign="top">

### 📄 Document Intelligence
Tesseract OCR + Gemini field extraction, expiry detection, structured field preview.

</td>
</tr>
<tr>
<td valign="top">

### ✅ Pre-submit Checks
Form mistake detector + **DBT readiness checker** with fuzzy name matching.

</td>
<td valign="top">

### 🚨 Rejection Debugger
Rejection letter + rules + docs → root cause **with rule citations**.

</td>
<td valign="top">

### 🔮 Counterfactual Simulator
"What if my income were ₹50k lower?" Re-runs the engine on hypothetical inputs.

</td>
</tr>
<tr>
<td valign="top">

### 🤖 Application Copilot
Step-by-step form guidance plus proactive **deadline alerts**.

</td>
<td valign="top">

### 📡 Regulatory Monitoring
Crawl, diff, version, and analyze impact of every government rule change.

</td>
<td valign="top">

### 🎫 Helpdesk & Grievance
Citizen ticketing to track state-level complaints end to end.

</td>
</tr>
</table>

## 🧭 How It Works

The citizen journey, from first login to a successful application:

```mermaid
flowchart LR
    A(["👤 Citizen signs up"]):::user --> B["📝 Builds profile<br/>+ adds family"]:::step
    B --> C["🔍 Discovers schemes<br/>RAG + Life Events"]:::ai
    C --> D{"⚖️ Deterministic<br/>Eligibility Engine"}:::engine
    D -->|"✅ Eligible"| E["👨‍👩‍👧 Family Optimizer<br/>best combination"]:::step
    D -->|"❌ Not eligible"| X["🔮 Counterfactual<br/>what would change this?"]:::ai
    E --> F["📄 Upload docs<br/>OCR + extraction"]:::ai
    F --> G["✅ DBT + form<br/>mistake checks"]:::engine
    G --> H["🤖 AI Copilot<br/>fills and guides"]:::ai
    H --> I(["🎉 Application submitted"]):::done
    I -->|"Rejected?"| J["🚨 Rejection Debugger<br/>exact rule citations"]:::ai
    J --> F

    classDef user fill:#FF9933,stroke:#cc7a00,color:#000
    classDef step fill:#e3f2fd,stroke:#1976d2,color:#000
    classDef ai fill:#ede7f6,stroke:#7e57c2,color:#000
    classDef engine fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef done fill:#138808,stroke:#0b5a05,color:#fff
```

## 🧩 Why Two Backends?

Adhikar is deliberately a **distributed system**, not a monolith.

<table>
<tr>
<td width="50%" valign="top">

### 🟢 Node.js / Express
**Product Backend**

- Fast, typed CRUD
- Users, families, applications, tickets
- Auth, JWT, rate limiting
- Owns **MongoDB**

</td>
<td width="50%" valign="top">

### 🐍 Python / FastAPI
**AI Service**

- Reasoning, embeddings, LangGraph
- Multimodal document extraction
- Deterministic rule engine
- Owns **PostgreSQL + pgvector**

</td>
</tr>
</table>

Each service uses the best tooling for its job and scales independently.

## 🏗️ System Architecture

![Adhikar System Architecture](docs/assets/architecture.png)

### Service topology

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ Client"]
        FE["React + Vite + TS<br/>TanStack Router"]
    end

    subgraph PRODUCT["🟢 Product Backend (Node / Express)"]
        API["REST API<br/>JWT • Rate limit"]
        MDB[("MongoDB<br/>users • families<br/>applications • tickets")]
        API --- MDB
    end

    subgraph AISVC["🐍 AI Service (FastAPI)"]
        RAG["RAG Assistant"]
        ENG["Deterministic<br/>Rule Engine"]
        OCRM["Document<br/>Intelligence"]
        REG["Regulatory<br/>Pipeline"]
        PGV[("PostgreSQL + pgvector<br/>schemes • rules • embeddings")]
        RAG --- PGV
        ENG --- PGV
        REG --- PGV
    end

    subgraph EXT["☁️ External"]
        GEM["Google Gemini 2.0 Flash"]
        TES["Tesseract OCR"]
        GOV["Government portals<br/>and PDF circulars"]
    end

    FE <-->|"HTTPS"| API
    API <-->|"internal HTTP"| AISVC
    RAG --> GEM
    OCRM --> GEM
    OCRM --> TES
    REG --> GOV

    style CLIENT fill:#e3f2fd,stroke:#1976d2
    style PRODUCT fill:#e8f5e9,stroke:#2e7d32
    style AISVC fill:#fff3e0,stroke:#ef6c00
    style EXT fill:#f3e5f5,stroke:#7b1fa2
```

### Example: RAG question answering

```mermaid
sequenceDiagram
    autonumber
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

## 🔬 Deep Dives

<details open>
<summary><b>⚖️ Deterministic Eligibility Engine: from PDF to verdict</b></summary>

<br/>

```mermaid
flowchart LR
    P["📑 Government PDF<br/>or notification"] --> L["🧠 LLM extraction<br/>(offline, optional)"]
    L --> J["🧾 Structured rules<br/>JSON"]
    J --> R[("Rule store<br/>eligibility_rules")]
    U["👤 User / family profile"] --> E
    R --> E{"⚙️ Rule Engine<br/>no LLM involved"}
    E --> V1["✅ PASS"]
    E --> V2["❌ FAIL"]
    E --> V3["❓ UNKNOWN<br/>missing data"]
    V1 & V2 & V3 --> X["📋 Explainable result<br/>per-rule breakdown"]

    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:3px
    style V1 fill:#c8e6c9,stroke:#2e7d32
    style V2 fill:#ffcdd2,stroke:#c62828
    style V3 fill:#fff9c4,stroke:#f9a825
```

The LLM is used **only offline** to turn PDFs into rules. Every live decision is plain, auditable logic.

</details>

<details>
<summary><b>👨‍👩‍👧 Family Benefit Optimizer</b></summary>

<br/>

```mermaid
flowchart TB
    F["👨‍👩‍👧 Family members<br/>+ profiles"] --> M["Per-member<br/>eligibility run"]
    M --> C{"Conflict<br/>detection"}
    C -->|"Mutually exclusive"| ME["Pick best option<br/>per member"]
    C -->|"One per family"| OF["Assign to the<br/>highest-benefit member"]
    C -->|"No conflict"| OK["Keep all"]
    ME & OF & OK --> BEST["🏆 Best scheme combination<br/>for the whole family"]

    style BEST fill:#138808,color:#fff,stroke:#0b5a05
```

</details>

<details>
<summary><b>🚨 Rejection Debugger and Counterfactual Simulator</b></summary>

<br/>

```mermaid
flowchart LR
    subgraph DEBUG["🚨 Rejection Debugger"]
        direction TB
        RL["📩 Rejection letter"] --> RC["Multimodal<br/>LLM reasoning"]
        SR["Scheme rules"] --> RC
        UD["User documents"] --> RC
        RC --> RCA["🎯 Root cause<br/>+ rule citations"]
    end

    subgraph SIM["🔮 Counterfactual Simulator"]
        direction TB
        HI["Hypothetical input<br/>'income ₹50k lower'"] --> RE["Re-run<br/>rule engine"]
        RE --> NR["New eligibility<br/>outcome"]
    end

    RCA -.->|"fix and retry"| HI

    style DEBUG fill:#ffebee,stroke:#c62828
    style SIM fill:#e8eaf6,stroke:#3949ab
```

</details>

<details>
<summary><b>✅ Pre-submit validation: DBT readiness</b></summary>

<br/>

```mermaid
flowchart LR
    D1["Aadhaar name"] --> FZ{"Fuzzy name<br/>matcher"}
    D2["Bank passbook name"] --> FZ
    D3["Form entry"] --> FZ
    FZ -->|"Match"| OKK["✅ DBT ready"]
    FZ -->|"Mismatch"| WARN["⚠️ Fix before submit<br/>(avoids rejection)"]

    style OKK fill:#c8e6c9,stroke:#2e7d32
    style WARN fill:#fff9c4,stroke:#f9a825
```

</details>

## 📡 Regulatory Monitoring Pipeline

Government rules change often. Adhikar keeps up **automatically**, with a human in the loop.

```mermaid
flowchart LR
    A["🌐 13. Fetch portals<br/>and PDFs"] --> B["🔎 14. Hash + text diff<br/>filter cosmetic changes"]
    B --> C["🧾 14. Rule diff<br/>+ SchemeVersion history"]
    C --> D["⚖️ 16. Source conflict<br/>resolution"]
    D --> E{"🛂 19. Admin<br/>approval queue"}
    E -->|"Rejected"| Z(["🗑️ Discarded"])
    E -->|"Approved"| F["📝 Live rules updated"]
    F --> G["📊 15. Impact analysis<br/>lost / gained / unchanged"]
    G --> H["🔁 17. Auto eligibility<br/>re-check"]
    H --> I["🔔 18. Notify affected<br/>citizens"]

    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:3px
    style I fill:#138808,color:#fff,stroke:#0b5a05
    style Z fill:#ffcdd2,stroke:#c62828
```

**Source authority ranking** used for conflict resolution (highest wins, recency breaks ties):

```mermaid
flowchart LR
    G1["🏛️ Gazette"] --> G2["📜 Circular"] --> G3["🌐 Portal"] --> G4["📰 Press release"]
    style G1 fill:#138808,color:#fff
    style G2 fill:#66bb6a
    style G3 fill:#fff176
    style G4 fill:#ef9a9a
```

**Lifecycle of a rule change:**

```mermaid
stateDiagram-v2
    [*] --> Detected: crawler finds diff
    Detected --> Filtered: cosmetic change?
    Filtered --> [*]: ignored
    Detected --> PendingReview: material change
    PendingReview --> Approved: admin approves
    PendingReview --> Rejected: admin rejects
    Approved --> Live: rules updated and versioned
    Live --> UsersNotified: impact + re-check
    UsersNotified --> [*]
    Rejected --> [*]
```

## 🗺️ Roadmap

<div align="center">

![Progress](https://img.shields.io/badge/Progress-19%20of%2019%20stages-138808?style=for-the-badge)

`██████████████████████████████ 100%`

</div>

<details open>
<summary><b>🔷 Phase 1: Core Platform (Stages 1-12)</b></summary>

<br/>

| Stage | Module | Highlights |
|:---:|---|---|
| ✅ **1** | **Foundation** | Vite + React + TS + TanStack Router frontend, Express + TS + MongoDB backend, JWT + bcrypt auth |
| ✅ **2** | **Profile and Scheme Data Pipeline** | Profile form (age, state, education, income, occupation); structured scheme DB (schemes, eligibility rules, required documents); optional offline PDF→JSON extraction |
| ✅ **3** | **RAG Assistant** | Gemini embeddings + pgvector similarity search + grounded generation with citations |
| ✅ **4** | **Deterministic Eligibility Engine** | Pass / fail / unknown per rule, fully explainable, never LLM-decided |
| ✅ **5** | **Recommendations and Dashboard** | Top matches, weighted scoring (plain math), MVP milestone |
| ✅ **6** | **Life Event Engine + Family Optimizer** | LLM-classified life events; per-member eligibility and conflict detection |
| ✅ **7** | **Document Intelligence** | Tesseract OCR + Gemini field extraction, expiry detection |
| ✅ **8** | **Form Mistake Detector + DBT Readiness** | Fuzzy name matching and field cross-comparison (pure algorithms) |
| ✅ **9** | **Risk Predictor + Rejection Debugger** | Rejection letter + rules + docs → root-cause explanation |
| ✅ **10** | **Counterfactual Simulator** | Re-run eligibility with hypothetical inputs |
| ✅ **11** | **Family Benefit Optimizer (Deep)** | Best scheme combination across the whole family (merged into Stage 6) |
| ✅ **12** | **Application Copilot + Deadline Engine** | Proactive deadline alerts and filling guidance |

</details>

<details open>
<summary><b>🔶 Phase 2: Regulatory Monitoring Pipeline (Stages 13-19)</b></summary>

<br/>

| Stage | Module | Highlights |
|:---:|---|---|
| ✅ **13** | **Regulatory Data Collection** | Fetch HTML portals and PDF circulars; content-hash stamping (no ML) |
| ✅ **14** | **Change Detection and Version Control** | Hash compare + line diff filtering cosmetic changes; structured rule diff; immutable `SchemeVersion` history |
| ✅ **15** | **Regulatory Impact Analysis** | Re-run engine on existing profiles to find lost / gained / unchanged eligibility |
| ✅ **16** | **Source Conflict Resolution** | Authority ranking (gazette > circular > portal > press release) plus recency |
| ✅ **17** | **Automatic Eligibility Re-check** | Auto re-evaluate users when an eligibility-critical rule change is approved |
| ✅ **18** | **Affected User Notification** | Citizen alerts with unread badge, mark-as-read, and source link |
| ✅ **19** | **Admin Verification and Approval Queue** | Human review of every change; rules go live and notifications fire only after approval |

</details>

## 🛡️ Resilience & Security

Recent upgrades bring Adhikar closer to a production-grade government platform.

```mermaid
flowchart TB
    subgraph SEARCH["🔎 Scheme search fallback"]
        direction LR
        S1["Node API"] --> S2{"Python semantic<br/>search online?"}
        S2 -->|"Yes"| S3["🧠 pgvector<br/>semantic results"]
        S2 -->|"No"| S4["🍃 MongoDB<br/>dynamic filtering"]
    end

    subgraph OCRF["📄 Document extraction fallback"]
        direction LR
        O1["Upload"] --> O2{"AI document<br/>model available?"}
        O2 -->|"Yes"| O3["🤖 Gemini<br/>extraction"]
        O2 -->|"No"| O4["🧩 Heuristic<br/>parsing"]
    end

    subgraph DBF["🐘 AI service startup"]
        direction LR
        D1["FastAPI boots"] --> D2{"PostgreSQL +<br/>pgvector up?"}
        D2 -->|"Yes"| D3["Full feature set"]
        D2 -->|"No"| D4["Core routing alive<br/>+ built-in heuristics"]
    end

    style SEARCH fill:#e8f5e9,stroke:#2e7d32
    style OCRF fill:#e3f2fd,stroke:#1976d2
    style DBF fill:#fff3e0,stroke:#ef6c00
```

| 🛡️ Capability | What it does |
|---|---|
| **Graceful DB degradation** | AI service starts with built-in heuristics even if PostgreSQL/pgvector is down; non-essential features degrade, core routing stays alive |
| **Dual-database resilience** | Node.js falls back to MongoDB-based scheme search with dynamic filtering if the Python semantic-search service goes offline |
| **Robust OCR fallbacks** | Document extraction degrades to heuristic parsing when the AI model is unavailable, so uploads are never blocked |
| **Strict authentication** | bcrypt hashing, API-layer JWT validation, secure password recovery, explicit type checking |
| **Rate limiting** | Protects critical endpoints from spam and abuse |
| **Helpdesk and grievance redressal** | Centralized citizen ticketing integrated with Mongoose models for tracking state-level complaints |

## 🧰 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,ts,nodejs,express,mongodb,python,fastapi,postgres,git,github,vercel&perline=12" alt="Tech stack icons" />

</div>

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, TypeScript, TanStack Router |
| **Product Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt |
| **AI Service** | Python, FastAPI, LangGraph, SQLAlchemy |
| **Databases** | MongoDB, PostgreSQL with `pgvector` |
| **AI / ML** | Google Gemini 2.0 Flash (NLP, OCR assist, embeddings), Tesseract OCR |
| **Deployment** | Vercel (frontend) |

## 📸 Screenshots

> Replace the placeholders below with real screenshots or GIFs from `docs/assets/`.

<table>
<tr>
<td align="center" width="50%">
<img src="docs/assets/screenshots/dashboard.png" alt="Dashboard" /><br/>
<b>🏆 Dashboard and Top Matches</b>
</td>
<td align="center" width="50%">
<img src="docs/assets/screenshots/rag-assistant.png" alt="RAG Assistant" /><br/>
<b>💬 RAG Assistant with citations</b>
</td>
</tr>
<tr>
<td align="center">
<img src="docs/assets/screenshots/family-optimizer.png" alt="Family Optimizer" /><br/>
<b>👨‍👩‍👧 Family Optimizer</b>
</td>
<td align="center">
<img src="docs/assets/screenshots/rejection-debugger.png" alt="Rejection Debugger" /><br/>
<b>🚨 Rejection Debugger</b>
</td>
</tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB running locally on the default port
- PostgreSQL with the `pgvector` extension
- A Google Gemini API key

### 1️⃣ Clone

```bash
git clone https://github.com/Akshatsrii/<your-repo-name>.git
cd <your-repo-name>
```

<details>
<summary><b>2️⃣ Frontend (React / Vite)</b></summary>

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

</details>

<details>
<summary><b>3️⃣ Backend (Node.js / Express)</b></summary>

> Requires local MongoDB on the default port.

```bash
cd backend
npm install
npm run dev
# http://localhost:5000
```

</details>

<details>
<summary><b>4️⃣ AI Service (Python / FastAPI)</b></summary>

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
# http://localhost:8000   (interactive docs: /docs)
```

</details>

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:5173 |
| 🟢 Backend API | http://localhost:5000 |
| 🐍 AI Service | http://localhost:8000 |

## 🔐 Environment Variables

> [!WARNING]
> Never commit real secrets. Keep every `.env` file in `.gitignore`.

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

## 📂 Project Structure

```text
adhikar/
├── frontend/        # React + Vite + TypeScript + TanStack Router
├── backend/         # Node.js + Express + TypeScript + MongoDB
├── ai-service/      # FastAPI: RAG, rule engine, OCR, regulatory pipeline
│   └── app/
├── docs/
│   └── assets/      # banner, architecture diagram, screenshots
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m "feat: add amazing feature"`
4. 📤 Push the branch: `git push origin feature/amazing-feature`
5. 🔀 Open a Pull Request

## 👤 Author

<div align="center">

**Akshat Srivastava**

<a href="https://github.com/Akshatsrii"><img src="https://img.shields.io/badge/GitHub-Akshatsrii-181717?style=for-the-badge&logo=github" alt="GitHub"/></a>
<a href="https://leetcode.com/Akshatsrivastava007"><img src="https://img.shields.io/badge/LeetCode-Akshatsrivastava007-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode"/></a>

<br/><br/>

⭐ **If Adhikar helped you or inspired you, please star the repo!** ⭐

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF9933,50:FFFFFF,100:138808&height=120&section=footer&text=Adhikar%20%E2%80%94%20Your%20Right%2C%20Delivered.&fontSize=22&fontColor=000080&animation=fadeIn&fontAlignY=70" width="100%" alt="footer"/>
u p d a t e  
 u p d a t e 2  
 u p d a t e 3  
  
 