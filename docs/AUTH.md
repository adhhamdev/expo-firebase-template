# Auth: Email · Google · Apple · SMS · PNV · Account lifecycle

| Flow | Module |
|------|--------|
| Email login / register / lifecycle | `src/features/auth` |
| Google / Apple | `src/lib/firebase/social-auth` |
| SMS OTP | `src/lib/firebase/phone-auth` |
| PNV (Android) | `src/lib/firebase/phone-pnv` |
| Server PNV link | `functions/src/auth/link-verified-phone.ts` |

Requires a **development build** (not Expo Go).

## Console

1. Authentication → Email, Google, Apple, Phone.
2. Android + iOS apps with your single `PACKAGE_NAME`.
3. SHA-1 / SHA-256 for every Android signer → [SIGNING.md](./SIGNING.md).
4. Apple: Sign in with Apple capability + Firebase Apple provider keys.

## Account lifecycle helpers

Import from `@/features/auth`:

| Helper | Purpose |
|--------|---------|
| `loginWithEmail` | Sign in + ensure profile |
| `registerWithEmail` | Create user, profile, optional verification email |
| `logout` | Sign out |
| `requestPasswordReset` | Forgot-password email |
| `requestEmailVerification` | Resend verification |
| `reloadCurrentUser` | Refresh `emailVerified` etc. |
| `reauthenticate` / `reauthenticateWithEmail` | Required before sensitive ops |
| `changePassword` | Email/password accounts |
| `changeEmail` | Auth + Firestore email |
| `updateAccountProfile` | displayName / photoURL + Firestore |
| `deleteAccount` | Delete profile doc + Auth user |
| `getUserProfile` / `ensureUserProfile` | Firestore `users/{uid}` |

Social reauth: `reauthenticateWithGoogle` / `reauthenticateWithApple` in `@/lib/firebase/social-auth` (also via `reauthenticate({ method: 'google' | 'apple' })`).

Example:

```ts
import {
  registerWithEmail,
  loginWithEmail,
  requestPasswordReset,
  changePassword,
  deleteAccount,
} from '@/features/auth';

await registerWithEmail({ email, password, displayName: 'Ada' });
await loginWithEmail(email, password);
await requestPasswordReset(email);
await changePassword({ currentPassword, newPassword });
await deleteAccount({ method: 'password', password: currentPassword });
```

Sensitive operations may throw `auth/requires-recent-login` — call `reauthenticate` then retry.

## Phone UX

Android: **PNV first**, then SMS. iOS: SMS only.

```ts
const e164 = await savePhoneForVerification(input);
const pnv = await attemptPhoneNumberVerification(e164);
if (pnv.status === 'verified') return;
const id = await sendPhoneVerificationCode(e164);
await confirmPhoneVerificationCode(id, code);
```

Deploy `linkVerifiedPhone` after setting project placeholders in the function file.

## Rebuild

Native auth modules need a new binary after first enable — OTA is not enough.
