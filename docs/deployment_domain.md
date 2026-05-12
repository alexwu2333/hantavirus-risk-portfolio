# Deployment and Custom Domain

The current app runs locally at `http://127.0.0.1:8000`. That address only works on the local machine.

To make the site public at a domain such as `https://yanzhongwuproject.com`, use this path:

## Do I need GitHub?

GitHub is not mandatory. It is recommended because it gives you:

- a public project portfolio link
- version history
- easier Render/Railway deployment
- automatic redeploys after each code update

You can still publish without GitHub by using a platform CLI, Docker image, or manual upload, but GitHub makes the workflow cleaner for a portfolio project.

## Where to buy a domain

Good options:

- Cloudflare Registrar: low-friction DNS, SSL, and at-cost domain registration. Cloudflare domains use Cloudflare nameservers. https://www.cloudflare.com/products/registrar/
- Namecheap: beginner-friendly domain search and checkout. https://www.namecheap.com/domains/domain-name-search/
- Squarespace Domains: simple domain registration and account management. https://support.squarespace.com/hc/en-us/articles/205812318-Registering-Squarespace-domains
- Railway Domains: useful if you also deploy the app on Railway. https://docs.railway.com/networking/domains/railway-domains

Search for `yanzhongwuproject.com`, `yanzhongwu.dev`, or `ml-yanzhongwu.com` on one of these services. If the exact `.com` is unavailable, try `.dev`, `.io`, `.app`, or a shorter personal domain.

## Recommended simple deployment

1. Buy a domain.
2. Create a GitHub repository for this project if you want automatic deploys.
3. Deploy the FastAPI app to Render, Railway, Fly.io, or Google Cloud Run.
4. Set the start command:

```bash
uvicorn hantavirus_risk.api:app --host 0.0.0.0 --port $PORT
```

5. Add the custom domain in the hosting platform.
6. Update DNS records at the domain registrar.
7. Enable HTTPS.

## Why not GitHub Pages only?

GitHub Pages can host static HTML, CSS, and JavaScript, but this project needs a Python backend for `/predict`, `/metadata`, and `/states`. Use a backend hosting platform unless the model is rewritten to run entirely in the browser.

## Suggested public URL

Good options:

- `https://yanzhongwuproject.com`
- `https://yanzhongwu.dev`
- `https://ml.yanzhongwu.com`
- `https://portfolio.yanzhongwu.com`
