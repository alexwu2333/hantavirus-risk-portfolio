# Yanzhong Wu Personal ML Portfolio: Hantavirus Risk Early-Warning Website

An end-to-end personal portfolio website by Yanzhong Wu that showcases a machine learning system for estimating state-level zoonotic disease risk from environmental, historical, and seasonal indicators. The first MVP focuses on hantavirus as a public-health risk forecasting use case.

This is not a clinical diagnosis tool. It predicts public-health risk levels for planning and exploration.

## Why this project matters

Hantavirus disease is rare but severe, and public surveillance data is sparse. That makes it a strong portfolio project because it forces practical ML engineering tradeoffs:

- small and imbalanced datasets
- public data limitations
- interpretable risk scoring
- model serving with a real API
- a usable dashboard for non-technical users

## MVP scope

- Load a demo state-year risk dataset
- Train a risk-level classifier
- Save model artifacts and metrics
- Serve predictions through FastAPI
- Render a personal website with an embedded interactive predictor
- Document how to replace demo data with CDC/NNDSS and NOAA inputs

## Project structure

```text
app/static/              Portfolio website and browser predictor
data/demo/               Demo seed dataset for local development
data/processed/          Generated training data
docs/                    GitHub Pages static site, data source notes, deployment notes
models/                  Saved model artifacts
reports/                 Metrics and evaluation outputs
src/hantavirus_risk/     Python package
tests/                   Unit tests
```

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
python -m hantavirus_risk.train
uvicorn hantavirus_risk.api:app --reload
```

Open `http://127.0.0.1:8000`.

Contact links:

- Email: alexwu020615@gmail.com
- LinkedIn: https://www.linkedin.com/in/yanzhong-wu-bb71883a9

## Website and stack

The website is served by FastAPI and built with plain HTML, CSS, and JavaScript:

- `app/static/index.html`: portfolio website and embedded predictor UI
- `app/static/styles.css`: responsive visual design
- `app/static/app.js`: browser logic, API calls, probability chart, metadata rendering
- `docs/index.html`: GitHub Pages build of the website
- `docs/static/app.js`: static deployment version with a browser-side demo predictor fallback
- `src/hantavirus_risk/api.py`: FastAPI routes for the website and prediction endpoints
- `src/hantavirus_risk/train.py`: model training and metrics generation
- `src/hantavirus_risk/predict.py`: inference logic and risk explanations

## GitHub Pages website

The repository includes a GitHub Pages-ready static build in `docs/`.

- GitHub Pages should be configured to deploy from the `main` branch and `/docs` folder.
- Public website: https://alexwu2333.github.io/hantavirus-risk-portfolio/
- On GitHub Pages, the site uses a browser-side demo predictor fallback because GitHub Pages cannot run Python/FastAPI.
- The full MLE/SDE version still runs locally or on a backend platform such as Render using FastAPI.

Suggested GitHub repository description:

> End-to-end ML portfolio website for state-level hantavirus public-health risk prediction, with FastAPI serving, interactive scenario analysis, and a GitHub Pages static demo.

## Data sources

Current MVP data:

- `data/demo/hantavirus_risk_demo.csv` is a demo dataset created for local development.
- It is labeled as `demo` and should not be presented as official CDC surveillance data.
- It exists so the pipeline, API, model artifact, and website can be demonstrated end to end.

Production data plan:

- CDC NNDSS annual or weekly data for official disease surveillance counts.
- CDC hantavirus case summaries for background and known public data limitations.
- NOAA climate features such as temperature, precipitation, and drought indicators.
- Census / ACS features for population and rurality.
- Land-cover or habitat features such as forest cover and rodent habitat proxies.

See [docs/data_sources.md](docs/data_sources.md) for the detailed plan.

## Custom domain

Yes, the local URL can become a normal public website URL such as `https://yanzhongwuproject.com`, but it requires deployment:

1. Buy a domain from a registrar such as Cloudflare Registrar, Namecheap, Squarespace Domains, or Railway Domains.
2. Deploy the FastAPI app to a platform such as Render, Railway, Fly.io, AWS, or Google Cloud Run.
3. Point the domain DNS records to the deployed app.
4. Enable HTTPS through the hosting platform.

`127.0.0.1:8000` only means the website is running on your own computer. A public custom domain needs a hosted server.

GitHub is not strictly required, but it is recommended because services like Render and Railway can automatically redeploy your website whenever you push code changes. Without GitHub, you can still deploy manually with a CLI, Docker image, or direct upload depending on the platform.

## Free GitHub-based deployment

You do not need to buy a domain. The recommended free path is to put the code on GitHub and deploy the FastAPI app on Render or Railway. GitHub Pages alone cannot run this full app because GitHub Pages does not run Python backends.

See [docs/github_free_deployment.md](docs/github_free_deployment.md).

## Example API request

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "state": "New Mexico",
    "year": 2026,
    "season": "summer",
    "avg_temp_f": 77,
    "precip_in": 1.1,
    "drought_index": 3.5,
    "rural_population_pct": 36,
    "forest_cover_pct": 31,
    "rodent_habitat_score": 84,
    "historical_cases": 8
  }'
```

## Data note

The included CSV is demo data designed to make the pipeline runnable on day one. It is clearly marked as `demo` and should not be presented as official surveillance data. The production direction is documented in [docs/data_sources.md](docs/data_sources.md).

## Portfolio positioning

Suggested resume bullet:

> Built an end-to-end ML platform to forecast state-level zoonotic disease risk using surveillance-style, climate, and geographic features; trained an interpretable classifier, served predictions through FastAPI, and shipped an interactive public-health dashboard.

For interview answers, see [docs/interview_guide.md](docs/interview_guide.md).
