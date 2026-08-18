# %%
import json
from apyori import apriori

# %%
# 1 Load the data
with open("recipes.json", "r", encoding="utf-8") as file:
    recipes_data = json.load(file)

# %%
# 1.a
total_recipes = len(recipes_data)
print("Total number of recipe instances:", total_recipes)

# %%
# 1.b
all_cuisines = sorted({recipe["cuisine"] for recipe in recipes_data})
print("Number of cuisines available:", len(all_cuisines))

# %%
# 1.c
cuisine_counts = {}
for recipe in recipes_data:
    cuisine_name = recipe["cuisine"]
    cuisine_counts[cuisine_name] = cuisine_counts.get(cuisine_name, 0) + 1

print("\nCuisine type and number of recipes")
print("Cuisine".ljust(20), "Recipe Count")
print("-" * 33)
for cuisine_name in sorted(cuisine_counts.keys()):
    print(cuisine_name.ljust(20), cuisine_counts[cuisine_name])

# %%
# Build a lookup so user input can match cuisine names case-insensitively.
cuisine_lookup = {cuisine_name.lower(): cuisine_name for cuisine_name in all_cuisines}

# %%
# 5 Continue accepting input and responding until user enters "exit".
while True:
    # 2
    user_input = input("\nEnter a cuisine type (or exit): ").strip()

    if user_input.lower() == "exit":
        print("Exiting recommender.")
        break

    selected_key = user_input.lower()

    if selected_key not in cuisine_lookup:
        print(f"We don't have recommendations for {user_input}")
        continue

    selected_cuisine = cuisine_lookup[selected_key]

    # 3.a
    cuisine_recipes = [
        recipe["ingredients"]
        for recipe in recipes_data
        if recipe["cuisine"].lower() == selected_key
    ]

    # 3.a.i 
    support_value = 100 / len(cuisine_recipes)

    # 3.a.ii 
    confidence_value = 0.5

    apriori_results = list(
        apriori(
            cuisine_recipes,
            min_support=support_value,
            min_confidence=confidence_value,
        )
    )

    if not apriori_results:
        print(f"No association rules found for {selected_cuisine} cuisine.")
        continue

    # 4.a 
    top_group = list(apriori_results[0].items)
    print(f"\nTop group of ingredients for {selected_cuisine} cuisine:")
    print(top_group)

    # 4.b Show all rules with lift value greater than two.
    print("\nRules with lift greater than 2:")
    found_lift_rules = False

    for relation_record in apriori_results:
        for rule_stat in relation_record.ordered_statistics:
            if rule_stat.lift > 2:
                found_lift_rules = True
                base_items = list(rule_stat.items_base)
                add_items = list(rule_stat.items_add)
                print(
                    f"Rule: {base_items} -> {add_items}, "
                    f"Support: {relation_record.support:.4f}, "
                    f"Confidence: {rule_stat.confidence:.4f}, "
                    f"Lift: {rule_stat.lift:.4f}"
                )

    if not found_lift_rules:
        print("No rules with lift greater than 2 for this cuisine.")
