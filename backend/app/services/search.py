from __future__ import annotations

import html
import os
import re
from pathlib import Path

import numpy as np

from ..schemas import SearchRequest
from .personalization import PersonalizationService
from .ranking import RankingService, RankingWeights
from .reranking import RerankingService
from .retrieval import RetrievalService


def _weight(name: str, default: float) -> float:
    return float(os.getenv(name, str(default)))


def capability_status(index_loaded: bool = False) -> dict:
    return {
        "retrieval_modes": ["lexical", "semantic", "hybrid"],
        "semantic_model": "TF-IDF + truncated SVD latent-semantic embeddings",
        "vector_index": "scikit-learn cosine nearest-neighbor index",
        "index_loaded": index_loaded,
        "learning_to_rank": {"available": False, "reason": "No independent relevance labels are present."},
        "multimodal": {"available": False, "reason": "No local image assets are associated with the deployable corpus."},
    }


class SearchService:
    def __init__(self, corpus_path: Path, recommendations_path: Path):
        import json

        with recommendations_path.open(encoding="utf-8") as source:
            graph = json.load(source)
        self.retrieval = RetrievalService(
            corpus_path, semantic_dimensions=int(os.getenv("SEARCH_SEMANTIC_DIMENSIONS", "64"))
        )
        weights = RankingWeights(
            lexical=_weight("SEARCH_LEXICAL_WEIGHT", 0.45),
            semantic=_weight("SEARCH_SEMANTIC_WEIGHT", 0.45),
            metadata=_weight("SEARCH_METADATA_WEIGHT", 0.10),
            personalization=_weight("SEARCH_PERSONALIZATION_WEIGHT", 0.25),
        )
        self.ranking = RankingService(self.retrieval.documents, weights)
        self.personalization = PersonalizationService(self.retrieval.titles, graph)
        self.reranking = RerankingService(self.retrieval, _weight("SEARCH_DIVERSITY_WEIGHT", 0.12))

    def search(self, request: SearchRequest) -> dict:
        lexical, semantic, semantic_query = self.retrieval.score_query(request.query)
        candidate_count = min(len(self.retrieval.documents), max(50, request.top_k * 8))
        active_scores = lexical if request.mode == "lexical" else semantic if request.mode == "semantic" else lexical + semantic
        if not np.any(active_scores > 0):
            return {
                "query": request.query, "mode": request.mode, "top_k": request.top_k,
                "candidate_count": 0, "personalized": request.personalize, "results": [],
                "generic_results": [] if request.compare else None,
                "personalized_results": [] if request.compare else None,
                "pipeline": ["query processing", "retrieval", "candidate scoring", "ranking", "re-ranking", "top-k"],
            }
        candidates = self.retrieval.candidates(lexical, semantic, semantic_query, request.mode, candidate_count)
        metadata = self.ranking.metadata_scores(request.query)
        preference = self.personalization.scores(
            request.preferences, self.retrieval.vectorizer, self.retrieval.document_matrix
        )
        generic = self._rank_results(candidates, lexical, semantic, metadata, np.zeros_like(preference), request, False)
        personalized = self._rank_results(candidates, lexical, semantic, metadata, preference, request, True)
        primary = personalized if request.personalize else generic
        return {
            "query": request.query,
            "mode": request.mode,
            "top_k": request.top_k,
            "candidate_count": candidate_count,
            "personalized": request.personalize,
            "results": primary,
            "generic_results": generic if request.compare else None,
            "personalized_results": personalized if request.compare else None,
            "pipeline": ["query processing", "retrieval", "candidate scoring", "ranking", "re-ranking", "top-k"],
        }

    def _rank_results(self, candidates, lexical, semantic, metadata, preference, request, personalized):
        ranked = self.ranking.rank(
            candidates, lexical, semantic, metadata, preference, request.mode, personalized
        )
        return [self._present(item, rank, request.mode, personalized) for rank, item in enumerate(self.reranking.rerank(ranked, request.top_k), 1)]

    def _present(self, score: dict, rank: int, mode: str, personalized: bool) -> dict:
        document = self.retrieval.documents[score["index"]]
        explanations = []
        if mode in {"lexical", "hybrid"} and score["lexical_score"] >= 0.08:
            explanations.append("High lexical relevance")
        if mode in {"semantic", "hybrid"} and score["semantic_score"] >= 0.25:
            explanations.append("Strong latent-semantic match")
        if score["metadata_score"] > 0:
            explanations.append("Artist or brand metadata matched")
        if personalized and score["personalization_score"] > 0:
            explanations.append("Matched your local preferences")
        if not explanations:
            explanations.append("Selected from the strongest available retrieval candidates")
        description = html.unescape(re.sub(r"\s+", " ", document.get("description", ""))).strip()
        return {
            "rank": rank,
            "title": html.unescape(document["title"]),
            "brand": html.unescape(document.get("brand", "")),
            "snippet": description[:240] + ("…" if len(description) > 240 else ""),
            "scores": {key: round(score[key], 4) for key in (
                "lexical_score", "semantic_score", "metadata_score", "personalization_score", "ranking_score", "reranking_score"
            )},
            "explanations": explanations,
        }

    def capabilities(self) -> dict:
        return {**capability_status(True), "document_count": len(self.retrieval.documents)}
