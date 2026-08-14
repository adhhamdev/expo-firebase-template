# Android / iOS signing & SHA fingerprints

Google Sign-In and some Firebase features require **SHA-1** and **SHA-256** of every key that signs the app.

## One package, many signers

This template uses a **single** package/bundle ID. You still need fingerprints for:

| Signer | When |
|--------|------|
| Local **debug** keystore | `expo run:android` / Android Studio |
| **EAS** credentials | Cloud builds (`eas credentials -p android`) |
| **Play App Signing** | Store installs (Play Console → App integrity) |

## Automated (local debug)

```bash
bun run signing:fingerprints
```

Prints SHA-1 and SHA-256 for `~/.android/debug.keystore`.

Custom keystore:

```bash
node scripts/print-android-fingerprints.mjs --keystore ./path.jks --alias YOUR_ALIAS
# optional: --storepass … --keypass …
```

Paste both hashes into Firebase → Project settings → Android app → **Add fingerprint**, then:

```bash
bun run firebase:sync
```

## EAS credentials (recommended)

Prefer **EAS-managed** credentials — do not commit keystores.

```bash
eas credentials -p android
# Download credentials if you need the SHA values offline, or read them from the EAS UI
```

Add those fingerprints to Firebase the same way.

## Play App Signing

Play Console → **App integrity** → App signing key certificate → copy SHA-1 / SHA-256 → Firebase.

## iOS

No SHA fingerprints. Use the correct bundle ID, Apple Team, and (for Apple Sign-In) capability + Firebase Apple provider keys. Signing is managed by EAS or Xcode.

## Security

- Never commit `*.jks`, `*.keystore`, `credentials.json`, or provisioning profiles (see `.gitignore`).
- Prefer EAS remote credentials over local `credentials.json`.
