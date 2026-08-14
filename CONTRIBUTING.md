# Contributing

Thanks for improving this template.

## Development

```bash
bun install
bun run typecheck
bun run lint
bun run test
```

Use a **development build** (not Expo Go) when testing Firebase native modules.

## Guidelines

1. Keep the template **product-agnostic** — no hard-coded app brands, keys, or domain features.
2. Prefer placeholders and scripts over one-off manual steps.
3. Document new setup steps under `docs/` and link them from the README.
4. Do not commit secrets, Google Services files, or signing material.
5. Match existing structure: `src/features/`, `src/lib/firebase/`, platform `.native.ts` files where needed.

## Pull requests

- Clear description of the problem and solution
- Note any required native rebuild or new env vars
- Keep scope focused

## License

By contributing, you agree your contributions are licensed under the MIT License (see [LICENSE](./LICENSE)).
