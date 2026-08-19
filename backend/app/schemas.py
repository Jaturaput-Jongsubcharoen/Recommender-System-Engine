from typing import Literal

from pydantic import BaseModel, Field, field_validator


RetrievalMode = Literal["lexical", "semantic", "hybrid"]


class UserPreferences(BaseModel):
    favorite_terms: list[str] = Field(default_factory=list, max_length=20)
    liked_titles: list[str] = Field(default_factory=list, max_length=50)
    disliked_titles: list[str] = Field(default_factory=list, max_length=50)
    recent_searches: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("favorite_terms", "liked_titles", "disliked_titles", "recent_searches")
    @classmethod
    def clean_values(cls, values: list[str]) -> list[str]:
        cleaned = [value.strip() for value in values if value.strip()]
        if any(len(value) > 200 for value in cleaned):
            raise ValueError("Preference values must be 200 characters or fewer")
        return cleaned


class SearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=500)
    mode: RetrievalMode = "hybrid"
    top_k: int = Field(default=10, ge=1, le=20)
    personalize: bool = False
    compare: bool = False
    preferences: UserPreferences = Field(default_factory=UserPreferences)

    @field_validator("query")
    @classmethod
    def query_must_have_text(cls, value: str) -> str:
        cleaned = " ".join(value.split())
        if len(cleaned) < 2:
            raise ValueError("Query must contain at least two characters")
        return cleaned
