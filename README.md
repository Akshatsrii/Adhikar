<div align="center">
  <img src="docs/assets/banner.png" alt="Adhikar: Your Right, Delivered." width="100%" />
</div>

<br/>

<div align="center">

  <a href="https://adhikar-seven.vercel.app/">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=900&color=FF9933&center=true&vCenter=true&width=820&lines=Because+claiming+a+government+scheme;shouldn%27t+feel+like+a+government+scheme.;Discover+%E2%86%92+Verify+%E2%86%92+Apply+%E2%86%92+Track;Deterministic+eligibility.+Zero+LLM+guesswork.;Your+Right%2C+Delivered.+%F0%9F%87%AE%F0%9F%87%B3" alt="Adhikar animated tagline" />
  </a>

  <br/><br/>

  <img src="docs/assets/logo.png" alt="Adhikar logo" width="110" />

  <p><i>A dual-backend AI platform (Node.js + FastAPI + Gemini + pgvector) for government scheme discovery, deterministic eligibility, family optimization, and AI-assisted applications.</i></p>

  <h3>🚀 <a href="https://adhikar-seven.vercel.app/" target="_blank">Live Demo: adhikar-seven.vercel.app</a> 🚀</h3>

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
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini"/>
  <img src="https://img.shields.io/badge/Tesseract_OCR-3F51B5?style=flat-square" alt="Tesseract"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>

</div>

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF9933,50:FFFFFF,100:138808&height=4" width="100%" alt="divider"/>

## 📑 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

1. [The Problem](#-the-problem)
2. [What is Adhikar?](#-what-is-adhikar)
3. [Design Principles](#-design-principles)
4. [Feature Highlights](#-feature-highlights)
5. [How It Works (Citizen Journey)](#-how-it-works-citizen-journey)
6. [System Design](#-system-design)
   - [Level 1: System Context](#level-1--system-context)
   - [Level 2: Containers](#level-2--containers)
   - [Why Two Backends?](#-why-two-backends)
   - [Data Architecture](#-data-architecture)
   - [Request Lifecycle and Routing](#-request-lifecycle-and-routing)
   - [Dual-Engine Hybrid RAG](#-dual-engine-hybrid-rag)
   - [Failure Modes and Fallbacks](#-failure-modes-and-fallbacks)
   - [Deployment Topology](#-deployment-topology)
7. [Deep Dives](#-deep-dives)
8. [Regulatory Monitoring Pipeline](#-regulatory-monitoring-pipeline)
9. [Security Model](#-security-model)
10. [Key Design Decisions](#-key-design-decisions)
11. [Roadmap](#-roadmap)
12. [Tech Stack](#-tech-stack)
13. [Screenshots](#-screenshots)
14. [Getting Started](#-getting-started)
15. [Environment Variables](#-environment-variables)
16. [Project Structure](#-project-structure)
17. [Contributing](#-contributing)
18. [Author](#-author)

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
> **Core principle:** the LLM **never** decides eligibility. Eligibility is always computed by a deterministic, fully explainable rule engine. AI is used only for understanding, extraction, and explanation.

### 🆚 Adhikar vs Traditional Platforms

| Feature | 🐢 Traditional Platforms | 🚀 Adhikar |
|---|---|---|
| Rule interpretation | Manual reading | Automated deterministic evaluation |
| Scope | Individual | Full **family** optimization |
| Application errors | Caught after rejection | Caught by DBT mismatch checker **before** submit |
| Application help | Helpdesk | AI Copilot + automatic OCR field extraction |
| Rejections | Generic "Not eligible" | Debugger with **exact rule citations** |
| Regulatory changes | Outdated PDF links | Automated pipeline: crawl → diff → impact → notify |

## 🧭 Design Principles

```mermaid
mindmap
  root((Adhikar<br/>principles))
    Trust
      LLM never decides eligibility
      Every answer cites a source
      Human approves every rule change
    Resilience
      Every AI path has a non-AI fallback
      Cold starts never drop requests
      Graceful DB degradation
    Explainability
      Pass / Fail / Unknown per rule
      Rule citations on rejections
      Versioned scheme history
    Accessibility
      Hindi and English voice guide
      Guest access to RAG
      Mobile friendly flows
    Separation
      Node owns product data
      Python owns AI and vectors
      Independent scaling
```

| Principle | What it means in practice |
|---|---|
| **AI explains, rules decide** | LLMs extract, classify, and explain. Pass/fail logic is plain code. |
| **Fail soft, never fail closed** | If Python, Postgres, or Gemini is down, the citizen still gets an answer from a fallback path. |
| **Human in the loop** | No scraped rule change goes live without admin approval. |
| **Everything is traceable** | Each verdict links to rules, each rule to a version, each version to a source document. |
| **Right tool per job** | Node for CRUD and auth, Python for ML, Mongo for documents, Postgres for vectors. |

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
<tr>
<td valign="top">

### 🧮 Welfare Calculators (`/calculator`)
Interactive subsidy & benefit calculators for PMAY CLSS interest subsidies, APY guaranteed pension, PM-KISAN cashflows, and SSY maturity wealth.

</td>
<td valign="top">

### ⚖️ Scheme Comparator (`/compare`)
Side-by-side matrix comparing monetary benefits, income thresholds, age brackets, documents, and 1-click apply links across schemes.

</td>
<td valign="top">

### 🗣️ Multilingual Voice Guide
Web Speech API text-to-speech reader in Hindi and English with animated soundwaves for elderly and rural citizen accessibility.

</td>
</tr>
<tr>
<td valign="top">

### 🎯 Welfare Readiness Audit (`/readiness`)
100-point citizen KYC & documentation audit with dynamic SVG speedometer gauge and instant remedial steps.

</td>
<td valign="top">

### 📌 Saved Schemes & Dossier (`/saved`)
Private application tracking vault with custom notes, status management, and printable physical verification dossier.

</td>
<td valign="top">

### ⚡ Global Spotlight (`Ctrl+K`)
Blazing-fast command palette across 25+ real schemes, categories, and direct civic actions with keyboard navigation.

</td>
</tr>
<tr>
<td valign="top">

### 📊 Social Impact Dashboard (`/impact`)
Real-time national DBT expenditure visualizer with animated counter tick-ups, sector budget distributions, and state leadership benchmarks.

</td>
<td valign="top">

### 📰 Welfare News Feed (`/news`)
Live curated feed of official gazettes, quota extensions, and portal deadlines with sentiment tagging and breaking news tickers.

</td>
<td valign="top">

### ⏳ Application Timeline & AI Bubble (`/timeline`)
Visual status journey tracker with Kanban progress bars, combined with a persistent pulsating AI Copilot bubble on every page.

</td>
</tr>
</table>

## 🧭 How It Works (Citizen Journey)

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial','primaryColor':'#FFF3E0','primaryBorderColor':'#FF9933','lineColor':'#000080'}}}%%
flowchart LR
    A(["👤 Citizen signs up"]):::user --> B["📝 Builds profile<br/>+ adds family"]:::step
    B --> C["🔍 Discovers schemes<br/>RAG + Life Events"]:::ai
    C --> D{"⚖️ Deterministic<br/>Eligibility Engine"}:::engine
    D -->|"✅ Eligible"| E["👨‍👩‍👧 Family Optimizer<br/>best combination"]:::step
    D -->|"❌ Not eligible"| X["🔮 Counterfactual<br/>what would change this?"]:::ai
    D -->|"❓ Unknown"| Q["📝 Ask for missing<br/>profile fields"]:::step
    Q --> D
    E --> F["📄 Upload docs<br/>OCR + extraction"]:::ai
    F --> G["✅ DBT + form<br/>mistake checks"]:::engine
    G --> H["🤖 AI Copilot<br/>fills and guides"]:::ai
    H --> I(["🎉 Application submitted"]):::done
    I --> T["⏳ Timeline tracking<br/>+ deadline alerts"]:::step
    I -->|"Rejected?"| J["🚨 Rejection Debugger<br/>exact rule citations"]:::ai
    J --> F

    classDef user fill:#FF9933,stroke:#cc7a00,color:#000
    classDef step fill:#e3f2fd,stroke:#1976d2,color:#000
    classDef ai fill:#ede7f6,stroke:#7e57c2,color:#000
    classDef engine fill:#fff3e0,stroke:#ef6c00,color:#000
    classDef done fill:#138808,stroke:#0b5a05,color:#fff
```

**Legend:** 🟧 citizen action · 🟦 product step · 🟪 AI-assisted step · 🟠 deterministic logic · 🟩 outcome

---

## 🏗️ System Design

Adhikar is documented using a simplified **C4 model**: Context → Containers → Components, followed by data, runtime, failure, and deployment views.

### Level 1 · System Context

Who uses Adhikar and which external systems it depends on.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart TB
    CIT(["👤 Citizen<br/>(logged in or guest)"]):::person
    ADM(["🛂 Admin / Reviewer"]):::person

    subgraph ADH["🇮🇳 Adhikar Platform"]
        CORE["Scheme discovery, eligibility,<br/>applications, regulatory updates"]:::system
    end

    GEM["✨ Google Gemini<br/>embeddings + generation"]:::ext
    GOV["🏛️ Government portals,<br/>gazettes, circulars"]:::ext
    BROWSER["🔊 Browser Web Speech API<br/>(voice guide)"]:::ext

    CIT -->|"search, check eligibility,<br/>apply, track"| CORE
    ADM -->|"approve or reject<br/>rule changes"| CORE
    CORE -->|"embed, extract, explain"| GEM
    CORE -->|"crawl and diff"| GOV
    CIT -.->|"listens in Hindi / English"| BROWSER

    classDef person fill:#FF9933,stroke:#cc7a00,color:#000
    classDef system fill:#000080,stroke:#00005a,color:#fff
    classDef ext fill:#eceff1,stroke:#607d8b,color:#000
```

### Level 2 · Containers

The deployable units inside Adhikar and how they talk.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart TB
    subgraph CLIENT["🖥️ Client (Vercel)"]
        FE["React + Vite + TypeScript<br/>TanStack Router<br/>Spotlight · Voice Guide · Calculators"]
    end

    subgraph PRODUCT["🟢 Product Backend (Node.js / Express / TS)"]
        direction TB
        MW["Middleware<br/>JWT · rate limit · CORS · validation"]
        DOM["Domain modules<br/>users · families · applications<br/>tickets · notifications · saved"]
        AIC["AI client + fallback router"]
        FB["In-process fallback<br/>keyword + category search"]
        MW --> DOM
        DOM --> AIC
        AIC -.->|"on timeout / error"| FB
        MDB[("🍃 MongoDB<br/>operational data")]
        DOM --- MDB
        FB --- MDB
    end

    subgraph AISVC["🐍 AI Service (Python / FastAPI)"]
        direction TB
        ROUTES["API routes"]
        RAG["RAG assistant"]
        ENG["Deterministic<br/>rule engine"]
        OCRM["Document intelligence<br/>OCR + extraction"]
        LIFE["Life-event classifier<br/>LangGraph"]
        CHK["Form + DBT checkers<br/>fuzzy matching"]
        DBG["Rejection debugger<br/>+ counterfactuals"]
        REG["Regulatory pipeline<br/>fetch · diff · impact"]
        PGV[("🐘 PostgreSQL + pgvector<br/>schemes · rules · embeddings · versions")]
        ROUTES --> RAG & ENG & OCRM & LIFE & CHK & DBG & REG
        RAG --- PGV
        ENG --- PGV
        REG --- PGV
    end

    subgraph EXT["☁️ External"]
        GEM["Google Gemini"]
        TES["Tesseract OCR"]
        GOV["Government sources"]
    end

    FE <-->|"HTTPS / JSON"| MW
    AIC <-->|"internal HTTP"| ROUTES
    RAG --> GEM
    LIFE --> GEM
    DBG --> GEM
    OCRM --> GEM
    OCRM --> TES
    REG --> GOV

    style CLIENT fill:#e3f2fd,stroke:#1976d2
    style PRODUCT fill:#e8f5e9,stroke:#2e7d32
    style AISVC fill:#fff3e0,stroke:#ef6c00
    style EXT fill:#f3e5f5,stroke:#7b1fa2
```

### 🧩 Why Two Backends?

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
- Always-on gateway for the frontend

</td>
<td width="50%" valign="top">

### 🐍 Python / FastAPI
**AI Service**

- Reasoning, embeddings, LangGraph
- Multimodal document extraction
- Deterministic rule engine
- Owns **PostgreSQL + pgvector**
- Can cold-start or restart without breaking the product

</td>
</tr>
</table>

Each service uses the best tooling for its job and scales independently. The product backend owns **who the user is and what they did**. The AI service owns **what schemes say and what they mean**.

### 🗄️ Data Architecture

Two stores, each with a clear ownership boundary. Entities below are conceptual; see source models for exact fields.

```mermaid
erDiagram
    USER ||--o{ FAMILY_MEMBER : "has"
    USER ||--o{ APPLICATION : "submits"
    USER ||--o{ TICKET : "raises"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ SAVED_SCHEME : "bookmarks"
    APPLICATION }o--|| SCHEME : "targets"
    SCHEME ||--o{ ELIGIBILITY_RULE : "defined by"
    SCHEME ||--o{ REQUIRED_DOCUMENT : "requires"
    SCHEME ||--o{ SCHEME_CHUNK : "embedded as"
    SCHEME ||--o{ SCHEME_VERSION : "versioned as"
    SCHEME_VERSION ||--o{ CHANGE_REQUEST : "produced by"
    CHANGE_REQUEST ||--o{ NOTIFICATION : "triggers after approval"
```

| Store | Technology | Owns | Why |
|---|---|---|---|
| **Operational** | MongoDB (Mongoose) | users, families, applications, tickets, notifications, saved schemes, scheme catalog (fallback) | Flexible documents, fast CRUD, natural fit for profile data |
| **Knowledge** | PostgreSQL + pgvector | schemes, eligibility rules, embeddings (768-d), scheme versions, change queue | Relational integrity for rules and versions, vector similarity for RAG |

**Illustrative rule format** (stored as structured data, evaluated with no LLM):

```json
{
  "scheme": "example-scholarship",
  "rules": [
    { "field": "income",   "op": "<=", "value": 300000, "weight": 3 },
    { "field": "age",      "op": ">=", "value": 18,     "weight": 1 },
    { "field": "state",    "op": "in", "value": ["Rajasthan"], "weight": 2 },
    { "field": "category", "op": "in", "value": ["SC", "ST", "OBC"], "weight": 2 }
  ]
}
```

### 🔁 Request Lifecycle and Routing

How a typical authenticated request flows, including the fallback decision.

```mermaid
sequenceDiagram
    autonumber
    actor C as Citizen
    participant FE as React Frontend
    participant MW as Express Middleware
    participant DOM as Domain Module
    participant AIC as AI Client
    participant AI as FastAPI Service
    participant PG as PostgreSQL + pgvector
    participant MG as MongoDB
    participant LLM as Gemini

    C->>FE: Ask "Rajasthan B.Tech scholarship?"
    FE->>MW: POST /api/ai/ask (JWT optional)
    MW->>MW: rate limit, validate, attach profile
    MW->>DOM: handle request
    DOM->>MG: load profile + chat history
    DOM->>AIC: forward query + profile + history
    AIC->>AI: internal HTTP (1.8s budget)
    alt AI service healthy
        AI->>LLM: embed(query)
        AI->>PG: cosine similarity, top-k
        PG-->>AI: scheme chunks + sources
        AI->>LLM: generate grounded answer
        LLM-->>AI: answer
        AI-->>AIC: answer + citations
    else timeout / cold start / error
        AIC->>MG: keyword + category + demographic search
        MG-->>AIC: top schemes + rules
        AIC->>LLM: generate answer from catalog context
        LLM-->>AIC: answer
    end
    AIC-->>DOM: answer + citations
    DOM-->>FE: JSON
    FE-->>C: Answer card with source links
```

### 🧠 Dual-Engine Hybrid RAG

A zero-downtime retrieval pipeline built for high-concurrency citizen guidance.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart TD
    Q["💬 Citizen query<br/>(English / Hindi / Hinglish)"] --> R{"🔀 API router<br/>1.8s SLA"}

    subgraph E1["🐍 Primary engine · FastAPI + pgvector"]
        S1["Embed query<br/>(768-d)"] --> V1[("pgvector<br/>cosine search")]
        V1 --> C1["Top scheme chunks<br/>+ source URLs"]
    end

    subgraph E2["🟢 Fallback engine · Node + MongoDB"]
        S2["Token extraction<br/>+ keyword regex"] --> M1[("MongoDB<br/>scheme catalog")]
        M1 --> C2["Top scheme metadata<br/>+ rules"]
    end

    R -->|"healthy"| S1
    R -.->|"timeout or cold start"| S2

    C1 --> CTX
    C2 --> CTX
    PROFILE["👤 Citizen profile<br/>state · income · age · category"] --> CTX
    HISTORY["🔄 Multi-turn history"] --> CTX

    CTX["📝 Context synthesizer<br/>rules + benefits + docs + links"] --> GEM["✨ Gemini<br/>grounded generation"]
    GEM --> OUT["🎯 Answer + direct<br/>scheme citations"]

    style E1 fill:#fff3e0,stroke:#ef6c00
    style E2 fill:#e8f5e9,stroke:#2e7d32
    style GEM fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style OUT fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

**Guarantees**

- **High availability:** Render free-tier cold starts are absorbed by the in-process Node + MongoDB fallback, so requests are not dropped.
- **Strict grounding:** Factual claims (for example ₹6,000/yr for PM-KISAN, ₹5 Lakh cover for Ayushman Bharat) come from catalog entries and verified sources, never from model memory.
- **Universal access:** Authenticated citizens get automatic demographic matching; guests can still ask questions without login friction.
- **Multi-turn memory:** Follow-ups like *"What documents do I need for that?"* or *"Am I eligible in Rajasthan?"* keep context.

### 🛟 Failure Modes and Fallbacks

Every AI dependency has a non-AI degradation path.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart LR
    subgraph F1["🔎 Scheme search"]
        direction TB
        A1["Node API"] --> A2{"Python semantic<br/>search online?"}
        A2 -->|"yes"| A3["🧠 pgvector results"]
        A2 -->|"no"| A4["🍃 MongoDB dynamic filtering"]
    end

    subgraph F2["📄 Document extraction"]
        direction TB
        B1["Upload"] --> B2{"Gemini<br/>available?"}
        B2 -->|"yes"| B3["🤖 Gemini field extraction"]
        B2 -->|"no"| B4["🧩 Heuristic parsing"]
    end

    subgraph F3["🐘 AI service startup"]
        direction TB
        C1["FastAPI boots"] --> C2{"PostgreSQL +<br/>pgvector up?"}
        C2 -->|"yes"| C3["Full feature set"]
        C2 -->|"no"| C4["Core routing alive<br/>+ built-in heuristics"]
    end

    style F1 fill:#e8f5e9,stroke:#2e7d32
    style F2 fill:#e3f2fd,stroke:#1976d2
    style F3 fill:#fff3e0,stroke:#ef6c00
```

| Failure | Detected by | Degraded behavior | User impact |
|---|---|---|---|
| FastAPI cold start / down | Timeout on internal call | MongoDB catalog search + Gemini answer | Slightly less semantic, still grounded |
| pgvector or Postgres down | Startup health check | AI service boots with heuristics, non-essential features off | Core routes alive |
| Gemini unavailable (OCR) | API error | Heuristic regex / layout parsing | Upload never blocked, lower accuracy |
| Admin queue backlog | Pending count | Old rules stay live, nothing auto-publishes | Safe but not fresh |
| Source portal changes layout | Hash differs but diff is empty or cosmetic | Filtered out, no alert noise | None |

### 🚢 Deployment Topology

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart LR
    U(["👤 Browser"]) -->|"HTTPS"| V["▲ Vercel<br/>React static build + CDN"]
    V -->|"HTTPS /api"| N["🟢 Node / Express<br/>(app host)"]
    N --> M[("🍃 MongoDB")]
    N -->|"internal HTTP"| P["🐍 FastAPI<br/>(Render, free tier)"]
    P --> PG[("🐘 PostgreSQL<br/>+ pgvector")]
    P --> G["✨ Gemini API"]
    N -.->|"fallback path"| M

    style V fill:#000,color:#fff
    style N fill:#e8f5e9,stroke:#2e7d32
    style P fill:#fff3e0,stroke:#ef6c00
```

> The frontend is live on Vercel. The Python service is designed to tolerate free-tier cold starts, which is why the Node fallback path exists.

---

## 🔬 Deep Dives

<details open>
<summary><b>⚖️ Deterministic Eligibility Engine: from PDF to verdict</b></summary>

<br/>

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart LR
    P["📑 Government PDF<br/>or notification"] --> L["🧠 LLM extraction<br/>(offline, optional)"]
    L --> J["🧾 Structured rules JSON"]
    J --> H{"👩‍⚖️ Human review"}
    H --> R[("Rule store<br/>eligibility_rules")]
    U["👤 User / family profile"] --> E
    R --> E{"⚙️ Rule engine<br/>no LLM involved"}
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

**How per-rule results combine into a scheme verdict**

```mermaid
flowchart TD
    S["Evaluate every rule<br/>against profile"] --> A{"Any rule FAIL?"}
    A -->|"yes"| NE["❌ NOT ELIGIBLE<br/>list failing rules"]
    A -->|"no"| B{"Any rule UNKNOWN?"}
    B -->|"yes"| PE["❓ POSSIBLY ELIGIBLE<br/>ask for missing fields"]
    B -->|"no"| EL["✅ ELIGIBLE"]
    EL --> SC["Weighted score<br/>sum(weight of PASS) / sum(all weights)"]
    PE --> SC
    SC --> RK["Ranked match %<br/>on dashboard"]

    style NE fill:#ffcdd2,stroke:#c62828
    style PE fill:#fff9c4,stroke:#f9a825
    style EL fill:#c8e6c9,stroke:#2e7d32
```

</details>

<details>
<summary><b>👨‍👩‍👧 Family Benefit Optimizer</b></summary>

<br/>

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
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
<summary><b>📄 Document Intelligence pipeline</b></summary>

<br/>

```mermaid
sequenceDiagram
    autonumber
    actor C as Citizen
    participant FE as Frontend
    participant API as Node API
    participant AI as FastAPI
    participant T as Tesseract
    participant G as Gemini

    C->>FE: Upload Aadhaar / income cert / passbook
    FE->>API: multipart upload
    API->>AI: forward file
    AI->>T: OCR raw text
    T-->>AI: text
    alt Gemini available
        AI->>G: extract structured fields
        G-->>AI: JSON fields
    else fallback
        AI->>AI: heuristic parsing
    end
    AI->>AI: expiry detection + validation
    AI-->>API: fields + warnings
    API-->>FE: structured preview
    FE-->>C: Review and confirm fields
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

## 📡 Regulatory Monitoring Pipeline

Government rules change often. Adhikar keeps up **automatically**, with a human in the loop.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart LR
    A["🌐 <b>S13</b><br/>Fetch portals<br/>and PDFs"] --> B["🔎 <b>S14</b><br/>Hash + text diff<br/>drop cosmetic changes"]
    B --> C["🧾 <b>S14</b><br/>Rule diff +<br/>SchemeVersion"]
    C --> D["⚖️ <b>S16</b><br/>Source conflict<br/>resolution"]
    D --> E{"🛂 <b>S19</b><br/>Admin approval<br/>queue"}
    E -->|"Rejected"| Z(["🗑️ Discarded"])
    E -->|"Approved"| F["📝 Live rules<br/>updated"]
    F --> G["📊 <b>S15</b><br/>Impact analysis<br/>lost / gained / same"]
    G --> H["🔁 <b>S17</b><br/>Auto eligibility<br/>re-check"]
    H --> I["🔔 <b>S18</b><br/>Notify affected<br/>citizens"]

    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:3px
    style I fill:#138808,color:#fff,stroke:#0b5a05
    style Z fill:#ffcdd2,stroke:#c62828
```

*S = roadmap stage number.*

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
    Detected --> Filtered: cosmetic change
    Filtered --> [*]: ignored
    Detected --> PendingReview: material change
    PendingReview --> Approved: admin approves
    PendingReview --> Rejected: admin rejects
    Approved --> Live: rules updated and versioned
    Live --> Analyzed: impact analysis
    Analyzed --> Rechecked: eligibility re-run
    Rechecked --> UsersNotified: alerts sent
    UsersNotified --> [*]
    Rejected --> [*]
```

**Impact analysis outcome per citizen**

| Before | After | Result | Notification |
|---|---|---|---|
| Eligible | Eligible | Unchanged | none |
| Eligible | Not eligible | **Lost** | "You may no longer qualify, here is why" |
| Not eligible | Eligible | **Gained** | "You may now qualify, here is the source" |

## 🔐 Security Model

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, Arial'}}}%%
flowchart LR
    R(["Request"]) --> RL["⏱️ Rate limiter"]
    RL --> CORS["🌍 CORS allow-list"]
    CORS --> VAL["🧪 Schema validation<br/>+ strict type checks"]
    VAL --> AUTH{"🔑 JWT valid?"}
    AUTH -->|"yes"| RBAC{"🛂 Role allowed?<br/>citizen / admin"}
    AUTH -->|"public route"| PUB["Guest-safe handler"]
    AUTH -->|"no"| X(["401"])
    RBAC -->|"yes"| H["Handler"]
    RBAC -->|"no"| Y(["403"])

    style X fill:#ffcdd2,stroke:#c62828
    style Y fill:#ffcdd2,stroke:#c62828
    style H fill:#c8e6c9,stroke:#2e7d32
```

| Layer | Control |
|---|---|
| **Passwords** | bcrypt hashing, secure password recovery |
| **Sessions** | API-layer JWT validation |
| **Abuse protection** | Rate limiting on critical endpoints |
| **Input** | Explicit type checking and validation |
| **Admin actions** | Only approved changes can modify live rules and trigger notifications |
| **AI safety** | LLM output never decides eligibility; answers are grounded with citations |
| **Secrets** | `.env` files stay out of git; keys are server-side only |

## 🧠 Key Design Decisions

| # | Decision | Why | Trade-off |
|---|---|---|---|
| 1 | **LLM never decides eligibility** | Legal and financial consequences need auditability | Rules must be extracted and reviewed up front |
| 2 | **Two backends (Node + FastAPI)** | Best ecosystem for each job; independent scaling and failure | More moving parts, internal HTTP hop |
| 3 | **Two databases (Mongo + Postgres)** | Documents for product data, relational + vectors for knowledge | Two stores to operate |
| 4 | **Node-side fallback search** | Free-tier cold starts must not drop citizens | Fallback is keyword-based, less semantic |
| 5 | **Tri-state rule results** | "Unknown" is honest when data is missing | Needs follow-up prompts for profile completion |
| 6 | **Human approval for rule changes** | Wrong rule = wrong advice to real people | Freshness depends on admin response time |
| 7 | **Immutable `SchemeVersion` history** | Enables diffs, audits, and impact analysis | Extra storage |
| 8 | **Heuristic OCR fallback** | Uploads must never be blocked | Lower accuracy than Gemini extraction |

## 🗺️ Roadmap

<div align="center">

![Progress](https://img.shields.io/badge/Progress-19%20of%2019%20stages-138808?style=for-the-badge)

`██████████████████████████████ 100%`

</div>

```mermaid
gantt
    title Delivery phases
    dateFormat  X
    axisFormat  %s
    section Phase 1 · Core Platform
    Foundation, Profile, RAG            :done, a1, 0, 3
    Eligibility + Recommendations       :done, a2, 3, 5
    Family, Docs, DBT, Risk, Simulator  :done, a3, 5, 12
    section Phase 2 · Regulatory Pipeline
    Collect, Diff, Impact               :done, b1, 12, 15
    Conflict, Re-check, Notify          :done, b2, 15, 18
    Admin Approval Queue                :done, b3, 18, 19
```

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

## 🧰 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,ts,nodejs,express,mongodb,python,fastapi,postgres,git,github,vercel&perline=12" alt="Tech stack icons" />

</div>

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, TypeScript, TanStack Router, Web Speech API |
| **Product Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt |
| **AI Service** | Python, FastAPI, LangGraph, SQLAlchemy |
| **Databases** | MongoDB, PostgreSQL with `pgvector` |
| **AI / ML** | Google Gemini (NLP, OCR assist, embeddings), Tesseract OCR |
| **Deployment** | Vercel (frontend), Render (AI service) |

## 📸 Screenshots

> Replace the placeholders below with real screenshots or GIFs from `docs/assets/screenshots/`.

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
- Tesseract OCR installed and on your `PATH`

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

**Recommended start order:** MongoDB → PostgreSQL → AI Service → Backend → Frontend. The backend will still work if the AI service is late, thanks to the fallback path.

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
│   └── assets/      # logo.svg, banner.svg, screenshots/
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

<img src="docs/assets/logo.png" alt="Adhikar" width="64" />

**Akshat Srivastava**

<a href="https://github.com/Akshatsrii"><img src="https://img.shields.io/badge/GitHub-Akshatsrii-181717?style=for-the-badge&logo=github" alt="GitHub"/></a>
<a href="https://leetcode.com/Akshatsrivastava007"><img src="https://img.shields.io/badge/LeetCode-Akshatsrivastava007-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode"/></a>

<br/><br/>

⭐ **If Adhikar helped you or inspired you, please star the repo!** ⭐

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF9933,50:FFFFFF,100:138808&height=120&section=footer&text=Adhikar%20%E2%80%94%20Your%20Right%2C%20Delivered.&fontSize=22&fontColor=000080&animation=fadeIn&fontAlignY=70" width="100%" alt="footer"/>
