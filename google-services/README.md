# Google Services (native Firebase config)

React Native Firebase reads these files at build time.

## Setup

1. Firebase Console → Project settings → Your apps.
2. Add **Android** app with package `app.yourapp.dev` (and preview/prod variants).
3. Add **iOS** app with matching bundle IDs.
4. Download:
   - `google-services.json` → place as:
     - `google-services/google-services.json` (or per-env copies)
   - `GoogleService-Info.plist` → place as:
     - `google-services/GoogleService-Info.dev.plist`
     - `google-services/GoogleService-Info.preview.plist`
     - `google-services/GoogleService-Info.plist` (production)

`app.config.ts` selects the file based on `EXPO_PUBLIC_APP_ENV`.

For EAS, you can also set secrets:

```bash
eas secret:create --name GOOGLE_SERVICES_JSON --type file --value ./path/to/google-services.json
eas secret:create --name GOOGLE_SERVICES_PLIST --type file --value ./path/to/GoogleService-Info.plist
```

Do **not** commit production secrets if the repo is public; use EAS secrets instead.
