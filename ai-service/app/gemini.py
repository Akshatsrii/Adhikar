"""Thin wrapper around the Gemini API — embeddings + grounded generation.

Uses Google's Gemini models for embedding and response generation.
Supports multi-language queries (Hindi, Hinglish, English) with grounded citations.
"""

import logging
from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger(__name__)

_client: genai.Client | None = None

EMBEDDING_MODEL = "gemini-embedding-001"
GENERATION_MODEL = "gemini-3.8-flash"


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set — add it to ai-service/.env before calling "
                "the AI assistant endpoints."
            )
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def embed_text(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
    """Embed a single piece of text with dimensionality 768 for pgvector."""
    client = _get_client()
    try:
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(task_type=task_type, output_dimensionality=768),
        )
        return result.embeddings[0].values
    except Exception as exc:
        logger.warning(f"Gemini embedding error: {exc}. Using zero-vector fallback.")
        return [0.0] * 768


def embed_texts(texts: list[str], task_type: str = "RETRIEVAL_DOCUMENT") -> list[list[float]]:
    """Batch embed multiple chunks."""
    client = _get_client()
    try:
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=texts,
            config=types.EmbedContentConfig(task_type=task_type, output_dimensionality=768),
        )
        return [e.values for e in result.embeddings]
    except Exception as exc:
        logger.warning(f"Gemini batch embedding error: {exc}.")
        return [[0.0] * 768 for _ in texts]


SYSTEM_INSTRUCTION = """You are Adhikar Copilot, an official, empathetic, and highly accurate welfare intelligence assistant for Indian citizens.

Core Operating Guidelines:
1. Answer questions about Indian central and state welfare schemes using the verified scheme context provided below.
2. When referencing financial benefits, quote exact amounts (e.g., ₹6,000/year for PM-KISAN, ₹5 Lakh cover for Ayushman Bharat).
3. Support multilingual dialogue: If the citizen asks in Hindi or Hinglish, answer warmly and clearly in Hindi/Hinglish. If English, answer in English.
4. Structure responses cleanly using markdown:
   - Bold key terms and scheme titles.
   - Use bullet points for eligibility criteria and required documents.
   - Mention official application portals or websites when available.
5. Emphasize that final deterministic verification and fund disbursement are administered through official government departments and portals.
6. If the context does not contain the answer, guide the citizen constructively on where to apply or verify (e.g. nearest Common Service Centre (CSC) or myscheme.gov.in).
"""


def generate_answer(query: str, context_chunks: list[str]) -> str:
    client = _get_client()

    context_block = "\n\n---\n\n".join(context_chunks) if context_chunks else "No matching scheme context found in local database."

    prompt = (
        f"Verified Government Scheme Knowledge Base:\n\n{context_block}\n\n"
        f"Citizen's Question: {query}\n\n"
        "Please provide a structured, helpful, and empathetic answer citing the relevant schemes:"
    )

    try:
        response = client.models.generate_content(
            model=GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION),
        )
        return response.text or "I could not generate a response — please rephrase your query."
    except Exception as exc:
        logger.error(f"Error in Gemini generate_answer: {exc}")
        return "I am currently unable to retrieve a response from the AI model. Please try again or visit your nearest Common Service Centre (CSC)."
