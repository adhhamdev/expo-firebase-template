#!/usr/bin/env bash
# Deprecated alias: use install-agent-skills.sh (official Expo / Firebase / Vercel / Callstack).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Note: GemFort skills sync is replaced by official upstream skills."
echo "Running scripts/install-agent-skills.sh …"
bash "$ROOT/scripts/install-agent-skills.sh"
