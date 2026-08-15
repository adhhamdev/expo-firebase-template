# Security baseline

| Secret | Where |
|--------|--------|
| Firebase web config | `.env` (gitignored) / EAS env |
| `google-services.json` / `GoogleService-Info.plist` | Project **root** (gitignored) or EAS **file** env `GOOGLE_SERVICES_*` |
| App Check debug token | `.env` / EAS **development & preview only** — never production |
| Keystores / certs | EAS credentials — never git |
| Service account keys | Firebase / Play CI only — never client |

## Rules

- Start with default-deny Firestore / Storage rules; open paths per feature with Auth + App Check in mind.
- Prefer App Check enforcement in production once providers are stable.
- Never commit real Google Services files, `.env`, or keystores.
- Report vulnerabilities: open a private security advisory or email the maintainer listed in the README.
