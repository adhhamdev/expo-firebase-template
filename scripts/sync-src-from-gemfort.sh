#!/usr/bin/env bash
# Sync reusable UI, providers, hooks, and Firebase client libs from
# orbitratechnology/gemfort into this template.
# Prefer the GitHub Action: Actions → "Sync template source from gemfort patterns".
#
# Local usage (from repo root):
#   bash scripts/sync-src-from-gemfort.sh
# Optional private clone:
#   GEMFORT_TOKEN=ghp_... bash scripts/sync-src-from-gemfort.sh
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

cp "$SRC/babel.config.js" "$ROOT/"
cp "$SRC/metro.config.js" "$ROOT/"
cp "$SRC/tsconfig.json" "$ROOT/"
cp "$SRC/eslint.config.js" "$ROOT/"
cp "$SRC/jest.config.js" "$ROOT/"
cp "$SRC/.fingerprintignore" "$ROOT/" 2>/dev/null || true
cp "$SRC/.gitattributes" "$ROOT/" 2>/dev/null || true

mkdir -p \
  "$ROOT/src/components/ui" \
  "$ROOT/src/providers" \
  "$ROOT/src/hooks" \
  "$ROOT/src/lib/firebase" \
  "$ROOT/src/lib/notifications" \
  "$ROOT/src/constants"

# Base + extra form/sheet UI (generic, not domain-specific)
for f in \
  button.tsx input.tsx screen.tsx card.tsx elevated-card.tsx empty-state.tsx \
  loading-overlay.tsx confirm-dialog.tsx form-section.tsx form-footer.tsx \
  skeleton-list.tsx stack-header.tsx collapsible.tsx chip-select.tsx icon.tsx \
  bottom-sheet.tsx action-sheet.tsx masked-input.tsx phone-number-field.tsx \
  media-field.tsx media-album-field.tsx city-field.tsx country-field.tsx \
  country-flag.tsx country-picker-sheet.tsx city-picker-sheet.tsx \
  currency-amount-field.tsx currency-picker-sheet.tsx; do
  if [ -f "$SRC/src/components/ui/$f" ]; then
    cp "$SRC/src/components/ui/$f" "$ROOT/src/components/ui/$f"
  fi
done

if [ -f "$ROOT/src/components/ui/icon.tsx" ]; then
  sed -i.bak 's/GemFort/App/g' "$ROOT/src/components/ui/icon.tsx" 2>/dev/null || \
    sed -i '' 's/GemFort/App/g' "$ROOT/src/components/ui/icon.tsx" 2>/dev/null || true
  rm -f "$ROOT/src/components/ui/icon.tsx.bak"
fi

for f in \
  query-provider.tsx theme-provider.tsx loading-provider.tsx \
  confirm-provider.tsx toast-provider.tsx biometric-lock-provider.tsx; do
  if [ -f "$SRC/src/providers/$f" ]; then
    cp "$SRC/src/providers/$f" "$ROOT/src/providers/$f"
  fi
done

for f in \
  use-app-theme.ts use-color-scheme.ts use-theme.ts use-theme-styles.ts \
  use-reduce-motion.ts use-debounced-value.ts use-firestore-live-query.ts; do
  if [ -f "$SRC/src/hooks/$f" ]; then
    cp "$SRC/src/hooks/$f" "$ROOT/src/hooks/$f"
  fi
done

for f in haptics.ts theme-preference.ts errors.ts utils.ts alert.ts; do
  if [ -f "$SRC/src/lib/$f" ]; then
    cp "$SRC/src/lib/$f" "$ROOT/src/lib/$f"
  fi
done
sed -i.bak 's/gemfort_theme_preference/app_theme_preference/g' "$ROOT/src/lib/theme-preference.ts" 2>/dev/null || \
  sed -i '' 's/gemfort_theme_preference/app_theme_preference/g' "$ROOT/src/lib/theme-preference.ts" 2>/dev/null || true
rm -f "$ROOT/src/lib/theme-preference.ts.bak"
sed -i.bak 's/GemFort/App/g' "$ROOT/src/lib/haptics.ts" 2>/dev/null || \
  sed -i '' 's/GemFort/App/g' "$ROOT/src/lib/haptics.ts" 2>/dev/null || true
rm -f "$ROOT/src/lib/haptics.ts.bak"

for f in \
  init.ts init.native.ts config.ts config.native.ts firebase-config.ts \
  auth.native.ts auth-types.ts auth-types.native.ts db.ts db.native.ts \
  call-function.ts storage-service.ts messaging.ts functions-region.ts \
  local-write.ts; do
  if [ -f "$SRC/src/lib/firebase/$f" ]; then
    cp "$SRC/src/lib/firebase/$f" "$ROOT/src/lib/firebase/$f"
  fi
done

cp "$SRC/src/constants/design-tokens.ts" "$ROOT/src/constants/design-tokens.ts"
[ -f "$SRC/src/constants/theme.ts" ] && cp "$SRC/src/constants/theme.ts" "$ROOT/src/constants/theme.ts"

if [ -f "$SRC/src/lib/notifications/register-push-token.ts" ]; then
  cp "$SRC/src/lib/notifications/register-push-token.ts" "$ROOT/src/lib/notifications/"
fi
if [ -f "$SRC/src/lib/notifications/categories.ts" ]; then
  cp "$SRC/src/lib/notifications/categories.ts" "$ROOT/src/lib/notifications/"
fi

echo "Synced file counts:"
find "$ROOT/src/components/ui" "$ROOT/src/providers" "$ROOT/src/hooks" "$ROOT/src/lib" -type f | wc -l
echo "Done. Review with: git status"
