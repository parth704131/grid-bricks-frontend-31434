# Frontend Story Analysis

## Intended outcome

Provide a focused React dashboard for January 2026 wind forecast performance using only the deployed FastAPI backend.

## MVP flow

1. Load the full January range with the 10:00 Europe/London cutoff.
2. Show the decision policy, freshness, KPIs, charts, coverage, and detailed periods.
3. Allow valid date and cutoff changes through URL-backed controls.
4. Let a user inspect all forecast versions for a selected half-hour.

## Non-goals

- Purchase-volume recommendations
- Direct Elexon requests
- Authentication, live polling, and administrative controls
- Demand, price, reserve, or other generation analysis

## Verification

- TypeScript strict compilation
- Deterministic Vitest and React Testing Library tests
- Production Vite build
- Manual smoke check against the deployed FastAPI backend after dashboard implementation
