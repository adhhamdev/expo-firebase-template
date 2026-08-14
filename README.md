# Expo Firebase Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-black.svg)](https://docs.expo.dev/versions/v57.0.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)](./tsconfig.json)
[![Template](https://img.shields.io/badge/GitHub-Template-success.svg)](https://github.com/adhhamdev/expo-firebase-template/generate)

**Production-ready Expo + React Native + Firebase starter** for shipping real apps — not demos.

Auth (email, Google, Apple, SMS OTP, Android PNV), Firestore with offline persistence, Storage, Cloud Functions, App Check, push notifications, EAS Build & Update, React Compiler, and agent-friendly skills/docs.

> **Requires a development build.** React Native Firebase does **not** run in Expo Go.

**Author:** [Adhham](https://adhham.dev) · **License:** [MIT](./LICENSE)

---

## Create from the terminal

Uses [create-expo-app](https://docs.expo.dev/more/create-expo/) with this repo as a **GitHub template** (no extra npm package required).

```bash
# npm
npx create-expo-app@latest my-app --template https://github.com/adhhamdev/expo-firebase-template

# bun
bun create expo my-app --template https://github.com/adhhamdev/expo-firebase-template

# pnpm / yarn
pnpm create expo-app my-app --template https://github.com/adhhamdev/expo-firebase-template
yarn create expo-app my-app --template https://github.com/adhhamdev/expo-firebase-template
```

Pin a branch or tag:

```bash
npx create-expo-app@latest my-app --template https://github.com/adhhamdev/expo-firebase-template/tree/main
```

Then:

```bash
cd my-app
bun install   # or npm install
cp .env.example .env
# continue with Quick start below
```

### Other terminal options

```bash
# GitHub CLI (after enabling Template repository on the repo)
gh repo create my-app --template adhhamdev/expo-firebase-template --public --clone
cd my-app && bun install

# degit (copy without git history)
npx degit adhhamdev/expo-firebase-template my-app
cd my-app && bun install && git init

# plain clone (you keep the upstream remote until you change it)
git clone https://github.com/adhhamdev/expo-firebase-template.git my-app
cd my-app && rm -rf .git && git init && bun install
```

### GitHub UI

**[Use this template](https://github.com/adhhamdev/expo-firebase-template/generate)** → new repo → clone.

---

## Why this template

| | |
|---|---|
| **One app identity** | Single package / bundle ID for every build profile |
| **Auth that ships** | Email · Google One Tap · Apple · SMS · Phone Number Verification |
| **Firebase done right** | Native RNFB, offline Firestore, App Check, locked-down rules |
| **Delivery** | EAS Build, Update channels, secure Google Services via EAS file env |
| **Low manual setup** | Scripts for native config sync and Android SHA fingerprints |
| **Agent-ready** | `AGENTS.md`, vendored Expo skills, clear architecture |
| **Secure defaults** | Strong `.gitignore` / `.easignore`, no secrets in git |

---

## Quick start

```bash
bun install
cp .env.example .env
# 1) Set identity in app.config.ts (APP_NAME, PACKAGE_NAME, …)
# 2) Same PACKAGE_NAME in scripts/sync-firebase-native-configs.mjs
firebase use <your-project-id>
bun run firebase:sync
bun run signing:fingerprints   # add SHA-1 / SHA-256 in Firebase Console, then sync again
eas init                       # paste project ID into app.config.ts
bun run android                # or: ios · build:dev:android
```

Full checklist: **[docs/SETUP.md](./docs/SETUP.md)**

---

## Stack

| Area | Choice |
|------|--------|
| App | Expo SDK 57 · React Native · React 19 · TypeScript |
| Navigation | Expo Router (typed routes) |
| Backend | `@react-native-firebase/*` + Cloud Functions |
| Data | TanStack Query · Zod · offline Firestore |
| Auth | Nitro Google Sign-In · Apple · Phone SMS/PNV |
| Security | App Check (debug / Play Integrity / App Attest) |
| Push | expo-notifications (channels, categories, token) |
| Delivery | EAS Build + Update |
| Tooling | Bun-first · ESLint · Jest · React Compiler |

---

## Documentation

| Guide | |
|-------|---|
| [Setup from scratch](./docs/SETUP.md) | Clone → Firebase → EAS → first run |
| [Signing & SHA fingerprints](./docs/SIGNING.md) | Debug, EAS, Play App Signing |
| [Google Services](./docs/GOOGLE_SERVICES.md) | `firebase:sync` automation |
| [Auth / OAuth / PNV](./docs/AUTH.md) | Providers and client flows |
| [App Check & Play ADI](./docs/APP_CHECK.md) | Debug vs production providers |
| [Notifications](./docs/NOTIFICATIONS.md) | Channels, categories, tokens |
| [Security](./docs/SECURITY.md) | Secrets, rules, baseline |
| [Agents](./AGENTS.md) | AI coding rules & skills |
| [Contributing](./CONTRIBUTING.md) | PRs and guidelines |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `bun start` / `start:dev-client` | Metro |
| `bun run android` / `ios` | Local native run |
| `bun run build:dev:*` / `preview:*` / `prod:*` | EAS builds |
| `bun run update:dev` / `update:preview` | EAS Update |
| `bun run firebase:sync` / `firebase:sync:eas` | Native Google Services |
| `bun run firebase:deploy` | Rules, indexes, storage, functions |
| `bun run signing:fingerprints` | Print Android SHA-1 / SHA-256 |
| `bun run lint` / `typecheck` / `test` | Quality |

---

## Project layout

```text
src/app/                 # Expo Router screens
src/features/            # Domain modules (start with auth)
src/lib/firebase/        # Auth, App Check, Firestore, Storage, callables
src/lib/notifications/   # Push registration & channels
src/components/ui/       # Shared UI primitives
src/providers/           # Auth, theme, toast, query, push, …
functions/               # Cloud Functions (incl. PNV link)
google-services/         # Local native configs (gitignored)
docs/                    # Human-readable guides
scripts/                 # Automation (sync, fingerprints)
.agents/skills/          # Vendored Expo agent skills
```

Path alias: `@/*` → `./src/*`.

---

## Requirements

- [Bun](https://bun.sh) (or Node 20+)
- Xcode and/or Android Studio
- [Expo account](https://expo.dev) + EAS CLI
- [Firebase](https://console.firebase.google.com) project + Firebase CLI

---

## License

[MIT](./LICENSE) © [Adhham](https://adhham.dev)

Free for personal and commercial use. Attribution appreciated but not required.

---

## Support

- Issues: [GitHub Issues](https://github.com/adhhamdev/expo-firebase-template/issues)
- Author: [adhham.dev](https://adhham.dev)

If this template saves you time, **star the repo** — it helps others find it.
