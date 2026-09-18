"""Thin wrapper around the Gemini API — embeddings + grounded generation.

No custom model training happens anywhere in this file. Both calls hit
Google's hosted models; the "AI" here is prompting + retrieval, not a
model we own or fine-tune.
"""

from google import genai
from google.genai import types

from app.config import settings

_client: genai.Client | None = None

EMBEDDING_MODEL = "gemini-embedding-2"
GENERATION_MODEL = "gemini-2.0-flash"


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
    """Embed a single piece of text. Use task_type='RETRIEVAL_QUERY' for the
    user's question and 'RETRIEVAL_DOCUMENT' for scheme chunks being indexed —
    Gemini's embedding model is tuned differently for each side of retrieval."""
    client = _get_client()

    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    return result.embeddings[0].values


def embed_texts(texts: list[str], task_type: str = "RETRIEVAL_DOCUMENT") -> list[list[float]]:
    """Batch embed — used by the ingestion script so we don't make one
    network round-trip per chunk."""
    client = _get_client()

    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    return [e.values for e in result.embeddings]


SYSTEM_INSTRUCTION = """You are Adhikar's benefits assistant. You answer citizens' \
questions about Indian government welfare schemes using ONLY the scheme context \
provided below — never from general knowledge, and never guess at eligibility \
numbers that aren't in the context.

Rules:
- If the context doesn't contain the answer, say so plainly and suggest what \
  information would help (e.g. "which state are you in?").
- Never state that someone IS or ISN'T eligible — that determination belongs to \
  the deterministic eligibility engine, not you. You may describe what a scheme's \
  stated eligibility criteria are.
- Keep answers concise and cite which scheme each fact comes from.
"""


def generate_answer(query: str, context_chunks: list[str]) -> str:
    client = _get_client()

    context_block = "\n\n---\n\n".join(context_chunks) if context_chunks else "No matching schemes found."

    prompt = (
        f"Context (retrieved scheme information):\n\n{context_block}\n\n"
        f"Citizen's question: {query}"
    )

    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION),
    )
    return response.text or "I couldn't generate an answer — please try rephrasing your question."
