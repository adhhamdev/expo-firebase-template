# Expo Firebase Template

**Production-ready Expo SDK 57 · React Native · Firebase starter**

A clean, scalable, AI/agent-friendly template extracted from real production patterns (including Orbitra / GemFort agent configs). Use this as the foundation for any new mobile app that needs Auth, Firestore, Storage, Cloud Functions, EAS Build/Update, and a modern React Native stack.

| | |
|---|---|
| Platforms | iOS · Android |
| Stack | Expo SDK 57 · React Native 0.86 · React 19 · TypeScript |
| Package manager | **Bun** (preferred) · npm / yarn also fine |
| Backend | Firebase Auth · Firestore · Storage · Cloud Functions |
| Delivery | EAS Build · EAS Update |
| Agents | Expo skills · Callstack agent-device · Cursor / Claude / VS Code configs |

> **Requires a development build.** React Native Firebase does **not** work in Expo Go.

---

## Why this template

- **No repetitive setup** — Firebase init, providers, EAS multi-env, rules, functions, TypeScript paths, and agent rules are already wired.
- **Feature-based & scalable** — `src/features/<domain>/` keeps domain logic isolated; screens stay thin.
- **High performance defaults** — React Compiler, FlashList-ready, offline Firestore persistence, React Query, Reanimated.
- **AI / Agent friendly** — `AGENTS.md`, `.agents/skills/`, Cursor / Claude / VS Code settings aligned with production apps; official Expo skills + agent-device supported.
- **Placeholders only** — every project-specific value (bundle IDs, Firebase keys, EAS project ID, app name) is a clear placeholder.
- **Bun-first** — lockfile and scripts assume Bun; npm/yarn still work.

---

## Quick start

### Prerequisites

- [Bun](https://bun.sh) (preferred) or Node.js 20+
- Android Studio and/or Xcode
- [EAS CLI](https://docs.expo.dev/eas/) and [Firebase CLI](https://firebase.google.com/docs/cli) (guides below)
- Optional: [agent-device](https://github.com/callstack/agent-device) for AI-driven device QA

### 1. Use this template

```bash
# GitHub: click "Use this template" → Create a new repository
# or clone and re-init:
git clone https://github.com/adhhamdev/expo-firebase-template.git my-app
cd my-app
rm -rf .git && git init
```

### 2. Install (Bun)

```bash
bun install
# alternatives: npm install / yarn
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
.agents/skills/          # Agent skills (Expo-oriented + agent-device)
.cursor/ · .claude/ · .vscode/
```

Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.

---

## Tech stack

| Area | Choice |
|------|--------|
| App | Expo SDK 57, RN 0.86, React 19, TypeScript strict |
| Package manager | Bun (preferred) |
| Navigation | Expo Router (typed routes) |
| Data | TanStack React Query, Zod |
| Backend | `@react-native-firebase/*` + `firebase` JS where needed |
| UI / motion | Reanimated 4, Gesture Handler, Keyboard Controller |
| Lists | `@shopify/flash-list` (add when you need lists) |
| Toasts | `sonner-native` |
| Delivery | EAS Build + Update |
| Agent QA | Callstack agent-device |

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

## EAS CLI guide

[EAS](https://docs.expo.dev/eas/) builds native binaries and ships OTA updates.

### Install & login

```bash
npm install -g eas-cli
# or: bun add -g eas-cli
eas login
eas whoami
```

### Link this project

```bash
eas init
# paste the project ID into app.config.ts → extra.eas.projectId
# and updates.url → https://u.expo.dev/<project-id>
```

### Profiles (already in `eas.json`)

- **development** — dev client, internal distribution
- **preview** — internal / TestFlight-style previews
- **production** — store builds

### Common commands

```bash
# Development client (required for RN Firebase)
bun run build:dev:android
bun run build:dev:ios

# Preview / production
bun run build:preview:android
bun run build:prod:ios

# OTA updates (same runtimeVersion / appVersion policy)
bun run update:dev
bun run update:preview

eas build:list
eas update:list
eas credentials   # manage signing
```

### Secrets

Put Firebase / API secrets in EAS, not in git:

```bash
eas secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "..." --scope project
```

Or use EAS environment variables in the dashboard for each profile.

Docs: https://docs.expo.dev/build/introduction/ · https://docs.expo.dev/eas-update/introduction/

---

## Firebase CLI guide

### Install & login

```bash
npm install -g firebase-tools
# or: bun add -g firebase-tools
firebase login
firebase projects:list
```

### Point at your project

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

Or:

```bash
firebase use your-project-id
```

### Deploy rules, indexes, storage, functions

```bash
# From repo root (script already set)
bun run firebase:deploy

# Or selectively
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
firebase deploy --only functions
```

### Functions locally

```bash
cd functions
bun install   # or npm install
npm run build
firebase emulators:start --only functions,firestore
```

Client helpers live in `src/lib/firebase/`. Expand `firestore.rules` / `storage.rules` per feature (default is locked down).

Docs: https://firebase.google.com/docs/cli

---

## Bun

This template prefers [Bun](https://bun.sh) for speed and a single toolchain.

```bash
# Install Bun (macOS / Linux)
curl -fsSL https://bun.sh/install | bash

# Project
bun install
bun run start
bun run android
bun run typecheck
```

`package.json` scripts work with `bun run …`. If you use npm/yarn, run the same script names (`npm run android`, etc.). Commit `bun.lock` when using Bun.

---

## agent-device (Callstack)

### What it is

**agent-device** is an agent-native CLI from [Callstack](https://github.com/callstack/agent-device) that gives coding agents hands and eyes on real apps. Agents can:

- Open apps on iOS Simulator, Android Emulator, physical devices, TV, macOS, Linux, and a minimal web surface
- Read **accessibility snapshots** (token-efficient UI trees with refs like `@e3`)
- Tap, type, scroll, assert, and capture screenshots / video / logs / network / perf evidence
- Inspect React Native internals (component trees, slow renders) via React DevTools passthrough

It does **not** decide the test strategy — your coding agent (Cursor, Claude Code, Codex, etc.) interprets the screen and chooses commands. agent-device is the execution and evidence layer. Official Expo docs: https://docs.expo.dev/agents/agent-device/

### Install

Requires Node.js 22.12+ (web automation prefers 24+). Xcode for iOS, Android SDK/ADB for Android.

```bash
npm install -g agent-device@latest
agent-device doctor
agent-device --version
agent-device help workflow
```

One-off without global install: `npx agent-device help workflow`.

### Skill for agents

```bash
npx skills add callstackincubator/agent-device
```

Agents should run `agent-device --version` then `agent-device help workflow` before planning commands. Extra topics: `help react-native`, `help debugging`, `help react-devtools`, `help dogfood`.

### Typical loop

```bash
agent-device boot --platform ios          # or android
agent-device open yourapp --platform ios  # bundle id / app name
agent-device snapshot -i                 # interactive a11y tree + refs
agent-device press @e2 --settle
agent-device fill @e3 "user@example.com"
agent-device screenshot evidence.png
agent-device logs path
```

Works with this template’s **development builds** (not Expo Go). After `bun run android` / `ios` or an EAS dev client install, point agent-device at the running app.

More: https://oss.callstack.com/agent-device/ · https://github.com/callstack/agent-device

---

## Agent / AI setup

Aligned with production Orbitra apps (e.g. GemFort):

| Path | Role |
|------|------|
| `AGENTS.md` | Forces versioned Expo 57 docs + project conventions |
| `CLAUDE.md` | Points Claude at `AGENTS.md` |
| `.agents/skills/` | Drop / install Expo + agent-device skills |
| `.cursor/settings.json` | Firebase plugin enabled for Cursor |
| `.claude/settings.json` | Expo official plugin for Claude Code |
| `.vscode/` | Format-on-save, Expo tools recommendation |

### Install Expo skills

```bash
npx skills@latest add expo/skills --skill '*'
```

Claude Code: plugin is already enabled in `.claude/settings.json` (`expo@claude-plugins-official`).

Always use **versioned** Expo docs: https://docs.expo.dev/versions/v57.0.0/

---

## Firebase (client)

- **Client**: `src/lib/firebase/` — warm-up with offline persistence, auth service, storage helpers, callable functions.
- **Rules**: start from `firestore.rules` and `storage.rules` (locked down; expand per feature).
- **Functions**: `functions/` — TypeScript, region placeholder, example hello + scheduled stub.
- **Deploy**: `bun run firebase:deploy` (requires Firebase CLI + project).

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
