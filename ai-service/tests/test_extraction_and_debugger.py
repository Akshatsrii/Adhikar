import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch
import pytest

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.document_extraction import extract_fields
from app.life_events import classify_life_event, categories_for_event, LifeEventType


def test_document_extraction_with_mocked_gemini():
    mock_payload = {
        "document_type": "Income Certificate",
        "full_name": "Ramesh Kumar",
        "issue_date": "2025-04-12",
        "income_amount": 150000,
        "id_number": "INC/RJ/2025/8891",
        "issuing_authority": "Tehsildar, Jaipur"
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_payload)

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    with patch("app.document_extraction._get_client", return_value=mock_client):
        result = extract_fields("Government of Rajasthan Income Certificate issued to Ramesh Kumar")
        assert result["document_type"] == "Income Certificate"
        assert result["full_name"] == "Ramesh Kumar"
        assert result["income_amount"] == 150000


def test_life_events_classification_with_mocked_gemini():
    mock_payload = {
        "event_type": "MARRIAGE",
        "confidence": 0.95
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_payload)

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    with patch("app.life_events._get_client", return_value=mock_client):
        event_type, confidence = classify_life_event("I recently got married")
        assert event_type == LifeEventType.MARRIAGE
        assert event_type.value == "MARRIAGE"
        assert confidence == 0.95
        assert "Social Welfare" in categories_for_event(event_type)
