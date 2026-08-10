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

## Deploying

`apps/web` deploys to Vercel (root directory `apps/web`, zero-config Next.js build); `apps/api` deploys to a Render free web service via the root `render.yaml` blueprint (root directory `apps/api`, `npm install` / `npm start`). MongoDB is already cloud-hosted (Atlas, `mongodb+srv://`), so no separate DB hosting is needed — just reuse the existing connection string as a Render env var. Both platforms need their env vars set by hand in their dashboards (Vercel: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; Render: everything listed under `apps/api/.env.local` above) — `render.yaml` deliberately marks them `sync: false` so secrets aren't checked into the blueprint. The one gotcha that will silently break booking submissions if missed: the API's CORS (`apps/api/index.js`) only allows a single origin via `CLIENT_ORIGIN`, so it must be set to the *exact* deployed Vercel URL, not a wildcard or the local dev origin. Render's free tier spins down after ~15 min idle, so the first request after a lull is slow (~30-50s) — acceptable for a client-testing link, not for production traffic.

## Architecture

**Three independent apps, not one.** `apps/web`, `apps/api`, and `apps/mobile` are separate npm workspace packages that run as separate processes and only ever talk to each other over HTTP, via `NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` — there are no Next.js API routes and the mobile app has no direct DB access. See `apps/api/CLAUDE.md`, `apps/web/CLAUDE.md`, and `apps/mobile/CLAUDE.md` for each app's internals. Key cross-cutting flow: submitting the booking form on the web POSTs to the API, which persists the booking and fires an email + push notification (to the mobile app) without blocking the response — see `apps/api/CLAUDE.md` for the exact contract.
