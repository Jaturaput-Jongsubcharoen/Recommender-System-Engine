from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass(frozen=True)
class RankingWeights:
    lexical: float = 0.45
    semantic: float = 0.45
    metadata: float = 0.10
    personalization: float = 0.25


class RankingService:
    def __init__(self, documents: list[dict[str, str]], weights: RankingWeights):
        self.documents = documents
        self.weights = weights

    def metadata_scores(self, query: str) -> np.ndarray:
        query_terms = set(query.lower().split())
        values = []
        for item in self.documents:
            brand_terms = set(item.get("brand", "").lower().split())
            values.append(len(query_terms & brand_terms) / max(1, len(query_terms)))
        return np.asarray(values, dtype=np.float32)

    def rank(
        self,
        candidates: np.ndarray,
        lexical: np.ndarray,
        semantic: np.ndarray,
        metadata: np.ndarray,
        personalization: np.ndarray,
        mode: str,
        personalized: bool,
    ) -> list[dict]:
        weights = self.weights
        if mode == "lexical":
            relevance = lexical
        elif mode == "semantic":
            relevance = semantic
        else:
            relevance = weights.lexical * lexical + weights.semantic * semantic + weights.metadata * metadata
        final = relevance + (weights.personalization * personalization if personalized else 0)
        ranked = sorted(candidates, key=lambda index: float(final[index]), reverse=True)
        return [
            {
                "index": int(index),
                "lexical_score": float(lexical[index]),
                "semantic_score": float(semantic[index]),
                "metadata_score": float(metadata[index]),
                "personalization_score": float(personalization[index]) if personalized else 0.0,
                "ranking_score": float(final[index]),
            }
            for index in ranked
        ]
