# Google Services (native Firebase config)

React Native Firebase reads these files at build time. Files here are **gitignored**; keep local copies for `expo run:*` only.

## Automated sync (preferred)

After Android/iOS apps exist in Firebase Console with bundle IDs matching `app.config.ts`:

```bash
# Download into google-services/
bun run firebase:sync

# Also upload GOOGLE_SERVICES_JSON / GOOGLE_SERVICES_PLIST to each EAS environment
bun run firebase:sync:eas
```

Details: [GOOGLE_SERVICES_EAS.md](../GOOGLE_SERVICES_EAS.md).

Update package/bundle IDs in `scripts/sync-firebase-native-configs.mjs` if you changed placeholders in `app.config.ts`.

## Manual setup

1. Firebase Console → Project settings → Your apps.
2. Add **Android** / **iOS** apps for `app.yourapp.dev`, `.preview`, and production.
3. Download configs into this folder:

| Environment   | Android                              | iOS                                         |
|---------------|--------------------------------------|---------------------------------------------|
| development   | `google-services.dev.json`           | `GoogleService-Info.dev.plist`              |
| preview       | `google-services.preview.json`       | `GoogleService-Info.preview.plist`          |
| production    | `google-services.json`               | `GoogleService-Info.plist`                  |

`app.config.ts` selects the file from `EXPO_PUBLIC_APP_ENV`, or from EAS env vars `GOOGLE_SERVICES_JSON` / `GOOGLE_SERVICES_PLIST` when set.

Do **not** commit production secrets if the repo is public; use EAS sensitive file variables instead.
