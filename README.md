# Taxi4Drive / Taxi2Airport

Premium SEO-friendly Next.js website with an Express API for booking records, MongoDB persistence, protected admin access, and email triggers.

## Run locally

```bash
npm install
npm run dev
```

Or run each service separately:

```bash
npm run dev:web
npm run dev:api
```

- Website: http://localhost:3000
- API: http://localhost:4000/api
- CRM password: set `ADMIN_PASSWORD` in `.env.local`

## Environment

The app reads `.env.local`.

Required:

```bash
MONGODB_URI=
MONGODB_DB=data4drive
MONGODB_COLLECTION=bookings
NEXT_PUBLIC_API_URL=http://localhost:4000/api
JWT_SECRET=
ADMIN_PASSWORD=
```

Email triggers are enabled when SMTP values are present:

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Taxi2Airport <book@taxi2airport.com.au>
ADMIN_EMAIL=book@taxi2airport.com.au
```

If SMTP values are empty, bookings still save to MongoDB and the API logs that email was skipped.

## API for React Native

- `POST /api/bookings` creates a booking.
- `POST /api/auth/login` returns an admin JWT.
- `GET /api/bookings` lists bookings and requires `Authorization: Bearer <token>`.
- `PATCH /api/bookings/:id/status` updates booking status and requires `Authorization: Bearer <token>`.

The native app can use the same protected endpoints later.
