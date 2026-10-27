# Server-side integration boundary

The current site is static and has no backend. Vercel has been selected for hosting, but the backend framework and data path are undecided. This folder reserves a framework-neutral place for future API and server-only integrations; no endpoint is live yet.

Planned responsibilities:

- `routes/` — lead, meeting preference, and authenticated admin API routes
- `middleware/` — schema validation, abuse/rate controls, authentication, and authorization
- `integrations/` — CRM, calendar, email, and SMS provider adapters
- `database/migrations/` — versioned lead and operational data schema changes
- `tests/` — API, authorization, delivery, and failure-path tests

The route names in `../architecture.json` are contracts, not deployed endpoints. Google Sheets is the intended initial lead-management destination and Google Calendar the intended calendar provider; neither is integrated. Keep provider credentials in Vercel environment variables or another secret manager, never in browser code or public static files. Define the backend framework, authoritative storage, retention policy, and access model before implementing these folders.
