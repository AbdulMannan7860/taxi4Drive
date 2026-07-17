@AGENTS.md

## Shipping a change

This app is never published to the Play Store / App Store — it's installed as a single APK on the business owner's phone, kept up to date by `.github/workflows/mobile-release.yml`. There is no manual build/upload step for normal changes.

- **JS/UI change** (styling, screens, copy, bug fixes): push to `main`. The `eas-update` job publishes an over-the-air update automatically; the owner sees it next time they reopen the app — no new APK, no new link.
- **Native/dependency change** (anything touching `package.json`, `app.json`, or `eas.json`): push to `main`. The `eas-build` job detects this automatically, builds a fresh APK via EAS Build, and republishes it to the `mobile-latest` GitHub Release under the same fixed URL as always. You can also trigger this manually from the Actions tab (`workflow_dispatch`) if you need a fresh build without a qualifying file change.
- **First-ever install**: send the owner the `mobile-latest` release asset link once — `https://github.com/AbdulMannan7860/taxi4Drive/releases/download/mobile-latest/taxi2airport-admin.apk`. They never need a different link after that.

One-time setup required before any of this works (not scriptable — needs a human login): create a free expo.dev account, run `eas login` then `eas init` and `eas update:configure` from `apps/mobile` (this writes `extra.eas.projectId` and `updates.url` into `app.json`), then add an Expo access token as the `EXPO_TOKEN` secret on the GitHub repo.
