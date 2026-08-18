import os
from pathlib import Path


APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
REPOSITORY_DIR = BACKEND_DIR.parent


def _path_from_env(name: str, default: Path) -> Path:
    value = os.getenv(name)
    if not value:
        return default
    path = Path(value).expanduser()
    return path if path.is_absolute() else (BACKEND_DIR / path).resolve()


RECIPES_PATH = _path_from_env("RECIPES_PATH", REPOSITORY_DIR / "recipes.json")
MUSIC_RECOMMENDATIONS_PATH = _path_from_env(
    "MUSIC_RECOMMENDATIONS_PATH", REPOSITORY_DIR / "music_recommendations.json"
)


def cors_origins() -> list[str]:
    """Return comma-separated, normalized CORS origins."""
    return [
        origin.strip().rstrip("/")
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
