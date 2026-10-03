# CampusEats Web (React + Vite)

Frontend for the CampusEats application (SE3090 Lab 11).

## Run locally
```
npm install
npm run dev
```

## Production build
```
npm run build      # outputs the production site to dist/
npm run preview    # serve dist/ locally
```

## Environment variables
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL of the backend API (no trailing slash). Baked in at build time, so redeploy after changing it. |
