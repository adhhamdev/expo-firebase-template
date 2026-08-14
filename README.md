# Expo Firebase Template

Production-ready **Expo SDK 57 · React Native · Firebase** starter: Auth (email, Google, Apple, SMS, PNV), Firestore offline, Storage, Cloud Functions, App Check, push notifications, EAS Build/Update, React Compiler, agent skills.

> Development build required — **not** Expo Go.

**One package / bundle ID** for all build profiles.

---

## Quick start

```bash
bun install
cp .env.example .env          # Firebase web config
# Edit app.config.ts identity constants + PACKAGE_NAME in scripts/sync-firebase-native-configs.mjs
firebase use <project-id>
bun run firebase:sync
bun run signing:fingerprints  # add SHA-1/SHA-256 in Firebase, then sync again
eas init                      # paste EAS project id into app.config.ts
bun run android               # or ios / build:dev:*
```

Full checklist: **[docs/SETUP.md](./docs/SETUP.md)**

---

## Docs

| Guide | Path |
|-------|------|
| Setup from scratch | [docs/SETUP.md](./docs/SETUP.md) |
| Signing & SHA fingerprints | [docs/SIGNING.md](./docs/SIGNING.md) |
| Google Services | [docs/GOOGLE_SERVICES.md](./docs/GOOGLE_SERVICES.md) |
| Auth / PNV / OAuth | [docs/AUTH.md](./docs/AUTH.md) |
| App Check & Play ADI | [docs/APP_CHECK.md](./docs/APP_CHECK.md) |
| Notifications | [docs/NOTIFICATIONS.md](./docs/NOTIFICATIONS.md) |
| Security | [docs/SECURITY.md](./docs/SECURITY.md) |
| Agents / skills | [AGENTS.md](./AGENTS.md) |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `bun start` / `start:dev-client` | Metro |
| `bun run android` / `ios` | Local native |
| `bun run build:dev:*` / `preview:*` / `prod:*` | EAS builds |
| `bun run update:dev` / `update:preview` | EAS Update |
| `bun run firebase:sync` / `firebase:sync:eas` | Google Services files |
| `bun run firebase:deploy` | Rules, indexes, storage, functions |
| `bun run signing:fingerprints` | Print Android SHA-1 / SHA-256 |
| `bun run sync:src` / `sync:skills` | Optional GemFort pattern sync |
| `bun run lint` / `typecheck` / `test` | Quality |

---

## Layout

```text
src/app/              Expo Router
src/features/         Domain logic
src/lib/firebase/     Auth, App Check, Firestore, Storage, callables
src/lib/notifications/
src/components/ui/
src/providers/
functions/            Cloud Functions (incl. PNV link)
google-services/      Native configs (gitignored)
docs/                 Human + agent guides
scripts/              Sync & fingerprint automation
.agents/skills/       Vendored Expo skills
```

---

## Already wired

- React Compiler, typed routes, Bun-first scripts
- App Check debug vs Play Integrity / App Attest
- Offline Firestore warm-up
- Push channels, categories, token registration
- Secure `.gitignore` + `.easignore` (no keystores, no Google Services in git)
- Default-deny Firestore/Storage rules with example `users/{uid}`

---

## License

MIT
