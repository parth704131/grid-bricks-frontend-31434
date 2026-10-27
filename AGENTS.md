# Frontend Development Rules

## Git and delivery

- Work on a feature branch; do not commit directly to `main`.
- Do not commit or push unless the user explicitly asks.
- Review `git diff` and `git status` before staging anything.
- Never commit `.env` files, credentials, tokens, or generated build output.

## Safety

- Do not run destructive filesystem or Git commands without explicit authorization.
- Do not delete source files, branches, or worktrees as cleanup by assumption.
- Do not add database credentials, Elexon configuration, or backend secrets to Vite variables.
- Treat API data as untrusted input and validate it before rendering.

## Frontend invariants

- The browser calls FastAPI only; it never calls Elexon directly.
- Forecast selection and accuracy calculations remain backend responsibilities.
- Preserve `null` values for missing data and render them as an em dash.
- Keep display timezone changes separate from API query and business timezone logic.
- Keep loading, empty, partial, stale, and error states distinguishable.
