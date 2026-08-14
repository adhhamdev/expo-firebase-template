# Expo Firebase Template

**Production-ready Expo SDK 57 · React Native · Firebase starter**

Use this as the foundation for any mobile app that needs Auth, Firestore, Storage, Cloud Functions, EAS Build/Update, and a modern React Native stack.

| | |
|---|---|
| Platforms | iOS · Android |
| Stack | Expo SDK 57 · React Native · React 19 · TypeScript |
| Package manager | **Bun** (preferred) · npm / yarn |
| Backend | Firebase Auth · Firestore · Storage · Cloud Functions |
| Auth | Email · Google · Apple · SMS OTP · PNV (Android) |
| App identity | **One** package / bundle ID for all builds |

> **Requires a development build.** React Native Firebase does **not** work in Expo Go.

---

## Guided setup (do this once)

### 0. Prerequisites

- [Bun](https://bun.sh) or Node 20+
- Android Studio and/or Xcode
- Accounts: [Expo](https://expo.dev), [Firebase](https://console.firebase.google.com)

```bash
# CLIs (once per machine)
curl -fsSL https://bun.sh/install | bash
npm install -g eas-cli firebase-tools
eas login
firebase login
```

### 1. Create your repo from this template

GitHub → **Use this template** → new repository, then:

```bash
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>
bun install
```

### 2. Name your app (single package)

Edit **`app.config.ts`** at the top:

| Constant | Example |
|----------|---------|
| `APP_NAME` | `"Acme"` |
| `APP_SLUG` | `"acme"` |
| `APP_SCHEME` | `"acme"` |
| `PACKAGE_NAME` | `"com.acme.app"` |
| `EAS_PROJECT_ID` | from step 4 |
| `EXPO_OWNER` | your Expo username or org |

Also set `PACKAGE_NAME` in **`scripts/sync-firebase-native-configs.mjs`** to the same value.

There are **no** separate `.dev` / `.preview` apps — development, preview, and store builds share this one ID.

### 3. Firebase project

1. [Firebase Console](https://console.firebase.google.com) → create a project.
2. Add **one Android app** and **one iOS app** with package/bundle = your `PACKAGE_NAME`.
3. Project settings → **Web** app → copy config into `.env`:

```bash
cp .env.example .env
```

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

4. Point the CLI at the project:

```bash
# .firebaserc → "default": "your-project-id"
firebase use your-project-id
```

5. Pull native config files:

```bash
bun run firebase:sync
# optional: attach the same files to EAS builds
bun run firebase:sync:eas
```

Files land in `google-services/` (gitignored). Details: [GOOGLE_SERVICES_EAS.md](./GOOGLE_SERVICES_EAS.md).

6. Enable Auth providers you need (Email, Google, Apple, Phone). Full guide: [AUTH_SETUP.md](./AUTH_SETUP.md).

### 4. EAS project

```bash
eas init
# paste project ID into app.config.ts → EAS_PROJECT_ID
```

Profiles in `eas.json` (same package for all):

| Profile | Use |
|---------|-----|
| `development` | Dev client (required for RN Firebase) |
| `preview` | Internal test builds |
| `production` | Store / release |

### 5. First run

```bash
# Local native (after google-services files exist)
bun run android
# or
bun run ios

# Or cloud dev client
bun run build:dev:android
bun run build:dev:ios
bun run start:dev-client
```

### 6. Ship rules & functions (when ready)

```bash
bun run firebase:deploy
```

---

## Daily commands

| Command | Purpose |
|---------|---------|
| `bun start` / `start:dev-client` | Metro |
| `bun run android` / `ios` | Local native |
| `bun run build:dev:*` | EAS development client |
| `bun run build:preview:*` | Internal preview |
| `bun run build:prod:*` | Production |
| `bun run update:dev` / `update:preview` | EAS Update |
| `bun run lint` / `typecheck` / `test` | Quality |
| `bun run firebase:deploy` | Rules + indexes + storage + functions |
| `bun run firebase:sync` | Refresh Google Services files |

---

## Project layout

```text
src/
├── app/              # Expo Router screens
│   ├── (auth)/       # Login / register
│   ├── (tabs)/       # Main tabs
│   └── _layout.tsx   # Providers + splash
├── components/ui/    # Shared UI
├── features/         # Domain logic (start with auth/)
├── lib/firebase/     # Auth, Firestore, Storage, callables
├── providers/
└── …
functions/            # Cloud Functions (incl. PNV link)
google-services/      # Native Firebase config (local only)
AUTH_SETUP.md
GOOGLE_SERVICES_EAS.md
```

Path aliases: `@/*` → `./src/*`.

**Add a feature:** put services under `src/features/<name>/`, screens under `src/app/`, reuse `components/ui` and providers, extend rules as needed.

---

## Auth (short)

| Module | Path |
|--------|------|
| Google / Apple | `src/lib/firebase/social-auth` |
| SMS | `src/lib/firebase/phone-auth` |
| PNV | `src/lib/firebase/phone-pnv` |
| Server link | `functions/src/auth/link-verified-phone.ts` |

Phone UX: try **PNV** on Android, fall back to **SMS**. iOS uses SMS. Rebuild after enabling native providers. See [AUTH_SETUP.md](./AUTH_SETUP.md).

---

## Optional: sync reusable code from GemFort

Production patterns live in [GemFort](https://github.com/orbitratechnology/gemfort). Pull UI / Firebase client / agent skills without domain product code:

```bash
bun run sync:src      # UI, providers, hooks, firebase libs
bun run sync:skills   # agent skills + IDE configs
```

Or run the matching **workflow_dispatch** Actions. Private source: set secret / env `GEMFORT_TOKEN`.

---

## Agent / AI (optional)

In-repo Expo skills, `AGENTS.md`, Cursor / Claude / VS Code settings. Prefer versioned docs: https://docs.expo.dev/versions/v57.0.0/

Device QA: [agent-device](https://github.com/callstack/agent-device) — `npx skills add callstackincubator/agent-device`.

---

## License

MIT
