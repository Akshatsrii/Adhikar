import json
from unittest.mock import MagicMock, patch
import pytest

from app.document_extraction import extract_fields
from app.life_events import classify_life_event


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
        "event_type": "FARMING",
        "confidence": 0.95,
        "suggested_categories": ["Agriculture"]
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_payload)

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    with patch("app.life_events._get_client", return_value=mock_client):
        classification = classify_life_event("I am a small farmer facing crop damages from hailstorm")
        assert classification.event_type == "FARMING"
        assert classification.confidence == 0.95
        assert "Agriculture" in classification.suggested_categories
