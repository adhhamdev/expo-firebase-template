# Push notifications

Stack: **expo-notifications** (device token) + optional FCM token stored on the user doc via `updateFcmToken`.

| Piece | Location |
|-------|----------|
| Channels + categories | `src/lib/notifications/categories.ts` |
| Permission + token + persist | `src/lib/notifications/register-push-token.ts` |
| Boot registrar | `src/providers/push-notification-registrar.tsx` |
| Config plugin | `expo-notifications` in `app.config.ts` |

## Behavior

- Requests permission after sign-in.
- Registers Android channels (`default`, `alerts`) and an interactive category.
- Stores native device push token on the user (for your backend / Cloud Functions to target).
- Foreground handler shows banner/list/sound/badge.

## Product wiring

- Map `notification.response` data → navigation in `PushNotificationRegistrar`.
- Send from Cloud Functions / FCM with matching channel IDs and category identifiers.
- iOS: physical device for remote push; enable push capability via EAS credentials.

## Security

Only authenticated users get token registration; rules should restrict who can write `fcmToken` fields (typically only the owner via client, or Admin SDK from Functions).
