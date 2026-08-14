# Auth: Email · Google · Apple · SMS · PNV

| Flow | Module |
|------|--------|
| Email | `src/lib/firebase/auth` |
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
