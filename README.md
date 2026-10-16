# DineWise — Restaurant Recommendation System

DineWise is a data-driven restaurant discovery website built around a Zomato restaurant dataset for Bengaluru. It helps users find restaurants using preferences such as cuisine, budget, locality, minimum rating, and online-ordering availability. It also includes an analytics dashboard for exploring patterns in the restaurant dataset.

## Features

- **Preference-based recommendations** using cuisine and budget filters.
- **Optional locality filtering** to narrow results by area.
- **Minimum-rating filter** that excludes restaurants whose original ratings were missing.
- **Online-ordering filter** when the user specifies a preference.
- **Weighted-rating ranking** to balance a restaurant's rating with the number of ratings it has received.
- **Analytics dashboard** with charts and summary statistics about the dataset.
- **React frontend and Flask backend** connected through API requests.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Python, Flask |
| Data processing | Pandas, NumPy |
| Dataset and exploratory analysis | CSV, Google Colab |
| Frontend/backend communication | HTTP requests and JSON |

## Recommendation Method

DineWise applies preference-based filtering followed by weighted-rating ranking. It is a deterministic, rule-based recommendation workflow; it does not train a machine-learning model or learn preferences from a user's history.

The weighted-rating formula used during dataset preparation is:

\[
WR = \frac{v}{v+m}R + \frac{m}{v+m}C
\]

Where:

- `WR` is the weighted rating.
- `R` is the restaurant's original rating out of 5.
- `v` is the number of ratings received.
- `m` is the rating-count threshold.
- `C` is the mean of genuine ratings.

For this project, the calculated mean genuine rating is `C = 3.51` and the 75th-percentile rating-count threshold is `m = 129`. Therefore:

\[
WR = \frac{v}{v+129}R + \frac{129}{v+129}(3.51)
\]

Restaurants whose original ratings were missing are excluded from weighted-rating calculations so imputed ratings are not treated as genuine ratings.

The backend filters restaurants by cuisine, maximum cost for two people, and minimum original rating. If provided, area and online-ordering preferences are applied. Results are sorted by weighted rating (descending), with number of ratings (descending) as the secondary sort key.

## Project Structure

```text
zomato-recommendation-system/
├── backend/
│   ├── app.py
│   ├── recommender.py
│   └── zomato_cleaned.csv
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

*Note: The exact filenames may differ if the project has been reorganized. Keep this structure aligned with the files in the repository.*

## Getting Started

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/evonne21/zomato-recommendation-system.git
cd zomato-recommendation-system
```

### 2. Set up the backend

Open a terminal in the project root and create/activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python packages required by the backend. If the repository includes a `requirements.txt`, use:

```powershell
pip install -r backend\requirements.txt
```

If there is no requirements file, install the packages used by the backend, such as Flask, Pandas, and NumPy, according to the imports in the source code.

Start the Flask application using the command specified in `backend/app.py`. For example, if the Flask entry point is `app.py`:

```powershell
cd backend
python app.py
```

### 3. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite in the terminal.

> **Important:** The frontend API configuration must point to the address where the Flask backend is running. Check `frontend/src/services/api.js` and the backend's configured port if requests fail.

## Dataset

The project uses a cleaned CSV file named `zomato_cleaned.csv`, containing restaurant attributes such as cuisine, rating, number of ratings, average cost for two people, area, and online-ordering availability.

The exact original dataset publisher and download URL should be added here after verifying the source used for the project. The dataset may not reflect current restaurant prices, ratings, or service availability.

## Screenshots

Add screenshots of the working application here, for example:

- Home page
- Recommendations form
- Recommendation results
- Analytics dashboard
- Exploratory data analysis charts

To add an image stored in the repository, use Markdown such as:

```markdown
![DineWise homepage](docs/screenshots/home.png)
```

## Limitations

- Recommendations depend on the coverage and quality of the available dataset.
- Restaurant data may become outdated.
- Cuisine and area matching uses text matching, so inconsistent labels can affect results.
- The current system does not learn from individual user behaviour or feedback.
- A weighted score is a ranking method, not a guarantee that a restaurant will suit every user.

## Future Enhancements

- Refresh restaurant information periodically.
- Improve locality matching and add map-based discovery.
- Allow users to save preferences and favourite restaurants.
- Collect user feedback and evaluate recommendation quality.
- Explore more advanced recommendation approaches when suitable interaction data is available.
- Deploy the frontend and backend so the application can be accessed publicly.

## References

- [Pandas documentation](https://pandas.pydata.org/docs/)
- [NumPy documentation](https://numpy.org/doc/)
- [Flask documentation](https://flask.palletsprojects.com/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)

---

**Project:** DineWise — A Data-Driven Restaurant Recommendation System  
**Course context:** Intelligent Data Systems 1 Lab mini project
