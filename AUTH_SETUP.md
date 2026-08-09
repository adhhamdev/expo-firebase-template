# Auth setup: Google · Apple · Phone (SMS + PNV)

This template includes production patterns for:

| Flow | Module | Notes |
|------|--------|-------|
| **Google** | `src/lib/firebase/social-auth` | `react-native-nitro-google-signin` One Tap / Credential Manager |
| **Apple** | `src/lib/firebase/social-auth` | `expo-apple-authentication` + nonce |
| **SMS OTP** | `src/lib/firebase/phone-auth` | Firebase Phone Auth → link credential |
| **PNV (instant)** | `src/lib/firebase/phone-pnv` | Android carrier verify → `linkVerifiedPhone` callable |

All require a **development build** (not Expo Go).

---

## 1. Firebase Authentication

Console → Authentication → Sign-in method:

1. Enable **Email/Password** (already assumed by login screens).
2. Enable **Google**.
3. Enable **Apple** (Services ID, Team ID, Key ID, private key from Apple Developer).
4. Enable **Phone** (for SMS OTP).

---

## 2. Google Sign-In

### Client

- Plugin: `react-native-nitro-google-signin` (in `app.config.ts`).
- `GoogleOneTapSignIn.configure({ webClientId: 'autoDetect' })` reads the **Web** OAuth client from `google-services.json`.

### Console / Cloud

1. Firebase project → create Android + iOS apps matching `app.config.ts` bundle IDs.
2. Register **SHA-1 and SHA-256** for every signing key:
   - local debug keystore
   - EAS credentials (`eas credentials -p android`)
   - Play upload key
   - Play App Signing key (Play Console → App integrity)
3. Download fresh `google-services.json` / `GoogleService-Info.plist` after fingerprints change.
4. Ensure a **Web client ID** exists (Firebase often creates it when Google sign-in is enabled).

### Usage

```ts
import {
  signInWithGoogle,
  isSocialRegistrationRequired,
  completePendingSocialRegistration,
} from '@/lib/firebase/social-auth';

try {
  // Auto-create minimal users/{uid} on first sign-in:
  await signInWithGoogle({ createProfile: true });
} catch (e) {
  if (isSocialRegistrationRequired(e)) {
    // Collect extras, then:
    await completePendingSocialRegistration({ displayName: '…' });
  } else throw e;
}
```

---

## 3. Apple Sign-In

1. Apple Developer → enable **Sign in with Apple** for each bundle ID (`dev` / `preview` / prod).
2. Create a Sign in with Apple **key** + **Services ID** for Firebase’s Apple provider.
3. Plugin: `expo-apple-authentication` (in `app.config.ts`).
4. Rebuild iOS after enabling the capability.

```ts
import { signInWithApple } from '@/lib/firebase/social-auth';
await signInWithApple({ createProfile: true });
```

---

## 4. Phone: PNV first, SMS fallback

**Recommended UX (Android):**

```ts
import { normalizePhoneNumber } from '@/lib/firebase/phone-utils';
import { savePhoneForVerification } from '@/lib/firebase/auth-service';
import { attemptPhoneNumberVerification } from '@/lib/firebase/phone-pnv';
import {
  sendPhoneVerificationCode,
  confirmPhoneVerificationCode,
} from '@/lib/firebase/phone-auth';

const e164 = await savePhoneForVerification(userTypedNumber);

const pnv = await attemptPhoneNumberVerification(e164);
if (pnv.status === 'verified') {
  // Auth + Firestore already updated by linkVerifiedPhone
  return;
}

// fallback-sms (iOS always lands here; Android when carrier/consent fails)
const verificationId = await sendPhoneVerificationCode(e164);
// show OTP UI…
await confirmPhoneVerificationCode(verificationId, codeFromUser);
```

### PNV Cloud Function

`functions/src/auth/link-verified-phone.ts` verifies the on-device JWT against Google’s FPNV JWKS, then sets Auth `phoneNumber` + `users/{uid}.phoneVerified`.

Set before deploy:

```bash
# Project number: Firebase Console → Project settings → General
firebase functions:config:set …  # or use params / .env in functions
```

Or edit placeholders in the file:

- `YOUR_FIREBASE_PROJECT_ID`
- `YOUR_PROJECT_NUMBER`

```bash
cd functions && npm install && npm run build
firebase deploy --only functions:linkVerifiedPhone
```

### PNV test mode (dev)

1. Firebase Console → Phone Number Verification test session → copy token.
2. `.env`:

```bash
EXPO_PUBLIC_FIREBASE_PNV_TEST_TOKEN=…
```

Uses SIM-less all-zero test numbers; see Firebase PNV docs.

### SMS test numbers

Authentication → Phone → Phone numbers for testing (no real SMS cost).

---

## 5. Rebuild

Native modules were added; OTA cannot enable them:

```bash
bun install
bun run build:dev:android
bun run build:dev:ios
```

---

## Files map

```text
src/lib/firebase/
  social-auth.ts / .native.ts   # Google + Apple
  phone-auth.ts / .native.ts    # SMS OTP link
  phone-pnv.ts / .native.ts     # Instant PNV
  phone-utils.ts                # E.164 normalize
  auth-service.ts               # updateFcmToken, savePhoneForVerification
functions/src/auth/
  link-verified-phone.ts        # Server JWT verify + link
```
