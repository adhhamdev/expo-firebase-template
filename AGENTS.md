# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Project conventions

- Feature-based folders under `src/features/<domain>/`.
- Screens in `src/app/` stay thin; business logic lives in features.
- Use path aliases `@/` and `@/assets/`.
- Prefer React Native Firebase for Auth/Firestore/Storage on native.
- Never assume Expo Go — this template requires a development build.
- Keep secrets out of git; use `.env` and EAS secrets.
