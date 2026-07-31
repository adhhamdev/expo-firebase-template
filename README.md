# Expo Firebase Template

**Production-ready Expo SDK 57 · React Native · Firebase starter**

A clean, scalable, AI/agent-friendly template extracted from real production patterns. Use this as the foundation for any new mobile app that needs Auth, Firestore, Storage, Cloud Functions, EAS Build/Update, and a modern React Native stack.

| | |
|---|---|
| Platforms | iOS · Android |
| Stack | Expo SDK 57 · React Native 0.86 · React 19 · TypeScript |
| Backend | Firebase Auth · Firestore · Storage · Cloud Functions |
| Delivery | EAS Build · EAS Update |

---

## Why this template

- **No repetitive setup** — Firebase init, providers, EAS multi-env, rules, functions, TypeScript paths, and agent rules are already wired.
- **Feature-based & scalable** — `src/features/<domain>/` keeps domain logic isolated; screens stay thin.
- **High performance defaults** — React Compiler, FlashList-ready, offline Firestore persistence, React Query, Reanimated.
- **AI / Agent friendly** — `AGENTS.md`, `.agents/skills/`, Cursor/Claude settings so coding agents follow Expo 57 docs and project conventions.
- **Placeholders only** — every project-specific value (bundle IDs, Firebase keys, EAS project ID, app name) is a clear placeholder.

---

## Quick start

### 1. Use this template

```bash
# GitHub: click "Use this template" → Create a new repository
# or clone and re-init:
git clone https://github.com/adhhamdev/expo-firebase-template.git my-app
cd my-app
rm -rf .git && git init
```

### 2. Install

```bash
bun install   # preferred (or npm install / yarn)
```

### 3. Environment

```bash
cp .env.example .env
```

Fill in your Firebase web config (Project settings → Your apps → Web app):

```bash
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Native Google Services

1. Create Android + iOS apps in Firebase Console with your bundle IDs (see `app.config.ts`).
2. Download `google-services.json` and `GoogleService-Info.plist`.
3. Place them under `google-services/` (see folder README).

### 5. Project identity (search & replace)

| Placeholder | Replace with |
|-------------|--------------|
| `YOUR_APP_NAME` | Display name |
| `your-app` / `yourapp` | slug / scheme |
| `app.yourapp.dev` etc. | Bundle IDs |
| `YOUR_EAS_PROJECT_ID` | EAS project ID (`eas init`) |
| `your-org` | Expo / GitHub org |
| `asia-south1` | Your Firebase region |

### 6. Run (development build required)

React Native Firebase does **not** work in Expo Go.

```bash
# Local native
bun run android
# or
bun run ios

# Or EAS dev client
bun run build:dev:android
bun run start:dev-client
```

---

## Architecture

```text
src/
├── app/                 # Expo Router (file-based routes)
│   ├── (auth)/          # Login, register, etc.
│   ├── (tabs)/          # Main tab navigator
│   └── _layout.tsx      # Root providers + splash
├── components/
│   └── ui/              # Base Button, Input, Screen, Card, …
├── features/
│   └── auth/            # Domain services (extend with more features)
├── constants/           # Design tokens, theme
├── hooks/
├── lib/
│   ├── firebase/        # Init, auth, db, storage, callFunction
│   ├── errors.ts
│   └── validation/
├── providers/           # Auth, Query, Theme, Toast, Loading, Confirm
├── navigation/
└── types/
functions/               # Cloud Functions (TypeScript)
google-services/         # Per-env native Firebase config
assets/
.agents/skills/          # Agent skills (Expo-oriented)
```

Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.

---

## Tech stack

| Area | Choice |
|------|--------|
| App | Expo SDK 57, RN 0.86, React 19, TypeScript strict |
| Navigation | Expo Router (typed routes) |
| Data | TanStack React Query, Zod |
| Backend | `@react-native-firebase/*` + `firebase` JS where needed |
| UI / motion | Reanimated 4, Gesture Handler, Keyboard Controller |
| Lists | `@shopify/flash-list` (add when you need lists) |
| Toasts | `sonner-native` |
| Delivery | EAS Build + Update |

---

## Environments

| Profile | `EXPO_PUBLIC_APP_ENV` | Bundle ID pattern |
|---------|----------------------|-------------------|
| development | `development` | `app.yourapp.dev` |
| preview | `preview` | `app.yourapp.preview` |
| production | `production` | `app.yourapp` |

Configure in `app.config.ts` and `eas.json`.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `bun start` | Metro |
| `bun run start:dev-client` | Dev client Metro |
| `bun run android` / `ios` | Native run |
| `bun run build:dev:android` / `:ios` | EAS development builds |
| `bun run build:preview:*` | Preview builds |
| `bun run update:dev` / `update:preview` | EAS Update |
| `bun run lint` / `typecheck` / `test` | Quality |
| `bun run firebase:deploy` | Rules + indexes + storage + functions |

---

## Firebase

- **Client**: `src/lib/firebase/` — warm-up with offline persistence, auth service, storage helpers, callable functions.
- **Rules**: start from `firestore.rules` and `storage.rules` (locked down; expand per feature).
- **Functions**: `functions/` — TypeScript, region placeholder, example hello + scheduled stub.
- **Deploy**: `bun run firebase:deploy` (requires Firebase CLI + project).

---

## Agent / AI setup

- `AGENTS.md` — points agents at Expo SDK 57 docs.
- `.agents/skills/` — drop additional skills (Expo UI, EAS, data fetching, etc.).
- `.cursor/settings.json` / `.claude/settings.json` — optional IDE agent prefs.

Always use **versioned** Expo docs: https://docs.expo.dev/versions/v57.0.0/

---

## Adding a feature

1. Create `src/features/<name>/` with services and types.
2. Add screens under `src/app/` (or a route group).
3. Reuse `src/components/ui/*` and providers.
4. Extend Firestore rules and indexes as needed.
5. Keep screens thin; put business logic in features.

---

## License

MIT — use freely for commercial and personal projects.

---

Built from production patterns (Expo 57 + Firebase). Customize placeholders and ship.
