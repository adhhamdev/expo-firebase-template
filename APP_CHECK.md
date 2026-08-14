# Firebase App Check + Play ADI registration

Wired in this template so you do not re-implement it per app.

---

## App Check

| Build | Android provider | iOS provider |
|-------|------------------|--------------|
| `__DEV__` **or** debug token set | `debug` | `debug` |
| Release (no debug token) | `playIntegrity` | `appAttestWithDeviceCheckFallback` |

Activation runs in `warmUpFirestore()` via `src/lib/firebase/app-check.native.ts` **before** Firestore use.

### Console setup

1. Firebase Console → **App Check** → register your Android + iOS apps.
2. Android: enable **Play Integrity**.
3. iOS: enable **App Attest** (and DeviceCheck as needed).
4. **Do not** turn on enforcement until debug tokens work and a release build attests successfully.

### Debug token (simulators / emulators / CI)

1. App Check → your app → **Manage debug tokens** → **Generate** (or add a token from device logs).
2. Local `.env`:

```bash
EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

3. EAS: replace `YOUR_APP_CHECK_DEBUG_TOKEN` in `eas.json` under **development** and **preview** profiles (or set the same name in EAS project env). **Production profile must not set this.**

Rebuild the native binary after adding the module or changing native env (OTA is not enough the first time).

### Files

```text
src/lib/firebase/app-check.native.ts   # provider config + initializeAppCheck
src/lib/firebase/init.native.ts        # activateAppCheck() then Firestore
app.config.ts                          # @react-native-firebase/app-check + RNFBAppCheck linking
```

---

## Play Console `adi-registration.properties`

Google Play may ask you to prove package ownership by shipping a signed APK that contains `adi-registration.properties` under the **native Android assets** folder.

### Template wiring

1. Play Console → App integrity / package name verification → copy the token.
2. Put it in `assets/adi-registration.properties` (replace the placeholder line).
3. Plugin `expo-adi-registration` (in `app.config.ts`) copies that file into `android/app/src/main/assets/` at prebuild.

```text
assets/adi-registration.properties
```

Rebuild Android after changing the token. You can leave the placeholder until Play asks for verification.
