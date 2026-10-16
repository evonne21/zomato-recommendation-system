from flask import Flask, request, jsonify
from flask_cors import CORS

from recommender import recommend_restaurants, df

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Zomato Restaurant Recommendation API is running!"
    })


@app.route("/cuisines", methods=["GET"])
def get_cuisines():
    cuisines = (
        df["cuisines type"]
        .dropna()
        .str.split(",")
        .explode()
        .str.strip()
    )

    return jsonify(sorted(cuisines[cuisines != ""].unique().tolist()))


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(silent=True) or {}

    cuisine = data.get("cuisine")
    max_budget = data.get("max_budget")
    area = data.get("area")
    min_rating = data.get("min_rating", 0)
    online_order = data.get("online_order")
    top_n = data.get("top_n", 10)

    if not cuisine or max_budget is None:
        return jsonify({
            "error": "Cuisine and maximum budget are required."
        }), 400

    try:
        max_budget = float(max_budget)
        min_rating = float(min_rating)
        top_n = int(top_n)

        if max_budget <= 0 or not 0 <= min_rating <= 5:
            raise ValueError

        if not 1 <= top_n <= 50:
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid budget, rating, or result count."
        }), 400

    if online_order not in (None, "Yes", "No"):
        return jsonify({
            "error": "online_order must be Yes, No, or null."
        }), 400

    try:
        results = recommend_restaurants(
            cuisine=cuisine,
            max_budget=max_budget,
            area=area,
            min_rating=min_rating,
            online_order=online_order,
            top_n=top_n
        )

        results = results.astype(object).where(
            results.notna(), None
        )

        return jsonify({
            "count": len(results),
            "restaurants": results.to_dict(orient="records")
        })

    except Exception:
        app.logger.exception("Recommendation request failed")
        return jsonify({
            "error": "Unable to generate recommendations."
        }), 500


@app.route("/analytics", methods=["GET"])
def get_analytics():
    import pandas as pd
    import numpy as np

    data = df.copy()

    rating_col = "rate (out of 5)"
    cost_col = "avg cost (two people)"
    cuisine_col = "cuisines type"

    ratings = pd.to_numeric(data[rating_col], errors="coerce")
    costs = pd.to_numeric(data[cost_col], errors="coerce")

    # Use genuine ratings for the average
    if "rating_was_missing" in data.columns:
        genuine_ratings = ratings[data["rating_was_missing"] == 0]
    else:
        genuine_ratings = ratings.dropna()

    # Split comma-separated cuisine names
    cuisines = (
        data[cuisine_col]
        .dropna()
        .str.split(",")
        .explode()
        .str.strip()
    )

    cuisine_counts = cuisines[cuisines != ""].value_counts()

    # Rating distribution
    rating_bins = [0, 2, 2.5, 3, 3.5, 4, 4.5, 5.01]
    rating_labels = [
        "<2", "2–2.49", "2.5–2.99", "3–3.49",
        "3.5–3.99", "4–4.49", "4.5–5"
    ]

    rating_groups = pd.cut(
        ratings,
        bins=rating_bins,
        labels=rating_labels,
        include_lowest=True
    )

    rating_distribution = [
        {"range": label, "count": int(count)}
        for label, count in rating_groups.value_counts(
            sort=False
        ).items()
    ]

    # Cost distribution
    cost_bins = [0, 300, 500, 800, 1000, 1500, 2500, np.inf]
    cost_labels = [
        "₹0–299", "₹300–499", "₹500–799",
        "₹800–999", "₹1,000–1,499",
        "₹1,500–2,499", "₹2,500+"
    ]

    cost_groups = pd.cut(
        costs,
        bins=cost_bins,
        labels=cost_labels,
        right=False
    )

    cost_distribution = [
        {"range": label, "count": int(count)}
        for label, count in cost_groups.value_counts(
            sort=False
        ).items()
    ]

    # Online ordering and table booking
    def category_counts(column):
        if column not in data.columns:
            return []

        values = (
            data[column]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
            .str.title()
            .value_counts()
        )

        return [
            {"category": str(label), "count": int(count)}
            for label, count in values.items()
        ]

    # Rating vs cost: limit the chart to a manageable sample
    scatter_data = pd.DataFrame({
        "rating": ratings,
        "cost": costs
    }).dropna()

    scatter_data = scatter_data.sample(
        n=min(500, len(scatter_data)),
        random_state=42
    )

    return jsonify({
        "total_restaurants": int(len(data)),

        "average_rating": (
            round(float(genuine_ratings.mean()), 2)
            if genuine_ratings.notna().any() else None
        ),

        "median_cost": (
            round(float(costs.median()), 2)
            if costs.notna().any() else None
        ),

        "cuisine_count": int(cuisines[cuisines != ""].nunique()),

        "imputed_ratings": (
            int(data["rating_was_missing"].sum())
            if "rating_was_missing" in data.columns else 0
        ),

        "rating_distribution": rating_distribution,
        "cost_distribution": cost_distribution,

        "top_cuisines": [
            {"cuisine": str(name), "count": int(count)}
            for name, count in cuisine_counts.head(10).items()
        ],

        "online_ordering": category_counts("online_order"),
        "table_booking": category_counts("table booking"),

        "rating_vs_cost": [
            {
                "rating": round(float(row.rating), 2),
                "cost": float(row.cost)
            }
            for row in scatter_data.itertuples(index=False)
        ]
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)