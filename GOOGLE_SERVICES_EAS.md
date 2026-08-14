# Firebase native config sync

Firebase should have one project with separate Android and iOS apps for each EAS environment:

| EAS profile   | Package / bundle ID (placeholders) |
|---------------|------------------------------------|
| `development` | `app.yourapp.dev`                  |
| `preview`     | `app.yourapp.preview`              |
| `production`  | `app.yourapp`                      |

Native files are **gitignored**. `app.config.ts` uses EAS file environment variables when present and falls back to matching local files under `google-services/` for local native builds.

## Refresh local files

Requires [Firebase CLI](https://firebase.google.com/docs/cli) logged in and `.firebaserc` pointing at your project.

```bash
bun run firebase:sync
```

One environment only:

```bash
node scripts/sync-firebase-native-configs.mjs preview
```

## Refresh EAS securely

Requires authenticated Firebase CLI **and** EAS CLI:

```bash
bun run firebase:sync:eas
```

The script discovers app IDs via Firebase CLI, downloads current configs into `google-services/`, and uploads them to the matching EAS environment as sensitive file variables:

- `GOOGLE_SERVICES_JSON`
- `GOOGLE_SERVICES_PLIST`

No service files need to be committed to git.

After changing native config, create a **new EAS build**; an OTA update cannot change native Firebase configuration.

## First-time setup checklist

1. Create Android + iOS apps in Firebase Console for each bundle ID above (or your real IDs after search-replace).
2. Update `packageName` / `bundleId` in `scripts/sync-firebase-native-configs.mjs` if you changed them in `app.config.ts`.
3. Run `bun run firebase:sync` then optionally `bun run firebase:sync:eas`.
4. Register SHA-1 / SHA-256 for Google Sign-In (see [AUTH_SETUP.md](./AUTH_SETUP.md)).
