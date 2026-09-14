from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.gemini import embed_text, generate_answer
from app.models import Scheme, SchemeChunk
from app.schemas import AskRequest, AskResponse, AskSource

router = APIRouter(prefix="/ai", tags=["ai"])


def _build_query_text(payload: AskRequest) -> str:
    """Fold profile context into the embedded query so retrieval is aware of
    the citizen's state/income even if they didn't mention it in the question —
    e.g. "scholarships for me" + profile.state="Rajasthan" retrieves better
    than the bare question would."""
    if not payload.profile:
        return payload.query

    hints = []
    if payload.profile.state:
        hints.append(f"state: {payload.profile.state}")
    if payload.profile.occupation:
        hints.append(f"occupation: {payload.profile.occupation}")
    if payload.profile.education:
        hints.append(f"education: {payload.profile.education}")

    return f"{payload.query} ({', '.join(hints)})" if hints else payload.query


@router.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest, db: Session = Depends(get_db)) -> AskResponse:
    query_text = _build_query_text(payload)
    query_vector = embed_text(query_text, task_type="RETRIEVAL_QUERY")

    # pgvector cosine distance operator: `<=>`. Lower = more similar.
    stmt = (
        select(SchemeChunk, Scheme)
        .join(Scheme, SchemeChunk.scheme_id == Scheme.id)
        .order_by(SchemeChunk.embedding.cosine_distance(query_vector))
        .limit(payload.top_k)
    )

    if payload.profile and payload.profile.state:
        stmt = stmt.where((Scheme.state == payload.profile.state) | (Scheme.level == "central"))

    results = db.execute(stmt).all()

    context_chunks = [f"[{scheme.name}]\n{chunk.content}" for chunk, scheme in results]
    answer = generate_answer(payload.query, context_chunks)

    sources = [
        AskSource(
            scheme_slug=scheme.slug,
            scheme_name=scheme.name,
            source_url=scheme.source_url,
            chunk_type=chunk.chunk_type,
        )
        for chunk, scheme in results
    ]

    # de-duplicate sources by scheme, keep first occurrence
    seen: set[str] = set()
    unique_sources = []
    for s in sources:
        if s.scheme_slug not in seen:
            seen.add(s.scheme_slug)
            unique_sources.append(s)

    return AskResponse(answer=answer, sources=unique_sources)
