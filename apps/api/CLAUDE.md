# CLAUDE.md (apps/api)

`index.js` reads `PORT` from env (`.env.example` sets it to 4000; the in-code fallback if `PORT` is unset is 6000, so don't assume 6000 anywhere — `.env.local`'s value is what actually runs).

- `index.js` — entrypoint; wires up helmet, CORS (single allowed origin via `CLIENT_ORIGIN`), JSON body parsing, request logging, and two separate rate limiters: one for all of `/api/*` and a stricter one just for `POST /api/bookings`.
- `db.js` — singleton MongoClient/db, with collection accessor functions (`bookingsCollection`, `vehiclesCollection`, `auditLogsCollection`, `notificationsCollection`, `pushTokensCollection`) that throw if called before `connectDb()` has run. Indexes are created once on connect.
- `auth.js` — there's no user table; admin auth is a single shared `ADMIN_PASSWORD` checked in the login route, which then issues a JWT (`role: "admin"`, 30m expiry). `requireAdmin` middleware gates the admin-only routes (booking list/status, push-token registration).
- `validation.js` — zod schemas: `bookingSchema` (includes a honeypot `website` field for spam bots, and normalizes legacy `tripType` values), `statusSchema`, `pushTokenSchema`.
- `mailer.js` — nodemailer wrapper; `sendBookingEmails` is a no-op (`{ skipped: true }`) when SMTP env vars aren't fully set.
- `push.js` — wraps `expo-server-sdk`. `registerPushToken` upserts a device's Expo push token into `push_tokens`. `sendBookingPush` loads every stored token, filters out anything that isn't a valid Expo push token, and sends one push per token carrying the full booking payload in `data.booking` (used by the mobile app to render its details screen without a follow-up API call).
- `responses.js` — shared response envelope: `{ success, data, message }` / `{ success: false, error: { code, message } }`.
- `logger.js` — structured JSON logging (`log(level, message, meta)`) plus `requestLogger` middleware.
- `backup.js` — standalone script (not mounted in the API), shells out to `mongodump`.

**Booking → notification flow**: `POST /api/bookings` validates with `bookingSchema`, generates a `T4D-<base36 timestamp>` reference, inserts into `bookings`, inserts a companion `notifications` record, writes an audit log entry, then fires both `sendBookingEmails` and `sendBookingPush` without awaiting them — neither email nor push failures ever fail the booking response (same fire-and-forget contract for both).

**Admin flow**: `POST /api/auth/login` → JWT (shared by both the CRM-side web usage and the mobile app — there's one admin identity, not per-platform accounts). `GET /api/bookings`, `PATCH /api/bookings/:id/status`, and `POST /api/admin/push-tokens` all require `requireAdmin`.
