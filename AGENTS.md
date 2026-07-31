# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Project conventions

- Feature-based folders under `src/features/<domain>/`.
- Screens in `src/app/` stay thin; business logic lives in features.
- Use path aliases `@/` and `@/assets/`.
- Prefer React Native Firebase for Auth/Firestore/Storage on native.
- Never assume Expo Go — this template requires a **development build**.
- Keep secrets out of git; use `.env` and EAS secrets.
- Prefer **Bun** for install and scripts (`bun install`, `bun run …`).

## Agent skills

Install official Expo skills (from project root):

```bash
npx skills@latest add expo/skills --skill '*'
```

Or selectively: `building-native-ui`, `expo-dev-client`, `eas-simulator`, `eas-update-insights`, `expo-api-routes`, `expo-module`, `expo-ui`, `native-data-fetching`, `upgrading-expo`.

Install Callstack **agent-device** skill for live device QA:

```bash
npx skills add callstackincubator/agent-device
```

Before any device automation, run `agent-device --version` and `agent-device help workflow`.
