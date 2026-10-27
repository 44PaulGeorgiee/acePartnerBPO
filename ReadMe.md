# AcePartners BPO — Project Guide

## Current project

This repository contains a static marketing site for AcePartners BPO. The active site is in `src/`; deploy `src/` as the Vercel project root so its relative CSS and JavaScript links continue to resolve.

- [Landing page](src/index.html) — current page markup and content
- [Styles](src/styles.css) — custom styles
- [Front-end behavior](src/script.js) — calculator, pod configurator, modal, and current lead/meeting interactions
- [Architecture map](src/architecture.json) — planned routes, integration boundaries, and confirmed decisions
- [Data placeholders](src/data/) — structured content that must be populated only with approved, verified material
- [Asset upload locations](src/assets/README.md) — where approved public media and documents belong

The folders and files for future integrations are scaffolding, not deployed features. Uploading content or adding a provider name does not implement an API integration. Keep credentials and lead records out of public static files.

## Confirmed decisions so far

| Topic | Current answer | Notes |
|---|---|---|
| Hosting | Vercel | Backend framework is still undecided. |
| Lead management | Google Sheets | Treat as the initial CRM destination, not as a public database. Access should be restricted. |
| Calendar | Google Calendar | The booking workflow and authorized calendar integration are not implemented yet. |
| Display timezone | Manila time (`Asia/Manila`, UTC+8) | Use this timezone consistently in labels, availability, and submitted timestamps. |
| Booking behavior | Not decided | Decide whether users request a preferred time or reserve a confirmed slot. |
| Successful submission | On-site confirmation and email | Email provider, content, and delivery implementation remain undecided. |
| Required lead fields | First name, last name, email, message | The current form has not yet been changed to this field set. |
| Target audiences | Healthcare service providers and general small-to-medium businesses | Keep the site clear about which services apply to which audience. Avoid soliciting patient or other sensitive information in the lead form. |
| Dashboard owner | You, initially | Authentication and secure access requirements still need to be decided before exposing a dashboard. |

## Remaining questions

These are not yet decisions and should not be represented as implemented functionality:

- Backend framework, lead storage strategy, and Vercel deployment design
- Booking horizon, operating hours, availability source, and reserve-vs-preference behavior
- Case study and testimonial content and publication approvals
- Legal jurisdictions, privacy/terms copy, and reviewer
- Pricing, packages, inclusions, and calculator assumptions
- Analytics provider, tracked events, and consent approach
- Spam protection provider and submission limits
- Email provider and message content
- Phone validation countries and whether a work email is required
- SMS provider, content, and consent requirements
- SEO markets, search terms, and canonical domain
- A/B test variants and success metric
- Dashboard data, authentication, and access controls

## Five core adjustments to decide next

These decisions unblock the most implementation work. Answer these before asking for the full feature build.

1. **Choose the Vercel backend and data path.** Decide whether to use Vercel Functions or another supported backend, where authoritative lead records live, and how the function writes to Google Sheets. Confirm who owns the Google account/service credentials and how access and backups are restricted. Never put Sheets credentials in browser JavaScript.
2. **Define the lead contract and privacy boundary.** Confirm the exact fields (first name, last name, email, message), whether company/phone are excluded, retention/deletion rules, privacy notice owner, and whether healthcare prospects must be explicitly told not to submit patient or health information. Decide the server-side validation and error behavior.
3. **Set booking rules for Google Calendar.** Decide whether the visitor requests a preference or books a real slot; define appointment length, booking horizon, available days/hours, cancellation/reschedule rules, and the calendar/account that owns availability. Keep all displayed and stored times in `Asia/Manila` with unambiguous timezone handling.
4. **Select the email confirmation method.** Choose an email provider and sender domain, approve the user confirmation and internal notification content, and decide what happens if email delivery fails after the lead is stored. The on-site thank-you should only indicate success once the lead API has accepted the request.
5. **Approve launch trust, security, and conversion requirements.** Identify the legal reviewer/jurisdictions, publishable proof and claims, spam controls, analytics/consent policy, and dashboard authentication. Decide the initial success metrics for qualified leads and completed bookings before adding A/B tests.

## Planned feature map (20 improvements)

| # | Improvement | Current planning status |
|---:|---|---|
| 1 | Fix meeting time-slot flow | Known bug should be fixed and covered by tests. |
| 2 | Connect a secure lead endpoint | Vercel hosting chosen; backend framework and endpoint not chosen or live. |
| 3 | Add form validation and error states | Required fields selected; implementation pending. |
| 4 | Add thank-you confirmation | On-site confirmation and email selected; email provider pending. |
| 5 | Add case studies | Content and publication approval not decided. |
| 6 | Add privacy and legal pages | Jurisdictions and legal reviewer not decided. |
| 7 | Add testimonials | Approved quotes and attributions not decided. |
| 8 | Add pricing and assumptions | Not decided. |
| 9 | Add analytics | Provider, events, and consent not decided. |
| 10 | Add CRM lead tracking | Google Sheets selected; schema and secure integration pending. |
| 11 | Add spam protection and rate limits | Provider and limits not decided. |
| 12 | Add calendar integration | Google Calendar selected; booking rules and authorization pending. |
| 13 | Add “How it works” page | Verified process and timelines not decided. |
| 14 | Strengthen trust signals | Only verified, approved claims should be published; evidence pending. |
| 15 | Add service packages | Scope and pricing not decided. |
| 16 | Add FAQ structured data and SEO | Audience selected; keywords, domain, and content details pending. |
| 17 | Validate email and phone | Required email selected; country/phone rules and work-email policy not decided. |
| 18 | Add post-submit email/SMS | Email confirmation selected; provider/content pending. SMS remains undecided. |
| 19 | Add funnel A/B testing | Variants and success metric not decided. |
| 20 | Add lead dashboard | Initial owner is you; authentication and permissions still required. |

## Existing implementation risks

- The lead endpoint in [script.js](src/script.js) is currently blank; form submission cannot deliver leads until a secure server endpoint is configured.
- The meeting time-selection handler references an undefined `container`; fix and test this before offering time selection.
- The active form still uses the old field structure; update it to first name, last name, email, and message when implementing the lead contract.
- The site has no live CRM, booking, email, spam-protection, analytics, or dashboard integration.
- Pricing and timeline content is illustrative. Publish only verified claims and clearly state assumptions.
- The project has no defined automated test runner yet. The future test plan is documented in [src/tests/README.md](src/tests/README.md).

## Suggested implementation order

1. Decide and document the backend/data flow and privacy boundary.
2. Define and implement the lead API, validation, Google Sheets write, and failure handling.
3. Add the on-site success state and email confirmation.
4. Fix and specify actual Google Calendar booking behavior in `Asia/Manila`.
5. Add security controls, legal/trust content, automated tests, then analytics and experiments.

## Deployment and security notes

- Set the Vercel project root to `src/` unless the deployment structure is deliberately changed.
- Keep secrets in Vercel environment variables or a managed secret store, never in `src/`.
- Validate every lead on the server; browser validation is only a usability aid.
- Restrict Google Sheets and Calendar permissions to the minimum needed.
- Do not collect patient, health, or other sensitive personal information in the public lead form.
- Protect any lead dashboard with server-side authentication and authorization; hiding a page is not access control.
- Have appropriate legal/privacy terms reviewed before accepting real customer information.
