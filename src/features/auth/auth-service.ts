/**
 * Domain helpers for auth-related Firestore profile work.
 * Keep screens thin; put business rules here.
 */
import { db, doc, getDoc, setDoc } from "@/lib/firebase/db";
import type { UserProfile } from "@/types";

export async function ensureUserProfile(
  uid: string,
  email: string
): Promise<UserProfile> {
  const ref = doc(db(), "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  const profile: UserProfile = {
    uid,
    email,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, profile);
  return profile;
}
