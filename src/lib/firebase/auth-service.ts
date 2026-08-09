/**
 * Shared Firebase Auth + profile helpers used by providers and push registration.
 * Feature-specific auth flows live under src/features/auth/.
 */
import { getIdToken } from "@react-native-firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/config";
import { doc, getFirebaseDb, updateDoc, serverTimestamp } from "@/lib/firebase/db";

/**
 * Persist the device push token on the user document.
 * Ensures a fresh Auth ID token is attached before the Firestore write so
 * registration does not race auth restore on Android (permission-denied).
 */
export async function updateFcmToken(uid: string, token: string | null) {
  const auth = getFirebaseAuth();
  const current = auth.currentUser;
  if (!current || current.uid !== uid) {
    throw new Error("Not signed in as the target user");
  }
  await getIdToken(current);

  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    fcmToken: token,
    updatedAt: serverTimestamp(),
  });
}
