# Wind Procurement Insight Frontend

React dashboard for the UK day-ahead wind forecast analysis. The frontend consumes the deployed FastAPI backend; it never calls Elexon directly.

## Stack

- React and TypeScript with strict mode
- Vite
- TanStack Query for server state
- Recharts for analytical charts
- date-fns/date-fns-tz and `Intl` for display formatting
- Vitest and React Testing Library
- Docker and Vercel

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173`. Set `VITE_API_BASE_URL` to the FastAPI URL in `.env`.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker build -t grid-bricks-frontend .
docker run --rm -p 5173:5173 --env VITE_API_BASE_URL=http://localhost:8000 grid-bricks-frontend
```

The repository-level Docker Compose integration will be added when the frontend dashboard is connected to the backend service.

## Deployment

Deploy this repository as a separate Vercel project with the project root set to the repository root. Configure `VITE_API_BASE_URL` to the production FastAPI URL and add the deployed frontend origin to the backend `FRONTEND_ORIGIN` setting.

## Scope

The dashboard supports January 2026, a configurable 10:00 Europe/London decision cutoff, forecast-versus-actual analysis, error interpretation, coverage visibility, and forecast-version auditability. It does not recommend a final electricity purchase quantity.

AI-tool usage is disclosed in the repository documentation as development proceeds.
