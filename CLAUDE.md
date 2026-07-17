# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Taxi2Airport (formerly Taxi4Drive — the site/app-facing brand was renamed and re-skinned to match the client's real identity; internal package names and the git repo/folder are still `taxi4drive`/`@taxi4drive/*` for historical reasons, see Commands) — an npm-workspaces monorepo: a Next.js (App Router) marketing + booking site, a separate Express API for booking persistence (MongoDB), admin auth, and email notifications, and a React Native (Expo) mobile app that gets a push notification with the booking details the moment someone submits the web form.

```
assets/
  brand/   logo.jpeg (source), brand-identity.jpeg, figma-reference.jpeg (reference sheets) — plus generated logo.png/logo.webp (transparent, full-color) and logo-white.png (monochrome, for dark backgrounds), produced by a one-off Pillow background-removal script. These generated files are wired in: apps/web/public/brand/ (header/footer) and apps/mobile/assets/brand/ (login/notifications screens, app icon/splash source). Re-run the extraction script if logo.jpeg is ever replaced with a new source file.
```

## Commands

Run from the repo root (npm workspaces) — see the root `package.json` `scripts` for the full list. One non-obvious gotcha: `npm run backup` shells out to `mongodump`, which requires MongoDB Database Tools on `PATH` and `MONGODB_URI` set.

Equivalent per-workspace form: `npm run <script> -w @taxi4drive/web`, `-w @taxi4drive/api`, `-w @taxi4drive/mobile`. There is no test suite/framework configured in this repo.

Each app reads its own `.env.local` (see the matching `.env.example` in each folder) — this was deliberately split out of a single root `.env.local` when the repo became a monorepo, since Next.js only auto-loads env files from its own app root and the API's `require("dotenv").config({ path: ".env.local" })` is cwd-relative (which `npm run <script> -w <workspace>` correctly sets to that workspace's directory).

- `apps/web/.env.local`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- `apps/api/.env.local`: `MONGODB_URI`, `MONGODB_DB`, `MONGODB_COLLECTION`, `PORT`, `CLIENT_ORIGIN`, `JWT_SECRET`, `ADMIN_PASSWORD`, plus optional SMTP vars (booking emails are silently skipped, not an error, when SMTP vars are absent) and rate-limit overrides.
- `apps/mobile/.env`: `EXPO_PUBLIC_API_URL`. Expo push notifications additionally require a real EAS project id — run `npx eas init` inside `apps/mobile` once (needs an Expo account login); until that's done, push-token registration fails with a clear error rather than silently doing nothing.

## Architecture

**Three independent apps, not one.** `apps/web`, `apps/api`, and `apps/mobile` are separate npm workspace packages that run as separate processes and only ever talk to each other over HTTP, via `NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` — there are no Next.js API routes and the mobile app has no direct DB access. `apps/api/index.js` reads `PORT` from env (`.env.example` sets it to 4000; the in-code fallback if `PORT` is unset is 6000, so don't assume 6000 anywhere — `.env.local`'s value is what actually runs).

**API (`apps/api/`)**
- `index.js` — entrypoint; wires up helmet, CORS (single allowed origin via `CLIENT_ORIGIN`), JSON body parsing, request logging, and two separate rate limiters: one for all of `/api/*` and a stricter one just for `POST /api/bookings`.
- `db.js` — singleton MongoClient/db, with collection accessor functions (`bookingsCollection`, `vehiclesCollection`, `auditLogsCollection`, `notificationsCollection`, `pushTokensCollection`) that throw if called before `connectDb()` has run. Indexes are created once on connect.
- `auth.js` — there's no user table; admin auth is a single shared `ADMIN_PASSWORD` checked in the login route, which then issues a JWT (`role: "admin"`, 12h expiry). `requireAdmin` middleware gates the admin-only routes (booking list/status, push-token registration).
- `validation.js` — zod schemas: `bookingSchema` (includes a honeypot `website` field for spam bots, and normalizes legacy `tripType` values), `statusSchema`, `pushTokenSchema`.
- `mailer.js` — nodemailer wrapper; `sendBookingEmails` is a no-op (`{ skipped: true }`) when SMTP env vars aren't fully set.
- `push.js` — wraps `expo-server-sdk`. `registerPushToken` upserts a device's Expo push token into `push_tokens`. `sendBookingPush` loads every stored token, filters out anything that isn't a valid Expo push token, and sends one push per token carrying the full booking payload in `data.booking` (used by the mobile app to render its details screen without a follow-up API call).
- `responses.js` — shared response envelope: `{ success, data, message }` / `{ success: false, error: { code, message } }`.
- `logger.js` — structured JSON logging (`log(level, message, meta)`) plus `requestLogger` middleware.
- `backup.js` — standalone script (not mounted in the API), shells out to `mongodump`.

**Booking → notification flow**: `POST /api/bookings` validates with `bookingSchema`, generates a `T4D-<base36 timestamp>` reference, inserts into `bookings`, inserts a companion `notifications` record, writes an audit log entry, then fires both `sendBookingEmails` and `sendBookingPush` without awaiting them — neither email nor push failures ever fail the booking response (same fire-and-forget contract for both).

**Admin flow**: `POST /api/auth/login` → JWT (shared by both the CRM-side web usage and the mobile app — there's one admin identity, not per-platform accounts). `GET /api/bookings`, `PATCH /api/bookings/:id/status`, and `POST /api/admin/push-tokens` all require `requireAdmin`.

**Web (`apps/web/`)**: Effectively a single page — `app/page.jsx` is one large client component holding the entire marketing site and booking form (no additional routes). Fare shown to the user is computed client-side in `estimateFare()` in that file using vehicle/passenger/luggage heuristics; it's a display estimate only, not authoritative pricing. `app/components/LocationField.jsx` + `LocationPicker.jsx` wrap Google Places Autocomplete, lazy-loaded through `lib/loadGoogleMaps.js`. SEO (metadata, OpenGraph, Twitter card, `schema.org` `TaxiService` JSON-LD) lives in `app/layout.jsx`; `app/sitemap.js`/`app/robots.js` are Next's dynamic sitemap/robots conventions. Tailwind (`tailwind.config.js`) defines the site's named color tokens matching the Taxi2Airport brand sheet exactly (`navy` #0b1d33, `gold` #ffc107, `slate` #60666d, `mist` #f1f3f6, `night` #071426 for the deepest/near-black sections) plus a few pre-existing neutrals (`ink`, `steel`, `line`, etc.) — reuse these instead of raw hex values (the mobile app's `src/theme.js` mirrors the same `night`/`navy`/`gold` values for visual consistency). Dark sections (hero, services, contact, footer) use `night` as the section background with `navy` for card-level surfaces on top of it; icons follow a simple rule — `gold` on dark backgrounds, `navy` on light ones. The fleet section's per-vehicle photos (`.fleet-card-photo`) are placeholder boxes (icon + "Photo coming soon" tag), not real photos — swap in real liveried-vehicle photography per vehicle when available; the testimonials section content is likewise a structural placeholder (generic initials, no fabricated names/photos) pending real reviews.

**Mobile (`apps/mobile/`)**: Expo-managed (SDK, no native `ios`/`android` folders checked in). No navigation library — `App.js` is a plain three-state screen switch (`Login` → `Notifications` → `Details`) driven by whether a JWT is held and whether a notification is selected, which is enough for the current scope and avoids pulling in React Navigation for three screens.
- `src/theme.js` — shared `colors`/`fonts` constants (brand navy/gold/night/slate/steel palette, Poppins/Montserrat family names) consumed by `App.js` and all three screens instead of hardcoded hex/system-font strings.
- Fonts (`@expo-google-fonts/poppins`, `@expo-google-fonts/montserrat`) are loaded via `useFonts` in `App.js`, gating render behind `checkingSession`/font-loaded state the same way the JWT session check already did. Icons are `@expo/vector-icons` (Ionicons).
- App icon/splash/adaptive-icon assets under `assets/` are generated (navy `#0b1d33` background + the white `T2A` monogram cropped from `assets/brand/logo-white.png`, see `apps/mobile/assets/brand/`) rather than the Expo scaffold defaults; splash is configured via the `expo-splash-screen` config plugin in `app.json` (SDK 57 has no top-level `splash` key — check current docs before assuming otherwise, per the note below).
- `src/api.js` — thin fetch wrapper mirroring the web app's own fetch-based API calls; `login()` and `registerPushToken()`.
- `src/pushNotifications.js` — `registerForPushNotificationsAsync()`: requests permission, reads the Expo push token via `Notifications.getExpoPushTokenAsync({ projectId })` (the `projectId` comes from `Constants.expoConfig.extra.eas.projectId`, which only exists after `eas init` has been run — see Commands above). Throws (not silently fails) if the permission is denied, run on a simulator, or the project id is missing, and `App.js` surfaces that as a visible warning banner rather than swallowing it.
- `App.js` — persists the admin JWT via `expo-secure-store` so the session survives app restarts; on login, registers for push and calls `registerPushToken`; `Notifications.addNotificationReceivedListener` appends incoming pushes (parsed from `data.booking`) to an in-memory list for the Notifications screen, `addNotificationResponseReceivedListener` handles a tapped notification by opening the Details screen directly from the push's own payload (no extra API round-trip).
- See `apps/mobile/AGENTS.md` before touching `expo-notifications` code — it flags that the API shape changes across SDK versions.
