#!/usr/bin/env bash
# Install / refresh official agent skills into this project (.agents/skills).
# Sources (2026):
#   - expo/skills
#   - firebase/agent-skills
#   - vercel-labs/agent-skills → vercel-react-native-skills
#   - callstackincubator/agent-skills (RN best practices, upgrades, …)
#   - callstackincubator/agent-device (optional device QA skill)
#
# Usage (from repo root):
#   bash scripts/install-agent-skills.sh
#   bun run skills:install
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKILLS_CLI=(npx --yes skills@latest)

echo "==> Expo skills (expo/skills)"
"${SKILLS_CLI[@]}" add expo/skills --skill '*' --agent cursor --yes || \
  "${SKILLS_CLI[@]}" add expo/skills --skill '*' --yes

echo "==> Firebase agent skills (firebase/agent-skills)"
"${SKILLS_CLI[@]}" add firebase/agent-skills --skill '*' --agent cursor --yes || \
  "${SKILLS_CLI[@]}" add firebase/agent-skills --skill '*' --yes

echo "==> Vercel React Native skills"
"${SKILLS_CLI[@]}" add vercel-labs/agent-skills --skill vercel-react-native-skills --agent cursor --yes || \
  "${SKILLS_CLI[@]}" add vercel-labs/agent-skills --skill vercel-react-native-skills --yes

echo "==> Callstack React Native skills"
"${SKILLS_CLI[@]}" add callstackincubator/agent-skills --skill '*' --agent cursor --yes || \
  "${SKILLS_CLI[@]}" add callstackincubator/agent-skills --skill '*' --yes

if "${SKILLS_CLI[@]}" add callstackincubator/agent-device --skill '*' --agent cursor --yes 2>/dev/null; then
  echo "==> agent-device skill installed"
else
  echo "==> agent-device skill skipped (optional; install manually if needed)"
fi

# Mirror into .claude/skills for Claude Code discovery (copy tree)
if [ -d .agents/skills ]; then
  mkdir -p .claude/skills
  # Keep Claude copy in sync with a lightweight rsync-like copy of SKILL.md roots
  for d in .agents/skills/*/; do
    name="$(basename "$d")"
    mkdir -p ".claude/skills/$name"
    if [ -f "$d/SKILL.md" ]; then
      cp -f "$d/SKILL.md" ".claude/skills/$name/SKILL.md"
    fi
  done
fi

echo ""
echo "Installed under .agents/skills:"
ls -1 .agents/skills 2>/dev/null | sed 's/^/  - /' || true
echo ""
echo "Done. Commit .agents/skills + skills-lock.json if you want them vendored in git."
echo "Claude plugin alternatives: expo@claude-plugins-official, firebase@firebase"
