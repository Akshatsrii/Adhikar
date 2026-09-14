"""Life-event -> benefit-category mapping (plain rule table) and free-text
event classification (Gemini prompt, not a trained classifier).

The category map is the source of truth for "what kind of schemes does this
life event unlock" — it's a dict, not a model, so it's auditable and editable
without retraining anything. The LLM's only job is figuring out which
LIFE_EVENT label a citizen's free-text sentence maps to.
"""

import json
from enum import Enum

from app.gemini import _get_client, GENERATION_MODEL


class LifeEventType(str, Enum):
    MARRIAGE = "MARRIAGE"
    CHILDBIRTH = "CHILDBIRTH"
    GRADUATION = "GRADUATION"
    JOB_LOSS = "JOB_LOSS"
    NEW_JOB = "NEW_JOB"
    RETIREMENT = "RETIREMENT"
    RELOCATION = "RELOCATION"
    UNKNOWN = "UNKNOWN"


# Rule table: which scheme categories become relevant after each life event.
# Plain dict lookup at request time — nothing here is learned or inferred.
LIFE_EVENT_CATEGORY_MAP: dict[LifeEventType, list[str]] = {
    LifeEventType.MARRIAGE: ["Social Welfare"],
    LifeEventType.CHILDBIRTH: ["Education", "Social Welfare"],
    LifeEventType.GRADUATION: ["Education"],
    LifeEventType.JOB_LOSS: ["Social Welfare", "Agriculture"],
    LifeEventType.NEW_JOB: [],
    LifeEventType.RETIREMENT: ["Social Welfare"],
    LifeEventType.RELOCATION: [],
    LifeEventType.UNKNOWN: [],
}


_CLASSIFY_PROMPT = """Classify the citizen's message into exactly one of these \
life event labels: MARRIAGE, CHILDBIRTH, GRADUATION, JOB_LOSS, NEW_JOB, \
RETIREMENT, RELOCATION, UNKNOWN.

Respond with ONLY a JSON object, no markdown, no explanation:
{{"event_type": "<LABEL>", "confidence": <0.0-1.0>}}

Message (may be in Hindi, English, or Hinglish): "{text}"
"""


def classify_life_event(text: str) -> tuple[LifeEventType, float]:
    """Calls Gemini to classify free text into a LifeEventType. This is
    prompting, not training — swap the prompt, not a model, if the label
    set changes."""
    client = _get_client()

    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=_CLASSIFY_PROMPT.format(text=text),
    )

    raw = (response.text or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`").removeprefix("json").strip()

    try:
        parsed = json.loads(raw)
        event_type = LifeEventType(parsed.get("event_type", "UNKNOWN"))
        confidence = float(parsed.get("confidence", 0.0))
    except (json.JSONDecodeError, ValueError):
        event_type, confidence = LifeEventType.UNKNOWN, 0.0

    return event_type, confidence


def categories_for_event(event_type: LifeEventType) -> list[str]:
    return LIFE_EVENT_CATEGORY_MAP.get(event_type, [])
