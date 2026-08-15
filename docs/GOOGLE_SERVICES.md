# Google Services (single app)

One Android package + one iOS bundle ID (`PACKAGE_NAME` in `app.config.ts`).

Config files live at the **project root** (standard Expo / React Native Firebase layout).

## Automated

```bash
firebase use <project-id>
bun run firebase:sync          # → ./google-services.json + ./GoogleService-Info.plist (gitignored)
bun run firebase:sync:eas      # also uploads GOOGLE_SERVICES_JSON / _PLIST to EAS
```

Update `PACKAGE_NAME` in both `app.config.ts` and `scripts/sync-firebase-native-configs.mjs`.

## Manual

Place at the **repository root**:

```text
./google-services.json
./GoogleService-Info.plist
```

`app.config.ts` uses EAS env paths when set, otherwise these root files:

```ts
android.googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json"
ios.googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist"
```

After SHA fingerprint changes, sync again ([SIGNING.md](./SIGNING.md)).
