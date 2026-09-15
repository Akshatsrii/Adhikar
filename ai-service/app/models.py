from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

EMBEDDING_DIM = 768  # Gemini text-embedding-004 output size


class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(100))
    level: Mapped[str] = mapped_column(String(20))  # "central" | "state"
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    benefit: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(String(500))
    application_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    deadline: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Family Optimizer flags (Stage 6)
    mutually_exclusive_group: Mapped[str | None] = mapped_column(String(100), nullable=True)
    one_per_family: Mapped[bool] = mapped_column(default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    eligibility_rules: Mapped[list["EligibilityRule"]] = relationship(
        back_populates="scheme", cascade="all, delete-orphan"
    )
    documents_required: Mapped[list["DocumentRequirement"]] = relationship(
        back_populates="scheme", cascade="all, delete-orphan"
    )


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))

    field: Mapped[str] = mapped_column(String(100))  # e.g. "income", "age", "state"
    operator: Mapped[str] = mapped_column(String(20))  # "<=", ">=", "==", "in"
    value: Mapped[str] = mapped_column(String(255))  # stored as string, cast at eval time

    scheme: Mapped["Scheme"] = relationship(back_populates="eligibility_rules")


class DocumentRequirement(Base):
    __tablename__ = "documents_required"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))

    name: Mapped[str] = mapped_column(String(255))
    is_mandatory: Mapped[bool] = mapped_column(default=True)

    scheme: Mapped["Scheme"] = relationship(back_populates="documents_required")


class Source(Base):
    """Raw source record a scheme was extracted from — kept for auditability
    and for the Regulatory Monitoring Pipeline's change-detection diffing."""

    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))

    url: Mapped[str] = mapped_column(String(500))
    fetched_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    content_hash: Mapped[str] = mapped_column(String(64))
    raw_text: Mapped[str] = mapped_column(Text)


class SchemeChunk(Base):
    """A retrievable, embedded text chunk derived from a scheme record.
    This is what the RAG pipeline actually searches over — one scheme can
    produce multiple chunks (overview, eligibility, documents) so retrieval
    stays precise instead of matching on one giant blob per scheme."""

    __tablename__ = "scheme_chunks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))

    chunk_type: Mapped[str] = mapped_column(String(30))  # "overview" | "eligibility" | "documents"
    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float]] = mapped_column(Vector(EMBEDDING_DIM))

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["Scheme"] = relationship()


class AdminUpdateQueue(Base):
    """Stage 19: Verification & Approval queue for detected scheme changes."""
    __tablename__ = "admin_update_queue"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_slug: Mapped[str] = mapped_column(String(160), index=True)
    change_type: Mapped[str] = mapped_column(String(50)) # "NEW_SCHEME", "RULE_CHANGE", "DEADLINE_EXTENSION"
    diff_summary: Mapped[str] = mapped_column(Text) # AI generated semantic diff
    affected_users_count: Mapped[int] = mapped_column(Integer, default=0)
    ai_confidence_score: Mapped[float] = mapped_column(default=0.0)
    source_url: Mapped[str] = mapped_column(String(500))
    raw_extracted_rules: Mapped[str] = mapped_column(Text) # JSON string of new rules
    status: Mapped[str] = mapped_column(String(20), default="PENDING") # "PENDING", "APPROVED", "REJECTED"
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
