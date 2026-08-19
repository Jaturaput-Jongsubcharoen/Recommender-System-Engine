from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_music_recommendations_are_served_from_precomputed_data():
    response = client.get("/api/recommendations/music", params={"title": "Early Works - Dallas Holm"})
    assert response.status_code == 200
    assert len(response.json()["recommendations"]) == 10


def test_existing_cuisine_recommendations_remain_available():
    response = client.get("/api/recommendations/cuisine/french")
    assert response.status_code == 200
    rule = response.json()["rules"][0]
    assert {"support", "confidence", "lift"}.issubset(rule)
