# Google Services

One Android + one iOS Firebase app. Files are **gitignored**.

```text
google-services.json
GoogleService-Info.plist
```

## Automated (recommended)

```bash
bun run firebase:sync
bun run firebase:sync:eas   # optional: upload to EAS
```

See [GOOGLE_SERVICES_EAS.md](../GOOGLE_SERVICES_EAS.md).

## Manual

1. Firebase Console → Project settings → Your apps.
2. Add **Android** with package `app.yourapp` (or your `PACKAGE_NAME`).
3. Add **iOS** with the same bundle ID.
4. Download configs into this folder with the names above.
