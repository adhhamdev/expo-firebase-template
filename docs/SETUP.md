# Setup checklist (scratch → shipping)

## 1. Clone & install

```bash
git clone <your-repo>
cd <your-repo>
bun install
```

## 2. Identity

Edit `app.config.ts` constants: `APP_NAME`, `APP_SLUG`, `APP_SCHEME`, `PACKAGE_NAME`, `EAS_PROJECT_ID`, `EXPO_OWNER`.

Match `PACKAGE_NAME` in `scripts/sync-firebase-native-configs.mjs`.

Match `FUNCTIONS_REGION` in `src/lib/firebase/functions-region.ts` to your Functions region.

## 3. Firebase

```bash
firebase login
firebase use <project-id>   # or edit .firebaserc
cp .env.example .env        # web config from Console
```

Create **one** Android + **one** iOS app with `PACKAGE_NAME`.

```bash
bun run firebase:sync
bun run firebase:sync:eas   # optional
bun run signing:fingerprints
# paste SHA-1/SHA-256 into Firebase Android app, then firebase:sync again
```

Enable Auth providers → [AUTH.md](./AUTH.md).  
App Check → [APP_CHECK.md](./APP_CHECK.md).

## 4. EAS

```bash
eas login
eas init   # paste project id into app.config.ts
```

Set App Check debug token on development/preview only (`eas.json` or EAS env).

## 5. Run

```bash
bun run android   # or ios
# or
bun run build:dev:android && bun run start:dev-client
```

## 6. Backend

```bash
bun run firebase:deploy
```

## Docs index

| Topic | Doc |
|-------|-----|
| Signing / SHA | [SIGNING.md](./SIGNING.md) |
| Google Services | [GOOGLE_SERVICES.md](./GOOGLE_SERVICES.md) |
| Auth / PNV | [AUTH.md](./AUTH.md) |
| App Check / ADI | [APP_CHECK.md](./APP_CHECK.md) |
| Push | [NOTIFICATIONS.md](./NOTIFICATIONS.md) |
| Security | [SECURITY.md](./SECURITY.md) |
