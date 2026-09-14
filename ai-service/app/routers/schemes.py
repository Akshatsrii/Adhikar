from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Scheme
from app.schemas import SchemeDetail, SchemeListResponse

router = APIRouter(prefix="/schemes", tags=["schemes"])


@router.get("", response_model=SchemeListResponse)
def list_schemes(
    state: str | None = Query(default=None, description="Filter by state, e.g. 'Rajasthan'"),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None, description="Search in scheme name"),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(Scheme)

    if state:
        stmt = stmt.where((Scheme.state == state) | (Scheme.level == "central"))
    if category:
        stmt = stmt.where(Scheme.category == category)
    if search:
        stmt = stmt.where(Scheme.name.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(stmt.limit(limit).offset(offset)).all()

    return SchemeListResponse(total=total, items=list(items))


@router.get("/{slug}", response_model=SchemeDetail)
def get_scheme(slug: str, db: Session = Depends(get_db)):
    scheme = db.scalar(select(Scheme).where(Scheme.slug == slug))
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{slug}' not found")

    return scheme
