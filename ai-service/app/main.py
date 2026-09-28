from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import ai, schemes, eligibility, recommendations, life_events, family, documents, debugger, simulator, copilot, admin, regulatory

async def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_ai_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal key")

app = FastAPI(
    title="Adhikar AI Service", 
    version="0.1.0"
)

global_dependencies = [Depends(verify_internal_key)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

        # Stage 2: plain table creation is enough. Swap for Alembic migrations
        # once the schema needs versioned, production-safe changes.
        Base.metadata.create_all(bind=engine)
        print("Successfully connected to Postgres and initialized pgvector.")
    except Exception as e:
        print(f"WARNING: Could not connect to Postgres DB on startup. Some AI features will be degraded. Error: {e}")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(schemes.router, dependencies=global_dependencies)
app.include_router(ai.router, dependencies=global_dependencies)
app.include_router(eligibility.router, dependencies=global_dependencies)
app.include_router(recommendations.router, dependencies=global_dependencies)
app.include_router(life_events.router, dependencies=global_dependencies)
app.include_router(family.router, dependencies=global_dependencies)
app.include_router(documents.router, dependencies=global_dependencies)
app.include_router(debugger.router, dependencies=global_dependencies)
app.include_router(simulator.router, dependencies=global_dependencies)
app.include_router(copilot.router, dependencies=global_dependencies)
app.include_router(admin.router, dependencies=global_dependencies)
app.include_router(regulatory.router, dependencies=global_dependencies)
