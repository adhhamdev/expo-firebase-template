#!/usr/bin/env bash
# Sync agent skills + IDE agent configs from orbitratechnology/gemfort
# into this repo (adhhamdev/expo-firebase-template).
#
# Usage (from this repo root):
#   bash scripts/sync-skills-from-gemfort.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Cloning orbitratechnology/gemfort (shallow)..."
git clone --depth 1 https://github.com/orbitratechnology/gemfort.git "$TMP/gemfort"

SRC="$TMP/gemfort"

copy_dir() {
  local from="$1" to="$2"
  if [[ -d "$from" ]]; then
    mkdir -p "$to"
    rsync -a --delete "$from/" "$to/"
    echo "  synced $to"
  else
    echo "  skip missing $from"
  fi
}

echo "Syncing..."
copy_dir "$SRC/.agents/skills" "$ROOT/.agents/skills"
copy_dir "$SRC/.claude/skills" "$ROOT/.claude/skills"

cp -f "$SRC/.cursor/settings.json" "$ROOT/.cursor/settings.json"
cp -f "$SRC/.claude/settings.json" "$ROOT/.claude/settings.json"
cp -f "$SRC/.vscode/settings.json" "$ROOT/.vscode/settings.json"
cp -f "$SRC/.vscode/extensions.json" "$ROOT/.vscode/extensions.json"
cp -f "$SRC/AGENTS.md" "$ROOT/AGENTS.md"
cp -f "$SRC/CLAUDE.md" "$ROOT/CLAUDE.md"
cp -f "$SRC/skills-lock.json" "$ROOT/skills-lock.json"

echo "Done. Review with: git status"
