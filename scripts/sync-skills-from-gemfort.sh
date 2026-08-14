#!/usr/bin/env bash
# Sync agent skills + IDE configs from orbitratechnology/gemfort into this repo.
# Prefer the GitHub Action: Actions → "Sync skills from gemfort" → Run workflow.
#
# Local usage (from repo root):
#   bash scripts/sync-skills-from-gemfort.sh
# Optional private clone:
#   GEMFORT_TOKEN=ghp_... bash scripts/sync-skills-from-gemfort.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Cloning orbitratechnology/gemfort (shallow)..."
if [ -n "${GEMFORT_TOKEN:-}" ]; then
  git clone --depth 1 "https://x-access-token:${GEMFORT_TOKEN}@github.com/orbitratechnology/gemfort.git" "$TMP/gemfort"
else
  git clone --depth 1 https://github.com/orbitratechnology/gemfort.git "$TMP/gemfort"
fi

SRC="$TMP/gemfort"

mkdir -p "$ROOT/.agents" "$ROOT/.claude" "$ROOT/.cursor" "$ROOT/.vscode"
rm -rf "$ROOT/.agents/skills" "$ROOT/.claude/skills"
cp -a "$SRC/.agents/skills" "$ROOT/.agents/skills"
cp -a "$SRC/.claude/skills" "$ROOT/.claude/skills"
cp -f "$SRC/.cursor/settings.json" "$ROOT/.cursor/settings.json"
cp -f "$SRC/.claude/settings.json" "$ROOT/.claude/settings.json"
cp -f "$SRC/.vscode/settings.json" "$ROOT/.vscode/settings.json"
cp -f "$SRC/.vscode/extensions.json" "$ROOT/.vscode/extensions.json"
cp -f "$SRC/AGENTS.md" "$ROOT/AGENTS.md"
cp -f "$SRC/CLAUDE.md" "$ROOT/CLAUDE.md"
cp -f "$SRC/skills-lock.json" "$ROOT/skills-lock.json"

echo "Synced:"
ls "$ROOT/.agents/skills"
ls "$ROOT/.claude/skills"
echo "Done. Review with: git status"
