export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as onAuthStateChangedNative,
  linkWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  getIdToken,
  EmailAuthProvider,
  GoogleAuthProvider,
  AppleAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  getAdditionalUserInfo,
} from "./auth.native";

export type { AuthUser } from "./auth-types";

import {
  getAuth,
  onAuthStateChanged as onAuthStateChangedNative,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "./auth.native";
import type { AuthUser } from "./auth-types";

export function getFirebaseAuth() {
  return getAuth();
}

export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChangedNative(getAuth(), callback);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email.trim(), password);
}

export async function createUserWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getAuth(), email.trim(), password);
}

export async function signOut() {
  return firebaseSignOut(getAuth());
}
