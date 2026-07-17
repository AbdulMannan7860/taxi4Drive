# Taxi4Drive / Taxi2Airport

Premium SEO-friendly Next.js website with an Express API for booking records, MongoDB persistence, protected admin access, email triggers, and a companion React Native (Expo) mobile app that gets a push notification for every new booking.

This is an npm-workspaces monorepo:

```
apps/
  web/     Next.js site (the booking form / marketing site)
  api/     Express API (MongoDB, admin auth, email + push notifications)
  mobile/  Expo app (admin push notifications for new bookings)
assets/
  brand/   Logo, brand identity and Figma reference images
```

## Run locally

```bash
npm install
npm run dev
```

Or run each service separately:

```bash
npm run dev:web
npm run dev:api
npm run mobile
```

- Website: http://localhost:3000
- API: http://localhost:4000/api
- CRM password: set `ADMIN_PASSWORD` in `apps/api/.env.local`

## Environment

Each app reads its own `.env.local` (see the matching `.env.example` in each folder).

`apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

`apps/api/.env.local`:

```bash
MONGODB_URI=
MONGODB_DB=data4drive
MONGODB_COLLECTION=bookings
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=
ADMIN_PASSWORD=
```

Email triggers are enabled when SMTP values are present in `apps/api/.env.local`:

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Taxi2Airport <book@taxi2airport.com.au>
ADMIN_EMAIL=book@taxi2airport.com.au
```

If SMTP values are empty, bookings still save to MongoDB and the API logs that email was skipped. Push notifications to the mobile app follow the same never-block-the-booking pattern.

`apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

Push notifications require a real EAS project id — run `npx eas init` inside `apps/mobile` once (needs an Expo account) before push-token registration will work.

## API

- `POST /api/bookings` creates a booking.
- `POST /api/auth/login` returns an admin JWT.
- `GET /api/bookings` lists bookings and requires `Authorization: Bearer <token>`.
- `PATCH /api/bookings/:id/status` updates booking status and requires `Authorization: Bearer <token>`.
- `POST /api/admin/push-tokens` registers a mobile device's Expo push token and requires `Authorization: Bearer <token>`.

The mobile app uses these same protected endpoints.
