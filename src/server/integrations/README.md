# Provider adapters

Implement one server-only adapter per external provider below. Route handlers should call these adapters rather than embedding provider-specific logic. Keep credentials in the deployment secret manager; do not commit them.

- `crm/` — lead creation and status synchronization
- `calendar/` — availability lookup and confirmed booking
- `email/` — lead receipt and follow-up messages
- `sms/` — optional messages, only with the required consent
