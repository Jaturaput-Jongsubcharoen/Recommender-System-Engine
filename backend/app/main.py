from functools import lru_cache

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import MUSIC_RECOMMENDATIONS_PATH, MUSIC_SEARCH_CORPUS_PATH, RECIPES_PATH, cors_origins
from .schemas import SearchRequest
from .services.cuisine import CuisineRecommender
from .services.evaluation import evaluation_status
from .services.music import MusicRecommender
from .services.search import SearchService, capability_status

app = FastAPI(title="Recommendation System API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def cuisine_service() -> CuisineRecommender:
    return CuisineRecommender(RECIPES_PATH)


@lru_cache(maxsize=1)
def music_service() -> MusicRecommender:
    return MusicRecommender(MUSIC_RECOMMENDATIONS_PATH)


@lru_cache(maxsize=1)
def search_service() -> SearchService:
    return SearchService(MUSIC_SEARCH_CORPUS_PATH, MUSIC_RECOMMENDATIONS_PATH)


def require_search_service() -> SearchService:
    try:
        return search_service()
    except (FileNotFoundError, OSError, ValueError) as error:
        raise HTTPException(status_code=503, detail="The search index is currently unavailable.") from error


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


@app.post("/api/search")
def search(request: SearchRequest) -> dict:
    return require_search_service().search(request)


@app.get("/api/search/capabilities")
def search_capabilities() -> dict:
    return capability_status(search_service.cache_info().currsize > 0)


@app.get("/api/search/evaluation")
def search_evaluation() -> dict:
    return evaluation_status()
