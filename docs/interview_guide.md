# Interview Guide

## One-minute project explanation

I built a personal portfolio website around an end-to-end public-health ML system. The project predicts state-level hantavirus risk as low, medium, or high using surveillance-style, climate, geography, and exposure features. I framed the task as risk-level forecasting instead of individual medical diagnosis because hantavirus data is sparse and the public-health use case is planning, not clinical decision-making.

The system includes a training pipeline, saved model artifacts, model metrics, FastAPI prediction endpoints, Pydantic input validation, and an interactive website where users can change scenario assumptions and inspect model output.

## What data does it use?

The current MVP uses a demo dataset in `data/demo/hantavirus_risk_demo.csv`. It is not official surveillance data. I used demo data first so I could build and validate the full product loop: data loading, feature engineering, model training, serving, and website interaction.

The production data plan is to replace the demo dataset with:

- CDC NNDSS annual or weekly disease surveillance counts.
- CDC hantavirus case summaries and public reporting context.
- NOAA climate data such as temperature, precipitation, and drought conditions.
- Census / ACS population and rurality features.
- Land-cover or habitat proxies such as forest cover and rodent habitat score.

## Why hantavirus?

Hantavirus is a useful ML engineering case because it is rare, severe, and sparse in public datasets. That makes it more realistic than a clean Kaggle-style project. The model has to be careful about uncertainty, interpretability, and public-health framing.

## What is the ML task?

The MVP is a supervised classification problem. The model predicts a state-level risk label:

- low
- medium
- high

The features include state, region, season, year, average temperature, precipitation, drought index, rural population percentage, forest cover percentage, rodent habitat score, and historical cases.

## What model did you use?

I used a Random Forest classifier as an interpretable baseline. It handles nonlinear relationships, works well on tabular data, and exposes feature importance. In a later version I would compare it against logistic regression, gradient boosting, and calibrated models.

## What does the website show?

The website shows:

- a personal MLE/SDE portfolio landing page
- an interactive risk predictor
- probability scores for each class
- key risk drivers
- planning recommendations
- model accuracy on the demo split
- top feature importances
- system architecture and project story

## What parts are MLE?

- Data validation and feature schema
- Training script
- Model serialization with `joblib`
- Metrics saved to JSON
- Model card output
- FastAPI model serving
- Pydantic request validation
- Tests for data and prediction contracts
- Dockerfile for deployment

## What parts are SDE?

- API route design
- Frontend state management with JavaScript
- Responsive website layout
- Input controls and form validation
- Separation between backend, model logic, and static assets
- Deployable service structure

## How would you improve it?

The most important next improvements are:

- Replace demo data with CDC/NNDSS and NOAA ingestion.
- Add MLflow experiment tracking.
- Add better evaluation for sparse and imbalanced data.
- Add calibration so confidence scores are more meaningful.
- Deploy the FastAPI app to Render, Railway, Fly.io, or Cloud Run.
- Connect a custom domain such as `yanzhongwuproject.com`.

## Short answer if someone challenges the demo data

The current dataset is intentionally a demo dataset. I used it to build the end-to-end system first. The important engineering work is the full pipeline: feature schema, model training, model artifact, API serving, website interaction, and documentation. The next production step is replacing the demo data with CDC/NNDSS, NOAA, Census, and land-cover data.

## Resume bullets

- Built a personal portfolio website around an end-to-end ML platform for state-level zoonotic disease risk forecasting.
- Trained and served a Random Forest risk classifier with FastAPI, Pydantic validation, saved metrics, feature importance, and a browser-based prediction UI.
- Designed the project for MLE/SDE storytelling: data pipeline, model artifact, API layer, responsive frontend, Docker deployment path, and public-health risk framing.
