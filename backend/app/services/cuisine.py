import json
from functools import lru_cache
from pathlib import Path

from apyori import apriori


class CuisineRecommender:
    def __init__(self, dataset_path: Path):
        with dataset_path.open(encoding="utf-8") as dataset:
            self._recipes = json.load(dataset)
        self._lookup = {
            cuisine.lower(): cuisine
            for cuisine in sorted({recipe["cuisine"] for recipe in self._recipes})
        }

    @property
    def cuisines(self) -> list[str]:
        return list(self._lookup.values())

    @lru_cache(maxsize=None)
    def recommend(self, cuisine: str) -> dict | None:
        key = cuisine.strip().lower()
        if key not in self._lookup:
            return None
        transactions = [
            recipe["ingredients"]
            for recipe in self._recipes
            if recipe["cuisine"].lower() == key
        ]
        # Keep the assignment's 100-occurrence support threshold, capped to Apriori's range.
        minimum_support = min(1.0, 100 / len(transactions))
        records = list(
            apriori(transactions, min_support=minimum_support, min_confidence=0.5)
        )
        top_ingredients = sorted(records[0].items) if records else []
        rules = []
        for record in records:
            for statistic in record.ordered_statistics:
                if statistic.lift > 2 and statistic.items_base and statistic.items_add:
                    rules.append(
                        {
                            "from": sorted(statistic.items_base),
                            "to": sorted(statistic.items_add),
                            "support": round(record.support, 4),
                            "confidence": round(statistic.confidence, 4),
                            "lift": round(statistic.lift, 4),
                        }
                    )
        rules.sort(key=lambda item: item["lift"], reverse=True)
        return {
            "cuisine": self._lookup[key],
            "top_ingredients": top_ingredients,
            "rules": rules,
        }
