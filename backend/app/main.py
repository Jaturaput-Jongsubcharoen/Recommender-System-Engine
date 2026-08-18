from functools import lru_cache

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import MUSIC_RECOMMENDATIONS_PATH, RECIPES_PATH, cors_origins
from .services.cuisine import CuisineRecommender
from .services.music import MusicRecommender

app = FastAPI(title="Recommendation System API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def cuisine_service() -> CuisineRecommender:
    return CuisineRecommender(RECIPES_PATH)


@lru_cache(maxsize=1)
def music_service() -> MusicRecommender:
    return MusicRecommender(MUSIC_RECOMMENDATIONS_PATH)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/cuisines")
def cuisines() -> dict[str, list[str]]:
    return {"cuisines": cuisine_service().cuisines}


@app.get("/api/recommendations/cuisine/{cuisine}")
def cuisine_recommendations(cuisine: str) -> dict:
    result = cuisine_service().recommend(cuisine)
    if result is None:
        raise HTTPException(status_code=404, detail=f"No recommendations for {cuisine}")
    return result


@app.get("/api/music/titles")
def music_titles(q: str = Query(default="", max_length=200)) -> dict[str, list[str]]:
    return {"titles": music_service().search_titles(q)}


@app.get("/api/recommendations/music")
def music_recommendations(title: str = Query(min_length=1, max_length=500)) -> dict:
    result = music_service().recommend(title)
    if result is None:
        raise HTTPException(status_code=404, detail=f"No recommendations for {title}")
    return result
