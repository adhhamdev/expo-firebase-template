# Security Policy

## Supported versions

This template tracks **Expo SDK 57** and the dependency versions pinned in `package.json`. Security fixes for the template itself are applied on the default branch.

## Reporting a vulnerability

Please **do not** open a public issue for security problems in this repository.

Email or contact: [https://adhham.dev](https://adhham.dev) (use the site’s preferred contact method) and include:

- Description of the issue
- Steps to reproduce
- Affected files or dependency versions if known

You will receive an acknowledgment when possible. Please allow reasonable time before any public disclosure.

## For apps built from this template

- Never commit `.env`, Google Services files, or keystores (see `.gitignore`)
- Treat `EXPO_PUBLIC_*` as public
- Enforce authorization in Firestore/Storage rules and Cloud Functions
- See [docs/SECURITY.md](./docs/SECURITY.md) for the security baseline
