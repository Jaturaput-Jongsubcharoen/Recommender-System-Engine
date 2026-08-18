# %%
import gzip
import json
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# %%
DATASET_FILE = "meta_Digital_Music.json.gz"
RECOMMENDATIONS_FILE = "music_recommendations.json"

# %%
def load_json_gz_to_dataframe(file_path):
    records = []
    with gzip.open(file_path, "rt", encoding="utf-8") as file:
        for line in file:
            records.append(json.loads(line))
    return pd.DataFrame(records)

# %%
def convert_cell_to_text(value):
    if isinstance(value, list):
        return " ".join(str(item) for item in value)
    if isinstance(value, dict):
        return " ".join(f"{key} {item_value}" for key, item_value in value.items())
    if pd.isna(value):
        return ""
    return str(value)

# %%
def is_empty_value(value):
    if value is None:
        return True
    if isinstance(value, float) and pd.isna(value):
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, (list, dict, tuple, set)):
        return len(value) == 0
    return False

# %%
def build_recommendations_by_title(dataframe):
    # 3.b.ii: Create TF-IDF vectors for the textual description of every song.
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(dataframe["feature_text"])

    # 3.c: Compute pairwise cosine similarity score of every song title.
    recommendations_lookup = {}
    title_list = dataframe["title"].tolist()

    for current_index, current_title in enumerate(title_list):
        if current_index % 500 == 0:
            print(f"Building recommendations: {current_index}/{len(title_list)}")
        similarity_scores = cosine_similarity(tfidf_matrix[current_index], tfidf_matrix).flatten()
        sorted_indices = similarity_scores.argsort()[::-1]

        top_titles = []
        for similar_index in sorted_indices:
            if similar_index == current_index:
                continue
            candidate_title = title_list[similar_index]
            if candidate_title not in top_titles:
                top_titles.append(candidate_title)
            if len(top_titles) == 10:
                break

        recommendations_lookup[current_title] = top_titles

    return recommendations_lookup

# %%
def get_top_ten_recommendations(song_title_input, title_lookup, recommendations_lookup):
    search_key = song_title_input.lower().strip()
    if search_key == "":
        return None

    if search_key not in title_lookup:
        return None

    original_title = title_lookup[search_key]
    return recommendations_lookup.get(original_title, [])

# %%
# 1 Load the dataset into a dataframe named songs_firstname.
songs_firstname = load_json_gz_to_dataframe(DATASET_FILE)

# %%
# 2.a Carry out exploration including checks for empty data and null values.
print("Total rows:", len(songs_firstname))
print("Total columns:", len(songs_firstname.columns))
print("Columns:", list(songs_firstname.columns))
print("\nNull count per column:")
print(songs_firstname.isnull().sum())

print("\nEmpty value count per column:")
for column_name in songs_firstname.columns:
    empty_count = songs_firstname[column_name].apply(is_empty_value).sum()
    print(f"{column_name}: {empty_count}")

# %%
# 2.b Select columns for recommender features (title + text description fields).
selected_columns = ["title", "description", "feature", "category", "brand"]
available_columns = [column for column in selected_columns if column in songs_firstname.columns]

# %%
# 2.c Filter rows/columns by removing rows without usable title or feature text.
songs_working = songs_firstname[available_columns].copy()
for column_name in available_columns:
    songs_working[column_name] = songs_working[column_name].apply(convert_cell_to_text)

songs_working["title"] = songs_working["title"].str.strip()
text_columns = [column for column in available_columns if column != "title"]

songs_working["feature_text"] = ""
for column_name in text_columns:
    songs_working["feature_text"] = songs_working["feature_text"] + " " + songs_working[column_name]

# %%
# 3.a Clean data and prepare feature space based on selected columns.
songs_working["feature_text"] = songs_working["feature_text"].fillna("").str.strip()
songs_working = songs_working[songs_working["title"] != ""]
if "description" in songs_working.columns:
    songs_working["description"] = songs_working["description"].fillna("").str.strip()
    songs_working = songs_working[songs_working["description"] != ""]
    songs_working = songs_working[songs_working["description"].str.len() >= 100]
songs_working = songs_working[songs_working["feature_text"] != ""]
songs_working = songs_working.drop_duplicates(subset=["title"]).reset_index(drop=True)

# %%
# 3.b.i Pre-process text data by lowercasing and normalizing spaces.
songs_working["feature_text"] = songs_working["feature_text"].str.lower().str.split().str.join(" ")

print("\nRows after filtering and cleaning:", len(songs_working))

# 3.d Store recommendations in a separate file that app will access.
if os.path.exists(RECOMMENDATIONS_FILE):
    with open(RECOMMENDATIONS_FILE, "r", encoding="utf-8") as file:
        recommendations_data = json.load(file)
else:
    recommendations_data = build_recommendations_by_title(songs_working)
    with open(RECOMMENDATIONS_FILE, "w", encoding="utf-8") as file:
        json.dump(recommendations_data, file, ensure_ascii=True, indent=2)

# %%
# Build title lookup for case-insensitive user input matching.
title_lookup = {title.lower(): title for title in songs_working["title"].tolist()}

# %%
# 4 Recommender function is implemented using get_top_ten_recommendations().
# 4.c Continue accepting input until user enters "exit".
while True:
    # 4.a Receive song title input; if unavailable show required message and reprompt.
    user_song_title = input("\nEnter a song title (or exit): ").strip()

    if user_song_title.lower() == "exit":
        print("Exiting recommender.")
        break

    top_ten = get_top_ten_recommendations(user_song_title, title_lookup, recommendations_data)

    if top_ten is None:
        print(f"We don't have recommendations for {user_song_title}")
        continue

    # 4.b If song title is available, present top-10 most similar song titles.
    print("Top 10 recommended song titles:")
    for index, recommended_title in enumerate(top_ten, start=1):
        print(f"{index}. {recommended_title}")