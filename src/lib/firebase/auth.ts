export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
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

import { getAuth as getAuthFn } from "./auth.native";

export function getFirebaseAuth() {
  return getAuthFn();
}

export function onAuthStateChanged(
  callback: (user: import("./auth-types").AuthUser | null) => void,
): () => void {
  return require("./auth.native").onAuthStateChanged(getAuthFn(), callback);
}

export async function signInWithEmail(email: string, password: string) {
  const { signInWithEmailAndPassword } = require("./auth.native");
  return signInWithEmailAndPassword(getAuthFn(), email.trim(), password);
}

export async function createUserWithEmail(email: string, password: string) {
  const { createUserWithEmailAndPassword } = require("./auth.native");
  return createUserWithEmailAndPassword(getAuthFn(), email.trim(), password);
}

export async function signOut() {
  const { signOut: signOutFn } = require("./auth.native");
  return signOutFn(getAuthFn());
}
