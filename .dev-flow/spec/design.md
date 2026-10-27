# Frontend Foundation Design

- Vite serves the React application locally and produces the static Vercel build.
- TanStack Query owns server-state caching with a one-hour historical-data stale time and no polling.
- API, types, hooks, utilities, and presentation components remain separate as the dashboard grows.
- `VITE_API_BASE_URL` is the only frontend runtime configuration and contains no secrets.
- Vercel rewrites all paths to `index.html` for SPA refresh support.

## Engineering invariants

- Missing values remain nullable from API response through rendering.
- The frontend does not recreate forecast-selection or metric logic.
- Obsolete requests must not replace newer filter results.
- Drawer failures must not break the main dashboard.
