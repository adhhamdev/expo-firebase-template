# Agent instructions (Expo Firebase Template)

## Docs (version-pinned)

- Expo SDK **57**: https://docs.expo.dev/versions/v57.0.0/
- EAS: https://docs.expo.dev/eas/
- Expo agents / skills / MCP: https://docs.expo.dev/agents/
- React Native Firebase: https://rnfirebase.io/
- Firebase agent skills: https://firebase.google.com/docs/ai-assistance/agent-skills
- Firebase MCP: https://firebase.google.com/docs/ai-assistance/mcp-server
- Vercel RN skills: https://vercel.com/docs/agent-resources/skills

Do **not** use unversioned Expo docs when SDK behavior differs.

## Install / refresh skills (project-local)

```bash
bun run skills:install
# or: bash scripts/install-agent-skills.sh
```

This installs into `.agents/skills/` from:

| Source | What |
|--------|------|
| [expo/skills](https://github.com/expo/skills) | Expo SDK, Router, EAS, native UI, upgrades, … |
| [firebase/agent-skills](https://github.com/firebase/agent-skills) | Auth, Firestore, rules, Crashlytics, basics, … |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | **vercel-react-native-skills** (lists, animation, UI) |
| [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) | RN best practices, upgrades, navigation, TV, … |

Claude Code plugins (optional): `expo@claude-plugins-official`, Firebase marketplace plugin.

Cursor: enable Firebase + Expo plugins/MCP per their docs; skills under `.agents/skills` are discovered automatically by many agents.

## Architecture

- Feature modules: `src/features/<domain>/`
- Screens: `src/app/` (Expo Router)
- Firebase client: `src/lib/firebase/` (`.native.ts` where needed)
- Account lifecycle: `@/features/auth`
- Shared UI: `src/components/ui/`
- Providers: `src/providers/`
- Cloud Functions: `functions/`

Single package/bundle ID for all builds.

## Hard rules

1. **No Expo Go** for RNFB — development builds only.
2. **Never commit secrets**: `.env`, Google Services files, keystores.
3. Prefer scripts: `firebase:sync`, `signing:fingerprints`, `skills:install`.
4. App Check activates in `warmUpFirestore` before Firestore use.
5. Default-deny security rules; expand per feature.
6. React Compiler is enabled (`experiments.reactCompiler`).
7. After adding native modules, **rebuild** the binary.

## Human setup

See [docs/SETUP.md](./docs/SETUP.md).
