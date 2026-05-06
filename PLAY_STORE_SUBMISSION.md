# Google Play Store Submission File

Use this as the working checklist and store-copy source when publishing OpsPilot Android.

## App Identity

- App name: OpsPilot
- Package name: `com.opspilot.nativeapp`
- Category: Business
- Content rating: Everyone
- Pricing: Free
- Distribution: Start with Internal testing, then Closed testing, then Production.

## Short Description

Compact operations workspace for tasks, CRM, inventory, invoices, renewals, sales and alerts.

## Full Description

OpsPilot helps small teams manage daily operations from Android. Track tasks and sprints, manage CRM contacts and vendors, monitor inventory, review invoices, renewals and sales, and keep up with operational alerts.

The Android app includes fast native views for common workflows and an integrated secure workspace portal for advanced features such as reports, settings, Shopify sync, billing, donations and platform administration.

Key features:

- Dashboard for open tasks, overdue invoices, upcoming renewals and low stock
- Task, sprint, CRM, vendor, asset, inventory, invoice, renewal and sales modules
- Alerts and notification read tracking
- Secure sign-in using the OpsPilot backend API
- Full workspace portal for admin, reports, Shopify and billing
- Tenant-scoped data access through the OpsPilot server

## Data Safety Notes

Declare only what your deployed OpsPilot backend actually collects. Current app behavior:

- Login credentials are sent to your OpsPilot backend over HTTPS.
- The Android app stores the API token in Expo SecureStore on the device.
- Business records entered in the app are sent to your OpsPilot backend.
- The app does not sell user data.
- The app does not use advertising SDKs.
- The app does not request location, camera, microphone or contacts permissions.

Suggested Play Console data types:

- Personal info: email address, if your user accounts store email.
- App activity: app interactions, if your server audit logs are enabled.
- App info and performance: crash logs only if you later add crash reporting.
- Financial info: only if you collect payment details through hosted payment providers. Do not store raw card numbers in OpsPilot.

## Privacy Policy

You need a public privacy policy URL before production release. Minimum sections:

- What data OpsPilot stores
- Why the data is used
- Who operates the backend
- How users can request deletion
- Security controls such as HTTPS, password hashing and tenant isolation
- Contact email

Example URL placeholder:

```text
https://yourdomain.com/privacy
```

## Release Checklist

- Confirm `config.ts` points at the production HTTPS backend.
- Confirm Render/Supabase production environment variables are set.
- Confirm `/health` and `/api/auth/login` work on production.
- Create a Play App Signing key in Google Play Console.
- Run `npm install`.
- Run `npx tsc --noEmit`.
- Run `npx expo-doctor`.
- Build AAB: `eas build --profile production --platform android`.
- Upload or submit the AAB to Internal testing first.
- Test login, dashboard refresh, create task, create invoice, mark invoice paid, open full workspace, open Shopify, open billing and log out.
- Promote gradually after testing.

## Screenshots To Capture

- Login screen
- Dashboard
- Tasks list
- Finance invoices screen
- More screen with full workspace links
- Full workspace portal showing Settings or Reports

## Support Contact

Use a monitored email, for example:

```text
support@yourdomain.com
```
