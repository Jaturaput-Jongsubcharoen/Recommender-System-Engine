import json
from pathlib import Path


class MusicRecommender:
    def __init__(self, recommendations_path: Path):
        with recommendations_path.open(encoding="utf-8") as source:
            self._recommendations = json.load(source)
        self._title_lookup = {title.lower(): title for title in self._recommendations}

    def search_titles(self, query: str, limit: int = 10) -> list[str]:
        normalized = query.strip().lower()
        if not normalized:
            return []
        return [
            title for title in self._recommendations if normalized in title.lower()
        ][:limit]

    def recommend(self, title: str) -> dict | None:
        original = self._title_lookup.get(title.strip().lower())
        if original is None:
            return None
        return {"title": original, "recommendations": self._recommendations[original][:10]}
