FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt pyproject.toml ./
COPY src ./src
COPY app ./app
COPY data ./data

RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir -e .

RUN python -m hantavirus_risk.train

EXPOSE 8000

CMD ["uvicorn", "hantavirus_risk.api:app", "--host", "0.0.0.0", "--port", "8000"]
