# OpsPilot Android

Compact Android companion app for the OpsPilot Flask platform.

This app is intentionally hybrid:

- Native React Native screens cover daily work: dashboard, tasks, sprints, CRM, vendors, finance, assets, inventory and alerts.
- The in-app portal opens the full responsive OpsPilot web app for advanced features such as reports, settings, users, Shopify, billing, donations and platform administration.

That keeps the Android app feature-complete without duplicating every server workflow in two places.

## Backend

The backend is configured in `config.ts`.

```ts
export const BASE_URL = 'https://opspilot-pqwd.onrender.com/';
```

Change that value if your Render URL or custom domain changes.

## Local Setup

```bash
npm install
npx expo start
```

Run on Android:

```bash
npx expo run:android
```

## Build For Play Store

Install EAS CLI and log in:

```bash
npm install -g eas-cli
eas login
```

Create a signed Android App Bundle:

```bash
eas build --profile production --platform android
```

Submit to Google Play when your Play Console app and service account are ready:

```bash
eas submit --platform android
```

See `PLAY_STORE_SUBMISSION.md` for store listing copy, data safety notes and release checklist.
