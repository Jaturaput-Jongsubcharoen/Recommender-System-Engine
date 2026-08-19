from __future__ import annotations

import numpy as np

from ..schemas import UserPreferences


class PersonalizationService:
    def __init__(self, titles: list[str], recommendation_graph: dict[str, list[str]]):
        self._title_lookup = {title.lower(): title for title in titles}
        self._recommendation_graph = recommendation_graph

    def scores(self, preferences: UserPreferences, vectorizer, document_matrix) -> np.ndarray:
        signals = [*preferences.favorite_terms, *preferences.recent_searches[-5:]]
        score = np.zeros(document_matrix.shape[0], dtype=np.float32)
        if signals:
            profile = vectorizer.transform([" ".join(signals)])
            score += (document_matrix @ profile.T).toarray().ravel().astype(np.float32)
        title_index = {title.lower(): index for index, title in enumerate(self._title_lookup.values())}
        for liked in preferences.liked_titles:
            original = self._title_lookup.get(liked.lower())
            if not original:
                continue
            for neighbor in self._recommendation_graph.get(original, []):
                index = title_index.get(neighbor.lower())
                if index is not None:
                    score[index] += 0.35
        for disliked in preferences.disliked_titles:
            index = title_index.get(disliked.lower())
            if index is not None:
                score[index] -= 1.0
        return np.clip(score, -1.0, 1.0)
