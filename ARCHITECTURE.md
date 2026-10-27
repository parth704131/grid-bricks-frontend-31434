# Frontend Architecture

## Runtime flow

The browser reads applied delivery dates and decision time from the URL, requests normalized analysis data from FastAPI through TanStack Query, and renders the returned series without recalculating forecast eligibility or replacing missing values.

The forecast-version request is made only when a user opens the audit drawer for a half-hour. Display timezone is a presentation preference and never changes the API request timezone, which remains `Europe/London`.

## Boundaries

- `src/api`: shared HTTP client, endpoint functions, and response validation
- `src/types`: explicit API and UI types
- `src/hooks`: query and URL-state orchestration
- `src/utils`: formatting, time, validation, and data transformations
- `src/components`: focused presentation components
- `src/pages`: page composition

## Engineering invariants

- API data is never fetched directly from Elexon.
- Missing numeric values stay `null` and render as an em dash.
- Forecast selection and metric calculations remain backend responsibilities.
- Obsolete analysis requests are cancelled or ignored before replacing current data.
- Loading, empty, partial, stale, and failed states remain distinct.
- No database credentials or other secrets are exposed in Vite environment variables.
- Historical responses use a one-hour client stale time and no polling.
