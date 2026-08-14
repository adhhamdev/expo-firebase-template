# Auth setup: Google · Apple · Phone (SMS + PNV)

| Flow | Module | Notes |
|------|--------|-------|
| **Google** | `src/lib/firebase/social-auth` | One Tap / Credential Manager |
| **Apple** | `src/lib/firebase/social-auth` | `expo-apple-authentication` + nonce |
| **SMS OTP** | `src/lib/firebase/phone-auth` | Firebase Phone Auth |
| **PNV (instant)** | `src/lib/firebase/phone-pnv` | Android → `linkVerifiedPhone` callable |

Requires a **development build** (not Expo Go).

This template uses a **single** package/bundle ID (`app.yourapp` by default) for all builds.

---

## 1. Firebase Authentication

Console → Authentication → Sign-in method:

1. Enable **Email/Password**.
2. Enable **Google**.
3. Enable **Apple** (Services ID, Team ID, Key ID, private key from Apple Developer).
4. Enable **Phone** (SMS OTP).

---

## 2. Google Sign-In

1. One Android + one iOS app in Firebase with package/bundle `app.yourapp`.
2. Register **SHA-1 and SHA-256** for every signing key you use:
   - local debug keystore
   - EAS credentials (`eas credentials -p android`)
   - Play upload / App Signing keys (when you ship)
3. Download fresh `google-services.json` after fingerprints change (`bun run firebase:sync`).
4. Ensure a **Web client ID** exists (usually created when Google sign-in is enabled).

```ts
import {
  signInWithGoogle,
  isSocialRegistrationRequired,
  completePendingSocialRegistration,
} from '@/lib/firebase/social-auth';

try {
  await signInWithGoogle({ createProfile: true });
} catch (e) {
  if (isSocialRegistrationRequired(e)) {
    await completePendingSocialRegistration({ displayName: '…' });
  } else throw e;
}
```

---

## 3. Apple Sign-In

1. Apple Developer → enable **Sign in with Apple** for your single bundle ID.
2. Create a Sign in with Apple **key** + **Services ID** for Firebase’s Apple provider.
3. Rebuild iOS after enabling the capability.

```ts
import { signInWithApple } from '@/lib/firebase/social-auth';
await signInWithApple({ createProfile: true });
```

---

## 4. Phone: PNV first, SMS fallback

**Android:** try PNV, then SMS. **iOS:** SMS only.

```ts
import { savePhoneForVerification } from '@/lib/firebase/auth-service';
import { attemptPhoneNumberVerification } from '@/lib/firebase/phone-pnv';
import {
  sendPhoneVerificationCode,
  confirmPhoneVerificationCode,
} from '@/lib/firebase/phone-auth';

const e164 = await savePhoneForVerification(userTypedNumber);
const pnv = await attemptPhoneNumberVerification(e164);
if (pnv.status === 'verified') return;

const verificationId = await sendPhoneVerificationCode(e164);
await confirmPhoneVerificationCode(verificationId, codeFromUser);
```

### Cloud Function

`functions/src/auth/link-verified-phone.ts` — set project id / number placeholders, then:

```bash
cd functions && npm install && npm run build
firebase deploy --only functions:linkVerifiedPhone
```

### Test mode

- PNV: Console test token → `EXPO_PUBLIC_FIREBASE_PNV_TEST_TOKEN` in `.env`
- SMS: Authentication → Phone → Phone numbers for testing

---

## 5. Rebuild

```bash
bun install
bun run build:dev:android
bun run build:dev:ios
```

Native auth modules cannot be enabled via OTA alone.

---

## Files

```text
src/lib/firebase/
  social-auth.ts / .native.ts
  phone-auth.ts / .native.ts
  phone-pnv.ts / .native.ts
  phone-utils.ts
  auth-service.ts
functions/src/auth/link-verified-phone.ts
```
