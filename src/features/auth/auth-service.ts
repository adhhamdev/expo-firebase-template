/**
 * Domain helpers for auth-related Firestore profile work.
 * Keep screens thin; put business rules here.
 */
import {
  doc,
  getDoc,
  getFirebaseDb,
  serverTimestamp,
  setDoc,
} from "@/lib/firebase/db";
import type { UserProfile } from "@/types";

export async function ensureUserProfile(
  uid: string,
  email: string,
): Promise<UserProfile> {
  const ref = doc(getFirebaseDb(), "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { uid, ...snap.data() } as UserProfile;
  }
  const profile = {
    uid,
    email: email.trim().toLowerCase(),
    fcmToken: null as string | null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return {
    uid,
    email: profile.email,
    createdAt: new Date().toISOString(),
  };
}
