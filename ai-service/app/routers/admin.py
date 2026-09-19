from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models import Scheme
from app.schemas import SchemeCreate, SchemeUpdate, SchemeDetail

router = APIRouter(prefix="/admin", tags=["admin"])


from app.schemas import SchemeCreate, SchemeUpdate, SchemeDetail

@router.post("/schemes", response_model=SchemeDetail)
def create_scheme(req: SchemeCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(Scheme).where(Scheme.slug == req.slug))
    if existing:
        raise HTTPException(400, "Scheme with this slug already exists")
    
    new_scheme = Scheme(**req.model_dump())
    db.add(new_scheme)
    db.commit()
    db.refresh(new_scheme)
    return new_scheme

@router.put("/schemes/{slug}", response_model=SchemeDetail)
def update_scheme(slug: str, req: SchemeUpdate, db: Session = Depends(get_db)):
    scheme = db.scalar(select(Scheme).where(Scheme.slug == slug))
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    
    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(scheme, key, value)
        
    db.commit()
    db.refresh(scheme)
    return scheme

@router.delete("/schemes/{slug}")
def delete_scheme(slug: str, db: Session = Depends(get_db)):
    scheme = db.scalar(select(Scheme).where(Scheme.slug == slug))
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    db.delete(scheme)
    db.commit()
    return {"message": "Scheme deleted successfully"}

@router.post("/schemes/bulk")
def bulk_create_schemes(req_list: list[SchemeCreate], db: Session = Depends(get_db)):
    created = []
    for req in req_list:
        existing = db.scalar(select(Scheme).where(Scheme.slug == req.slug))
        if existing:
            continue
        new_scheme = Scheme(**req.model_dump())
        db.add(new_scheme)
        created.append(new_scheme)
    db.commit()
    return {"message": f"Bulk inserted {len(created)} schemes."}
