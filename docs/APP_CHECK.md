# App Check + Play ADI

| Mode | Android | iOS |
|------|---------|-----|
| `__DEV__` or debug token set | `debug` | `debug` |
| Release (no debug token) | `playIntegrity` | `appAttestWithDeviceCheckFallback` |

Activated in `warmUpFirestore()` via `src/lib/firebase/app-check.native.ts`.

1. Console → App Check → register apps → enable Play Integrity / App Attest.
2. Generate a **debug token** → `.env` / EAS development+preview as `EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN`.
3. **Never** put the debug token on production builds.
4. Enforce only after release attestation works.

## Play `adi-registration.properties`

When Play asks for package ownership verification:

1. Paste token into `assets/adi-registration.properties`.
2. Plugin `expo-adi-registration` copies it into Android assets at prebuild.
3. Rebuild Android.
