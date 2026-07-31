# Agent skills

Place skill folders here (each with a `SKILL.md`) so coding agents follow Expo / project conventions.

## Install official Expo skills

From the project root:

```bash
npx skills@latest add expo/skills --skill '*'
```

This pulls the same skill set used in production Expo + Firebase apps (including GemFort):

| Skill | Use for |
|-------|--------|
| `building-native-ui` / native UI skills | Native-feeling screens, HIG, controls |
| `expo-dev-client` | Development builds (required — RN Firebase does not work in Expo Go) |
| `eas-simulator` | Remote iOS/Android simulators on EAS |
| `eas-update-insights` | EAS Update health and rollouts |
| `expo-api-routes` | Expo Router API routes |
| `expo-module` | Native modules / config plugins |
| `expo-ui` | `@expo/ui` components |
| `native-data-fetching` | React Query, caching, offline |
| `upgrading-expo` | SDK upgrades |

Claude Code users can also enable the Expo plugin via `.claude/settings.json` (`expo@claude-plugins-official`).

## agent-device (Callstack)

```bash
npx skills add callstackincubator/agent-device
npm install -g agent-device@latest   # or use npx
agent-device doctor
agent-device help workflow
```

See root `README.md` → **agent-device** for intro and setup.

See also root `AGENTS.md`.
