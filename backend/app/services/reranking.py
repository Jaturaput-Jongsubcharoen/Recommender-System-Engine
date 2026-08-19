from __future__ import annotations


class RerankingService:
    """Greedy MMR re-ranking with exact-title duplicate suppression."""

    def __init__(self, retrieval, diversity_weight: float = 0.12):
        self.retrieval = retrieval
        self.diversity_weight = diversity_weight

    def rerank(self, ranked: list[dict], top_k: int) -> list[dict]:
        remaining = ranked[: max(top_k * 3, top_k)]
        selected: list[dict] = []
        seen: set[str] = set()
        while remaining and len(selected) < top_k:
            best = None
            best_score = float("-inf")
            for candidate in remaining:
                title_key = self.retrieval.titles[candidate["index"]].casefold()
                if title_key in seen:
                    continue
                redundancy = max(
                    (self.retrieval.semantic_similarity(candidate["index"], item["index"]) for item in selected),
                    default=0.0,
                )
                score = candidate["ranking_score"] - self.diversity_weight * max(0.0, redundancy)
                if score > best_score:
                    best, best_score = candidate, score
            if best is None:
                break
            remaining.remove(best)
            best = {**best, "reranking_score": float(best_score)}
            selected.append(best)
            seen.add(self.retrieval.titles[best["index"]].casefold())
        return selected
