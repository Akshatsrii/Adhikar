from fastapi import APIRouter, Depends
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.gemini import embed_text, generate_answer
from app.models import Scheme, SchemeChunk
from app.schemas import AskRequest, AskResponse, AskSource

logger = logging.getLogger(__name__)

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
    results = []
    context_chunks = []
    sources: list[AskSource] = []

    # 1. Vector similarity search via pgvector
    try:
        query_vector = embed_text(query_text, task_type="RETRIEVAL_QUERY")
        if any(v != 0.0 for v in query_vector):
            stmt = (
                select(SchemeChunk, Scheme)
                .join(Scheme, SchemeChunk.scheme_id == Scheme.id)
                .order_by(SchemeChunk.embedding.cosine_distance(query_vector))
                .limit(payload.top_k)
            )

            if payload.profile and payload.profile.state:
                stmt = stmt.where((Scheme.state == payload.profile.state) | (Scheme.level == "central"))

            results = db.execute(stmt).all()
            for chunk, scheme in results:
                context_chunks.append(f"[{scheme.name} - {scheme.category}]\n{chunk.content}")
                sources.append(
                    AskSource(
                        scheme_slug=scheme.slug,
                        scheme_name=scheme.name,
                        source_url=scheme.source_url,
                        chunk_type=chunk.chunk_type,
                    )
                )
    except Exception as exc:
        logger.warning(f"Vector search failed, falling back to relational keyword search: {exc}")

    # 2. Relational keyword search fallback if vector results are empty
    if len(context_chunks) == 0:
        try:
            tokens = [t.strip().lower() for t in payload.query.split() if len(t.strip()) > 3]
            kw_conditions = []
            for t in tokens:
                kw_conditions.append(Scheme.name.ilike(f"%{t}%"))
                kw_conditions.append(Scheme.category.ilike(f"%{t}%"))
                kw_conditions.append(Scheme.description.ilike(f"%{t}%"))

            kw_stmt = select(Scheme)
            if kw_conditions:
                kw_stmt = kw_stmt.where(or_(*kw_conditions))
            if payload.profile and payload.profile.state:
                kw_stmt = kw_stmt.where((Scheme.state == payload.profile.state) | (Scheme.level == "central"))
            kw_stmt = kw_stmt.limit(payload.top_k)

            kw_schemes = db.execute(kw_stmt).scalars().all()
            for scheme in kw_schemes:
                context_chunks.append(
                    f"[{scheme.name} - {scheme.category}]\n"
                    f"Benefit: {scheme.benefit}\n"
                    f"Description: {scheme.description}\n"
                    f"Level: {scheme.level} | State: {scheme.state or 'Central'}\n"
                    f"Portal: {scheme.source_url or 'https://myscheme.gov.in'}"
                )
                sources.append(
                    AskSource(
                        scheme_slug=scheme.slug,
                        scheme_name=scheme.name,
                        source_url=scheme.source_url,
                        chunk_type="keyword_fallback",
                    )
                )
        except Exception as kw_exc:
            logger.warning(f"Keyword search also encountered error: {kw_exc}")

    # 3. Generate grounded answer via Gemini 3.8 Flash
    answer = generate_answer(payload.query, context_chunks)

    # De-duplicate sources by scheme slug
    seen: set[str] = set()
    unique_sources = []
    for s in sources:
        if s.scheme_slug not in seen:
            seen.add(s.scheme_slug)
            unique_sources.append(s)

    return AskResponse(answer=answer, sources=unique_sources)
