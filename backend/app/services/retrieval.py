from __future__ import annotations

import gzip
import json
from pathlib import Path

import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize


class RetrievalService:
    """Cached lexical and latent-semantic indexes over real music metadata."""

    def __init__(self, corpus_path: Path, semantic_dimensions: int = 64):
        with gzip.open(corpus_path, "rt", encoding="utf-8") as source:
            self.documents: list[dict[str, str]] = json.load(source)
        self.titles = [item["title"] for item in self.documents]
        self.texts = [
            " ".join(part for part in (item["title"], item.get("brand", ""), item.get("description", "")) if part)
            for item in self.documents
        ]
        self.vectorizer = TfidfVectorizer(
            stop_words="english", ngram_range=(1, 2), min_df=2, max_features=12_000, sublinear_tf=True
        )
        self.document_matrix = self.vectorizer.fit_transform(self.texts)
        dimensions = min(semantic_dimensions, max(2, self.document_matrix.shape[1] - 1))
        self.semantic_model = TruncatedSVD(n_components=dimensions, random_state=42)
        self.semantic_matrix = normalize(self.semantic_model.fit_transform(self.document_matrix)).astype(np.float32)
        self.vector_index = NearestNeighbors(metric="cosine", algorithm="brute").fit(self.semantic_matrix)

    def score_query(self, query: str) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        query_vector = self.vectorizer.transform([query])
        lexical = (self.document_matrix @ query_vector.T).toarray().ravel().astype(np.float32)
        semantic_query = normalize(self.semantic_model.transform(query_vector)).astype(np.float32)
        semantic = (self.semantic_matrix @ semantic_query.ravel()).astype(np.float32)
        return np.clip(lexical, 0, 1), np.clip(semantic, 0, 1), semantic_query

    def candidates(self, lexical: np.ndarray, semantic: np.ndarray, semantic_query: np.ndarray, mode: str, count: int) -> np.ndarray:
        count = min(count, len(self.documents))
        if mode == "lexical":
            scores = lexical
        elif mode == "semantic":
            return self.vector_index.kneighbors(semantic_query, n_neighbors=count, return_distance=False)[0]
        else:
            lexical_pool = np.argpartition(lexical, -count)[-count:]
            semantic_pool = self.vector_index.kneighbors(semantic_query, n_neighbors=count, return_distance=False)[0]
            pool = np.unique(np.concatenate((lexical_pool, semantic_pool)))
            scores = 0.55 * lexical + 0.45 * semantic
            return pool[np.argsort(scores[pool])[::-1]][:count]
        if count == len(scores):
            return np.argsort(scores)[::-1]
        pool = np.argpartition(scores, -count)[-count:]
        return pool[np.argsort(scores[pool])[::-1]]

    def semantic_similarity(self, first: int, second: int) -> float:
        return float(self.semantic_matrix[first] @ self.semantic_matrix[second])
