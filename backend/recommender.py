from pathlib import Path
import pandas as pd

DATA_PATH = Path(__file__).resolve().parent / "zomato_cleaned.csv"

df = pd.read_csv(DATA_PATH, encoding="utf-8-sig")


def fix_encoding(text):
    if not isinstance(text, str):
        return text

    if "Ã" in text or "Â" in text or "â€" in text:
        try:
            return text.encode("latin1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return text

    return text


df["restaurant name"] = df["restaurant name"].apply(fix_encoding)

def recommend_restaurants(
    cuisine,
    max_budget,
    area=None,
    min_rating=0,
    online_order=None,
    top_n=10
):
    results = df.copy()

    results = results[
        results["cuisines type"].str.contains(
            cuisine, case=False, na=False, regex=False
        )
    ]

    results = results[
        results["avg cost (two people)"] <= max_budget
    ]

    results = results[
        (~results["rating_was_missing"]) &
        (results["rate (out of 5)"] >= min_rating)
    ]

    if area:
        results = results[
            results["area"].str.contains(
                area, case=False, na=False, regex=False
            )
        ]

    if online_order is not None:
        results = results[
            results["online_order"] == online_order
        ]

    results = results.sort_values(
        by=["weighted_rating", "num of ratings"],
        ascending=[False, False]
    )

    columns = [
        "restaurant name",
        "cuisines type",
        "rate (out of 5)",
        "avg cost (two people)",
        "area",
        "online_order",
        "weighted_rating"
    ]

    return results[columns].head(top_n)