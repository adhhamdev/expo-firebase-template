# Google Services (single app)

One Android package + one iOS bundle ID (`PACKAGE_NAME` in `app.config.ts`).

## Automated

```bash
firebase use <project-id>
bun run firebase:sync          # → google-services/ (gitignored)
bun run firebase:sync:eas      # also uploads GOOGLE_SERVICES_JSON / _PLIST to EAS
```

Update `PACKAGE_NAME` in both `app.config.ts` and `scripts/sync-firebase-native-configs.mjs`.

## Manual

Place:

```text
google-services/google-services.json
google-services/GoogleService-Info.plist
```

`app.config.ts` uses EAS env paths when set, otherwise these local files.

After SHA fingerprint changes, sync again ([SIGNING.md](./SIGNING.md)).
