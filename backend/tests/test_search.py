import math

import pytest
from fastapi.testclient import TestClient

from app.main import app, search_service
from app.schemas import SearchRequest, UserPreferences
from app.services.evaluation import ndcg_at_k, precision_at_k, recall_at_k, reciprocal_rank


client = TestClient(app)


@pytest.mark.parametrize("mode", ["lexical", "semantic", "hybrid"])
def test_each_retrieval_mode_returns_real_ranked_results(mode):
    result = search_service().search(SearchRequest(query="uplifting worship guitar", mode=mode, top_k=4))
    assert result["mode"] == mode
    assert len(result["results"]) == 4
    assert all(item["title"] and item["scores"]["ranking_score"] >= 0 for item in result["results"])


def test_top_k_and_reranking_suppress_duplicate_titles():
    result = search_service().search(SearchRequest(query="classical piano music", top_k=7))
    titles = [item["title"].casefold() for item in result["results"]]
    assert len(titles) == 7
    assert len(titles) == len(set(titles))
    assert all("reranking_score" in item["scores"] for item in result["results"])


def test_personalization_uses_preferences_and_supports_comparison():
    request = SearchRequest(
        query="uplifting music",
        top_k=5,
        personalize=True,
        compare=True,
        preferences=UserPreferences(
            favorite_terms=["gospel worship"], liked_titles=["Early Works - Dallas Holm"]
        ),
    )
    result = search_service().search(request)
    assert result["generic_results"] is not None
    assert result["personalized_results"] is not None
    assert any(item["scores"]["personalization_score"] > 0 for item in result["personalized_results"])


def test_evaluation_metrics_are_calculated():
    ranked = ["a", "b", "c", "d"]
    relevant = {"b", "d"}
    assert precision_at_k(ranked, relevant, 2) == 0.5
    assert recall_at_k(ranked, relevant, 2) == 0.5
    assert reciprocal_rank(ranked, relevant) == 0.5
    assert math.isclose(ndcg_at_k(ranked, {"b": 2, "d": 1}, 4), 0.6399093280)


def test_evaluation_handles_missing_relevance_information():
    assert recall_at_k(["a"], set(), 1) is None
    assert ndcg_at_k(["a"], {}, 1) is None
    response = client.get("/api/search/evaluation")
    assert response.status_code == 200
    assert response.json()["available"] is False
    assert all(value is None for value in response.json()["metrics"].values())


@pytest.mark.parametrize(
    "payload",
    [
        {"query": " ", "mode": "hybrid", "top_k": 5},
        {"query": "music", "mode": "unknown", "top_k": 5},
        {"query": "music", "mode": "hybrid", "top_k": 0},
        {"query": "music", "mode": "hybrid", "top_k": 21},
        {"query": "music", "preferences": {"favorite_terms": ["x" * 201]}},
    ],
)
def test_search_endpoint_rejects_invalid_input(payload):
    assert client.post("/api/search", json=payload).status_code == 422


def test_search_api_and_optional_capabilities():
    response = client.post("/api/search", json={"query": "acoustic guitar", "mode": "hybrid", "top_k": 3})
    assert response.status_code == 200
    assert len(response.json()["results"]) == 3
    capabilities = client.get("/api/search/capabilities").json()
    assert capabilities["learning_to_rank"]["available"] is False
    assert capabilities["multimodal"]["available"] is False


def test_missing_search_index_returns_service_unavailable(monkeypatch, tmp_path):
    import app.main as main

    main.search_service.cache_clear()
    monkeypatch.setattr(main, "MUSIC_SEARCH_CORPUS_PATH", tmp_path / "missing.json.gz")
    response = client.post("/api/search", json={"query": "music", "mode": "hybrid", "top_k": 3})
    assert response.status_code == 503
    assert response.json()["detail"] == "The search index is currently unavailable."
    main.search_service.cache_clear()


def test_cors_preflight_allows_search_post():
    response = client.options(
        "/api/search",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
