import { getApp } from "@react-native-firebase/app";
import {
  enableNetwork,
  getFirestore,
  initializeFirestore,
} from "@react-native-firebase/firestore";

let warmUpPromise: Promise<void> | null = null;

/**
 * Boot Firestore with offline persistence before any reads/writes.
 * RNFB enables persistence by default; we lock settings early to avoid races.
 * @see https://rnfirebase.io/firestore/usage#offline-capabilities
 */
export function warmUpFirestore(): Promise<void> {
  if (!warmUpPromise) {
    warmUpPromise = (async () => {
      try {
        await initializeFirestore(getApp(), { persistence: true });
      } catch {
        // Already initialized this process
      }
      try {
        await enableNetwork(getFirestore(getApp()));
      } catch {
        // Best-effort; offline cache still works
      }
    })();
  }
  return warmUpPromise;
}

export function initializeFirebase(): void {
  void warmUpFirestore();
}
