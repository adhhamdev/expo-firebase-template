import { getApp } from "@react-native-firebase/app";
import {
  enableNetwork,
  getFirestore,
  initializeFirestore,
} from "@react-native-firebase/firestore";
import { activateAppCheck } from "./app-check";

let warmUpPromise: Promise<void> | null = null;

/**
 * Boot App Check (when configured) then Firestore with offline persistence
 * before any reads/writes.
 *
 * RNFB: native persistence is on by default; we call `initializeFirestore`
 * explicitly so settings are locked with persistence enabled before the first
 * `getFirestore` / query (avoids "settings can no longer be changed" races).
 * @see https://rnfirebase.io/firestore/usage#offline-capabilities
 * @see https://rnfirebase.io/app-check/usage
 */
export function warmUpFirestore(): Promise<void> {
  if (!warmUpPromise) {
    warmUpPromise = (async () => {
      try {
        await activateAppCheck();
      } catch {
        // App Check optional until enforcement is turned on in Console.
      }
      try {
        await initializeFirestore(getApp(), { persistence: true });
      } catch {
        // Already initialized this process — keep existing settings.
      }
      try {
        await enableNetwork(getFirestore(getApp()));
      } catch {
        // Network enable is best-effort; offline cache still works.
      }
    })();
  }
  return warmUpPromise;
}

/** @deprecated Use warmUpFirestore() — kept for callers that expect a sync hook. */
export function initializeFirebase(): void {
  void warmUpFirestore();
}
