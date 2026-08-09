/**
 * Shared Firebase Auth + profile helpers used by providers and push registration.
 * Feature-specific auth flows live under src/features/auth/.
 */
import { getIdToken } from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config";
import {
  doc,
  getFirebaseDb,
  serverTimestamp,
  updateDoc,
} from "@/lib/firebase/db";
import { normalizePhoneNumber } from "@/lib/firebase/phone-utils";

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

/**
 * Save a phone number selected by the user before SMS/PNV proof.
 * Marks phoneVerified false until OTP or PNV completes.
 */
export async function savePhoneForVerification(phone: string) {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in to add a phone number.");
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
    throw new Error("Enter a valid mobile number with country code.");
  }

  await updateDoc(doc(getFirebaseDb(), "users", user.uid), {
    phone: normalizedPhone,
    phoneVerified: false,
    updatedAt: serverTimestamp(),
  });
  return normalizedPhone;
}
