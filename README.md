<p align="center">
  <a href="https://expo.dev">
    <img src="docs/assets/expo.svg" alt="Expo" width="72" height="72" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://firebase.google.com">
    <img src="docs/assets/firebase.svg" alt="Firebase" width="72" height="72" />
  </a>
</p>

<h1 align="center">Expo Firebase Template</h1>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://docs.expo.dev/versions/v57.0.0/"><img src="https://img.shields.io/badge/Expo-SDK%2057-black.svg" alt="Expo SDK" /></a>
  <a href="./tsconfig.json"><img src="https://img.shields.io/badge/TypeScript-strict-3178C6.svg" alt="TypeScript" /></a>
  <a href="https://github.com/adhhamdev/expo-firebase-template/generate"><img src="https://img.shields.io/badge/GitHub-Template-success.svg" alt="Template" /></a>
</p>

<p align="center">
  <strong>Production-ready Expo + React Native + Firebase starter</strong> for shipping real apps — not demos.
</p>

Auth (email, Google, Apple, SMS OTP, Android PNV), Firestore with offline persistence, Storage, Cloud Functions, App Check, push notifications, EAS Build & Update, React Compiler, and agent-friendly skills/docs.

> **Requires a development build.** React Native Firebase does **not** run in Expo Go.

**Author:** [Adhham](https://adhham.dev) · **License:** [MIT](./LICENSE)

---

## Create from the terminal

```bash
npx create-expo-app@latest my-app --template https://github.com/adhhamdev/expo-firebase-template
cd my-app && bun install
bun run skills:install   # Expo + Firebase + Vercel RN + Callstack agent skills
```

Also: `bun create expo`, `pnpm` / `yarn create expo-app`, [Use this template](https://github.com/adhhamdev/expo-firebase-template/generate), or `gh repo create … --template adhhamdev/expo-firebase-template`.

---

## Quick start

```bash
bun install
bun run skills:install
cp .env.example .env
# 1) Set identity in app.config.ts (APP_NAME, PACKAGE_NAME, …)
# 2) Same PACKAGE_NAME in scripts/sync-firebase-native-configs.mjs
firebase use <your-project-id>
bun run firebase:sync
bun run signing:fingerprints   # add SHA-1 / SHA-256 in Firebase Console, then sync again
eas init                       # paste project ID into app.config.ts
bun run android                # or: ios · build:dev:android
```

Full checklist: **[docs/SETUP.md](./docs/SETUP.md)** · Agent skills: **[docs/AGENTS_SKILLS.md](./docs/AGENTS_SKILLS.md)**

---

## Why this template

| | |
|---|---|
| **One app identity** | Single package / bundle ID for every build profile |
| **Auth that ships** | Email · Google One Tap · Apple · SMS · Phone Number Verification |
| **Firebase done right** | Native RNFB, offline Firestore, App Check, locked-down rules |
| **Delivery** | EAS Build, Update channels, secure Google Services via EAS file env |
| **Low manual setup** | Scripts for native config sync and Android SHA fingerprints |
| **Agent-ready** | Official Expo, Firebase, Vercel RN, Callstack skills via `skills:install` |
| **Secure defaults** | Strong `.gitignore` / `.easignore`, no secrets in git |

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
| [Auth / OAuth / PNV](./docs/AUTH.md) | Providers and lifecycle helpers |
| [App Check & Play ADI](./docs/APP_CHECK.md) | Debug vs production providers |
| [Notifications](./docs/NOTIFICATIONS.md) | Channels, categories, tokens |
| [Security](./docs/SECURITY.md) | Secrets, rules, baseline |
| [Agent skills & MCP](./docs/AGENTS_SKILLS.md) | Expo · Firebase · Vercel · Callstack |
| [Agents](./AGENTS.md) | Rules for coding agents |
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
| `bun run skills:install` | Install/refresh agent skills |
| `bun run lint` / `typecheck` / `test` | Quality |

---

## Project layout

```text
src/app/                 # Expo Router screens
src/features/            # Domain modules (auth lifecycle, …)
src/lib/firebase/        # Auth, App Check, Firestore, Storage, callables
src/lib/notifications/
src/components/ui/
src/providers/
functions/
google-services/         # Local native configs (gitignored)
docs/
docs/assets/             # README brand marks (Expo, Firebase)
scripts/
.agents/skills/          # After: bun run skills:install
```

Path alias: `@/*` → `./src/*`.

---

## License

[MIT](./LICENSE) © [Adhham](https://adhham.dev)

Expo® and Firebase™ logos are trademarks of their respective owners and are used here only to identify the technologies this template integrates with.

---

## Support

- Issues: [GitHub Issues](https://github.com/adhhamdev/expo-firebase-template/issues)
- Author: [adhham.dev](https://adhham.dev)

If this template saves you time, **star the repo** — it helps others find it.
