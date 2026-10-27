# Front-end integration points

The existing page behavior remains in `../script.js`. New browser-side features should be added as small modules under `services/` and connected from a single module entry point only when the project adopts module loading/build tooling.

Planned service boundaries:

- `lead-service.js` — submit/receive lead requests using the `/api/leads` contract
- `booking-service.js` — Google Calendar availability and booking contract, using `Asia/Manila`
- `validation.js` — shared client-side field validation; the server must validate again
- `spam-protection.js` — browser integration for a server-verified anti-abuse mechanism
- `analytics.js` — consent-aware event interface; never send form contents or PII
- `experiments.js` — deterministic experiment assignment and exposure/conversion events

Do not put API secrets, CRM credentials, email/SMS keys, or privileged admin logic in browser JavaScript. Keep the existing `script.js` as the active entry point until module wiring is implemented and tested.

The planned lead form fields are first name, last name, email, and message. The currently active form has not been migrated to this contract yet.
