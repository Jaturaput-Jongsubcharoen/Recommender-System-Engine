"""Build the deployable search corpus from the tracked Digital Music metadata."""

from __future__ import annotations

import gzip
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "meta_Digital_Music.json.gz"
RECOMMENDATIONS = ROOT / "music_recommendations.json"
OUTPUT = ROOT / "music_search_corpus.json.gz"


def text(value: object) -> str:
    if isinstance(value, list):
        return " ".join(str(item) for item in value)
    return "" if value is None else str(value)


def build() -> int:
    titles = set(json.loads(RECOMMENDATIONS.read_text(encoding="utf-8")))
    records: dict[str, dict[str, str]] = {}
    with gzip.open(SOURCE, "rt", encoding="utf-8") as source:
        for line in source:
            item = json.loads(line)
            title = text(item.get("title")).strip()
            if title not in titles or title in records:
                continue
            records[title] = {
                "title": title,
                "description": text(item.get("description")).strip(),
                "brand": text(item.get("brand")).strip(),
            }
    missing = titles.difference(records)
    if missing:
        raise RuntimeError(f"Missing metadata for {len(missing)} recommendation titles")
    payload = json.dumps(list(records.values()), ensure_ascii=True, separators=(",", ":"))
    with OUTPUT.open("wb") as raw:
        with gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0) as target:
            target.write(payload.encode("utf-8"))
    return len(records)


if __name__ == "__main__":
    print(f"Wrote {build()} searchable music records to {OUTPUT}")
