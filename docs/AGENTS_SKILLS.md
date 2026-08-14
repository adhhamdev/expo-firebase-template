# Agent skills & MCP

## One-command install (recommended)

From the project root after clone:

```bash
bun run skills:install
```

Installs **project-local** skills under `.agents/skills/` (and mirrors `SKILL.md` into `.claude/skills/`):

1. **Expo** — `npx skills add expo/skills --skill '*'`  
   Native UI, Router, EAS workflows/stores, upgrades, dev client, data fetching, etc.
2. **Firebase** — `npx skills add firebase/agent-skills --skill '*'`  
   Auth, Firestore, security rules, Crashlytics, hosting, basics, …
3. **Vercel** — `vercel-react-native-skills` from `vercel-labs/agent-skills`  
   List performance, animations, navigation, UI patterns.
4. **Callstack** — `callstackincubator/agent-skills`  
   RN best practices, upgrading RN, navigation, TV, brownfield, GitHub Actions patterns.

Optional: `callstackincubator/agent-device` for device QA skill.

## Plugins (Claude / Codex)

| Tool | Install |
|------|---------|
| Claude Code Expo | `/plugin install expo@claude-plugins-official` |
| Claude Firebase | marketplace `firebase/agent-skills` → install Firebase plugin |
| Codex | Expo / Firebase curated plugins per their docs |

## MCP (live project actions)

Skills teach **how**; MCP enables **actions**:

- **Expo MCP** — https://docs.expo.dev/mcp  
- **Firebase MCP** — `npx -y firebase-tools@latest mcp` (see Firebase AI assistance docs)

Wire servers in Cursor `.cursor/mcp.json` / Claude MCP settings as needed.

## Vendoring

By default, run `skills:install` after clone so skills stay current.  
To freeze them in git: run the script, then commit `.agents/skills/` and `skills-lock.json`.

EAS builds ignore `.agents/` via `.easignore` (not needed on builders).
