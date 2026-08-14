# Security baseline

## Secrets

| Secret | Where |
|--------|--------|
| Firebase web config | `.env` (gitignored) / EAS env |
| `google-services.json` / `GoogleService-Info.plist` | Local `google-services/` (gitignored) or EAS **file** env `GOOGLE_SERVICES_*` |
| App Check debug token | `.env` / EAS **development & preview only** — never production |
| Keystores / certs | EAS credentials — never git |
| Service account keys | Firebase / Play CI only — never client |

## Client rules of thumb

- Treat all `EXPO_PUBLIC_*` values as **public** (shipped in the binary).
- Enforce auth in **Firestore / Storage rules** and Cloud Functions — not only in the UI.
- Enable **App Check** providers before turning on enforcement ([APP_CHECK.md](./APP_CHECK.md)).
- Default rules in this template **deny** unknown paths; expand per feature.

## Git / EAS

- `.gitignore` excludes native folders, env files, Google Services, signing material, logs.
- `.easignore` keeps agent/docs/native out of the EAS upload archive; Google Services for builds come from EAS file env vars.

## Auth

- Google / Apple / Phone flows live under `src/lib/firebase/`.
- Register every Android signing SHA ([SIGNING.md](./SIGNING.md)).
- PNV JWT verification is **server-side** (`functions/src/auth/link-verified-phone.ts`).
