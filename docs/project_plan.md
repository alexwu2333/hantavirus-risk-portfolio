# Project Plan

## Phase 1: MVP

- Create a runnable local ML application.
- Train a baseline risk classifier.
- Serve predictions through an API.
- Build a dashboard for scenario exploration.
- Document assumptions and data limitations.

## Phase 2: Real data ingestion

- Add CDC/NNDSS download scripts.
- Join NOAA climate features.
- Add state-level population and rurality features.
- Store processed features in `data/processed/`.

## Phase 3: MLE upgrade

- Add MLflow tracking.
- Add model registry metadata.
- Add scheduled retraining.
- Add drift checks for feature distributions.
- Add Docker Compose with API and database.

## Phase 4: SDE upgrade

- Replace static dashboard with React.
- Add PostgreSQL.
- Add saved scenarios.
- Add state-level map tiles.
- Add auth only if the project becomes multi-user.

