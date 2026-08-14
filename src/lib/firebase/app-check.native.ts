import { getApp } from "@react-native-firebase/app";
import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from "@react-native-firebase/app-check";

let appCheckPromise: Promise<void> | null = null;

/**
 * Activate Firebase App Check once per process.
 *
 * - Dev / when EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN is set → debug provider
 * - Release builds without a debug token → Play Integrity (Android) /
 *   App Attest with DeviceCheck fallback (iOS)
 *
 * Register debug tokens in Firebase Console → App Check → Manage debug tokens.
 * @see https://rnfirebase.io/app-check/usage
 */
export function activateAppCheck(): Promise<void> {
  if (!appCheckPromise) {
    appCheckPromise = (async () => {
      const debugToken =
        process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN?.trim() ||
        undefined;
      const useDebug = __DEV__ || Boolean(debugToken);

      const provider = new ReactNativeFirebaseAppCheckProvider();
      provider.configure({
        android: {
          provider: useDebug ? "debug" : "playIntegrity",
          ...(debugToken ? { debugToken } : {}),
        },
        apple: {
          provider: useDebug ? "debug" : "appAttestWithDeviceCheckFallback",
          ...(debugToken ? { debugToken } : {}),
        },
      });

      await initializeAppCheck(getApp(), {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
    })();
  }
  return appCheckPromise;
}
