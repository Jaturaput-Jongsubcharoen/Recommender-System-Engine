from __future__ import annotations

import math
from collections.abc import Iterable, Sequence


def precision_at_k(ranked: Sequence[str], relevant: set[str], k: int) -> float:
    if k <= 0:
        raise ValueError("k must be positive")
    return sum(item in relevant for item in ranked[:k]) / k


def recall_at_k(ranked: Sequence[str], relevant: set[str], k: int) -> float | None:
    if not relevant:
        return None
    return sum(item in relevant for item in ranked[:k]) / len(relevant)


def reciprocal_rank(ranked: Iterable[str], relevant: set[str]) -> float:
    return next((1 / rank for rank, item in enumerate(ranked, 1) if item in relevant), 0.0)


def ndcg_at_k(ranked: Sequence[str], relevance: dict[str, float], k: int) -> float | None:
    gains = [max(0.0, relevance.get(item, 0.0)) for item in ranked[:k]]
    ideal = sorted((max(0.0, score) for score in relevance.values()), reverse=True)[:k]
    if not ideal or not any(ideal):
        return None
    dcg = sum((2**gain - 1) / math.log2(index + 2) for index, gain in enumerate(gains))
    idcg = sum((2**gain - 1) / math.log2(index + 2) for index, gain in enumerate(ideal))
    return dcg / idcg


def evaluation_status() -> dict:
    return {
        "available": False,
        "metrics": {"precision_at_k": None, "recall_at_k": None, "mrr": None, "ndcg_at_k": None},
        "reason": (
            "The repository has no independent relevance judgments. Precomputed TF-IDF neighbors "
            "cannot be reused as ground truth without biasing the comparison."
        ),
        "supported_metrics": ["Precision@K", "Recall@K", "MRR", "NDCG@K"],
    }
