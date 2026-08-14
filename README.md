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
| Security | **App Check** (debug + Play Integrity / App Attest) |
| Play | **adi-registration.properties** via config plugin |
| App identity | **One** package / bundle ID for all builds |

> **Requires a development build.** React Native Firebase does **not** work in Expo Go.

---

## Guided setup (do this once)

### 0. Prerequisites

- [Bun](https://bun.sh) or Node 20+
- Android Studio and/or Xcode
- Accounts: [Expo](https://expo.dev), [Firebase](https://console.firebase.google.com)

```bash
curl -fsSL https://bun.sh/install | bash
npm install -g eas-cli firebase-tools
eas login
firebase login
```

### 1. Create your repo from this template

```bash
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>
bun install
```

### 2. Name your app (single package)

Edit **`app.config.ts`**:

| Constant | Example |
|----------|---------|
| `APP_NAME` | `"Acme"` |
| `APP_SLUG` | `"acme"` |
| `APP_SCHEME` | `"acme"` |
| `PACKAGE_NAME` | `"com.acme.app"` |
| `EAS_PROJECT_ID` | from step 4 |
| `EXPO_OWNER` | your Expo username or org |

Use the **same** `PACKAGE_NAME` in `scripts/sync-firebase-native-configs.mjs`.

### 3. Firebase project

1. Create a Firebase project.
2. Add **one Android** + **one iOS** app with package/bundle = `PACKAGE_NAME`.
3. Copy web config into `.env`:

```bash
cp .env.example .env
```

4. `firebase use your-project-id` (or edit `.firebaserc`).
5. Native configs:

```bash
bun run firebase:sync
bun run firebase:sync:eas   # optional
```

6. Auth providers: [AUTH_SETUP.md](./AUTH_SETUP.md).
7. **App Check** (recommended before enforcement): [APP_CHECK.md](./APP_CHECK.md).

### 4. EAS project

```bash
eas init
# paste ID into app.config.ts → EAS_PROJECT_ID
```

Set `EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN` in `eas.json` development/preview (or EAS env) after generating a debug token. Leave it off production.

### 5. First run

```bash
bun run android   # or ios
# or
bun run build:dev:android && bun run start:dev-client
```

### 6. Play package verification (when Console asks)

Paste the Play token into `assets/adi-registration.properties`, then rebuild Android. See [APP_CHECK.md](./APP_CHECK.md).

### 7. Deploy backend when ready

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
├── app/                 # Expo Router
├── components/ui/
├── features/
├── lib/firebase/        # Auth, App Check, Firestore, Storage, callables
├── providers/
functions/
google-services/         # Native Firebase config (gitignored)
assets/adi-registration.properties
AUTH_SETUP.md
APP_CHECK.md
GOOGLE_SERVICES_EAS.md
```

Path aliases: `@/*` → `./src/*`.

---

## Auth · App Check · Play ADI

| Topic | Doc |
|-------|-----|
| Google · Apple · SMS · PNV | [AUTH_SETUP.md](./AUTH_SETUP.md) |
| App Check debug + production providers | [APP_CHECK.md](./APP_CHECK.md) |
| Play `adi-registration.properties` | [APP_CHECK.md](./APP_CHECK.md) |
| Native Google Services / EAS files | [GOOGLE_SERVICES_EAS.md](./GOOGLE_SERVICES_EAS.md) |

App Check activates automatically on native boot (`activateAppCheck` inside `warmUpFirestore`). Production uses Play Integrity / App Attest; development uses the debug provider when a debug token is present.

---

## Optional: sync from GemFort

```bash
bun run sync:src
bun run sync:skills
```

Or GitHub Actions (`workflow_dispatch`). Private source: `GEMFORT_TOKEN`.

---

## License

MIT
