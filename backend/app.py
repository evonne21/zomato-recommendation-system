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


if __name__ == "__main__":
    app.run(debug=True, port=5000)