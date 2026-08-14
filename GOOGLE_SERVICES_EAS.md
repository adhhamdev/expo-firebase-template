# Firebase native config (single app)

This template uses **one** Android package and **one** iOS bundle ID for every build profile:

```text
app.yourapp
```

Change that value in `app.config.ts` (`PACKAGE_NAME`) and in `scripts/sync-firebase-native-configs.mjs` if you rename it.

You only need **one Android app** and **one iOS app** in Firebase Console.

Native files are gitignored. Local path:

```text
google-services/google-services.json
google-services/GoogleService-Info.plist
```

`app.config.ts` reads those files, or EAS sensitive file variables `GOOGLE_SERVICES_JSON` / `GOOGLE_SERVICES_PLIST` when set on the build.

## Download configs

1. Firebase CLI logged in, `.firebaserc` set to your project.
2. Android + iOS apps already created with package/bundle `app.yourapp`.

```bash
bun run firebase:sync
```

## Upload to EAS (optional)

Same files are attached to development, preview, and production EAS environments:

```bash
bun run firebase:sync:eas
```

After changing native config, create a **new build** (OTA cannot change Google Services files).
