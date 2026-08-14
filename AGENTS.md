# Agent instructions (Expo Firebase Template)

## Docs (version-pinned)

- Expo SDK **57**: https://docs.expo.dev/versions/v57.0.0/
- EAS Build / Update / credentials: https://docs.expo.dev/eas/
- React Native Firebase: https://rnfirebase.io/
- Firebase CLI: https://firebase.google.com/docs/cli
- App Check (RNFB): https://rnfirebase.io/app-check/usage
- expo-notifications: https://docs.expo.dev/versions/v57.0.0/sdk/notifications/

Do **not** use unversioned Expo docs when behavior may differ by SDK.

## Architecture

- Feature modules: `src/features/<domain>/`
- Screens: `src/app/` (Expo Router)
- Firebase client: `src/lib/firebase/` (platform `.native.ts` where needed)
- Shared UI: `src/components/ui/`
- Providers: `src/providers/`
- Cloud Functions: `functions/`

Single package/bundle ID for all builds. No `.dev` / `.preview` app IDs.

## Hard rules

1. **No Expo Go** for this stack — use development builds (`expo-dev-client`).
2. **Never commit secrets**: `.env`, Google Services JSON/plist, keystores, `credentials.json`.
3. Prefer scripts over manual steps: `firebase:sync`, `signing:fingerprints`, `sync:src` / `sync:skills`.
4. Firestore offline persistence is enabled in `warmUpFirestore`; App Check activates first.
5. Expand security rules per feature; default is deny-unknown.
6. React Compiler is enabled (`experiments.reactCompiler` in `app.config.ts`).
7. After adding native modules or plugins, **rebuild** the binary (OTA cannot add native code).

## Skills

Vendored under `.agents/skills/` and `.claude/skills/`. Re-sync: `bun run sync:skills`.

## Setup path for humans

See [docs/SETUP.md](./docs/SETUP.md).
