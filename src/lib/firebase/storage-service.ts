/**
 * Storage helpers — install expo-image-manipulator / expo-document-picker when you need
 * client-side resize or document pick, then expand this module.
 */
import { getFirebaseAuth } from "@/lib/firebase/config";

export function requireSignedInUid() {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in to upload.");
  return user.uid;
}
