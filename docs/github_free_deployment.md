# Free Deployment with GitHub

There are two realistic ways to publish this project for free or nearly free.

## Important limitation

GitHub Pages can only host static files: HTML, CSS, JavaScript, images, and documents.

This project currently uses a Python FastAPI backend for:

- `/predict`
- `/metadata`
- `/states`
- model loading
- API validation

That means GitHub Pages alone cannot run the full current app.

## Recommended route: GitHub + Render

Use GitHub to store the code, and Render to run the Python/FastAPI backend.

This keeps the current project structure intact and gives you a public URL such as:

```text
https://hantavirus-risk.onrender.com
```

No custom domain is required.

### Step 1: Create a GitHub repository

1. Create or log in to a GitHub account.
2. Click `New repository`.
3. Name it something like:

```text
hantavirus-risk-portfolio
```

4. Keep it public if you want recruiters to see the source code.
5. Do not add a README from GitHub because this project already has one.

### Step 2: Push this project to GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Build hantavirus risk portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hantavirus-risk-portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy on Render

1. Go to https://render.com.
2. Sign up using GitHub.
3. Click `New +`.
4. Choose `Web Service`.
5. Select your GitHub repository.
6. Use these settings:

```text
Runtime: Python
Build command: pip install -r requirements.txt && pip install -e . && python -m hantavirus_risk.train
Start command: uvicorn hantavirus_risk.api:app --host 0.0.0.0 --port $PORT
```

7. Choose the free plan if available.
8. Click deploy.

Render will give you a public URL.

## Alternative route: GitHub Pages only

Use this only if you want a purely static portfolio site.

Pros:

- Free
- Simple
- Hosted directly by GitHub
- URL looks like `https://YOUR_USERNAME.github.io/hantavirus-risk-portfolio/`

Cons:

- No Python backend
- No FastAPI
- No real server-side model inference
- The predictor must be rewritten to run entirely in browser JavaScript, or the prediction results must be precomputed

For this project, GitHub Pages only is less impressive for MLE because it removes model serving.

## Best recommendation

For your goal, use:

```text
GitHub repo + Render web service
```

This is still free or low-cost, gives you a public URL, and preserves the strongest MLE/SDE parts of the project:

- FastAPI backend
- model serving
- Python ML pipeline
- interactive website
- public code portfolio

