@AGENTS.md

## Shipping a change

This app is never published to the Play Store / App Store — it's installed as a single APK on the business owner's phone, kept up to date by `.github/workflows/mobile-release.yml`. There is no manual build/upload step for normal changes.

- **JS/UI change** (styling, screens, copy, bug fixes): push to `main`. The `eas-update` job publishes an over-the-air update automatically; the owner sees it next time they reopen the app — no new APK, no new link.
- **Native/dependency change** (anything touching `package.json`, `app.json`, or `eas.json`): push to `main`. The `eas-build` job detects this automatically, builds a fresh APK via EAS Build, and republishes it to the `mobile-latest` GitHub Release under the same fixed URL as always. You can also trigger this manually from the Actions tab (`workflow_dispatch`) if you need a fresh build without a qualifying file change.
- **First-ever install**: send the owner the `mobile-latest` release asset link once — `https://github.com/AbdulMannan7860/taxi4Drive/releases/download/mobile-latest/taxi2airport-admin.apk`. They never need a different link after that.

One-time setup required before any of this works (not scriptable — needs a human login): create a free expo.dev account, run `eas login` then `eas init` and `eas update:configure` from `apps/mobile` (this writes `extra.eas.projectId` and `updates.url` into `app.json`), then add an Expo access token as the `EXPO_TOKEN` secret on the GitHub repo.

## Architecture

Expo-managed (SDK, no native `ios`/`android` folders checked in). No navigation library — `App.js` is a plain three-state screen switch (`Login` → `Notifications` → `Details`) driven by whether a JWT is held and whether a notification is selected, which is enough for the current scope and avoids pulling in React Navigation for three screens.
- `src/theme.js` — shared `colors`/`fonts` constants (brand navy/gold/night/slate/steel palette, Poppins/Montserrat family names) consumed by `App.js` and all three screens instead of hardcoded hex/system-font strings.
- Fonts (`@expo-google-fonts/poppins`, `@expo-google-fonts/montserrat`) are loaded via `useFonts` in `App.js`, gating render behind `checkingSession`/font-loaded state the same way the JWT session check already did. Icons are `@expo/vector-icons` (Ionicons).
- App icon/splash/adaptive-icon assets under `assets/` are generated (navy `#0b1d33` background + the white `T2A` monogram cropped from `assets/brand/logo-white.png`, see `apps/mobile/assets/brand/`) rather than the Expo scaffold defaults; splash is configured via the `expo-splash-screen` config plugin in `app.json` (SDK 57 has no top-level `splash` key — check current docs before assuming otherwise, per `AGENTS.md`).
- `src/api.js` — thin fetch wrapper mirroring the web app's own fetch-based API calls; `login()` and `registerPushToken()`.
- `src/pushNotifications.js` — `registerForPushNotificationsAsync()`: requests permission, reads the Expo push token via `Notifications.getExpoPushTokenAsync({ projectId })` (the `projectId` comes from `Constants.expoConfig.extra.eas.projectId`, which only exists after `eas init` has been run — see the "One-time setup" note above). Throws (not silently fails) if the permission is denied, run on a simulator, or the project id is missing, and `App.js` surfaces that as a visible warning banner rather than swallowing it.
- `App.js` — persists the admin JWT via `expo-secure-store` so the session survives app restarts; on login, registers for push and calls `registerPushToken`; `Notifications.addNotificationReceivedListener` appends incoming pushes (parsed from `data.booking`) to an in-memory list for the Notifications screen, `addNotificationResponseReceivedListener` handles a tapped notification by opening the Details screen directly from the push's own payload (no extra API round-trip).
- See `AGENTS.md` before touching `expo-notifications` code — it flags that the API shape changes across SDK versions.
