import {
  getAuth,
  onAuthStateChanged as onAuthStateChangedRn,
  signInWithEmailAndPassword as signInRn,
  createUserWithEmailAndPassword as createUserRn,
  signOut as signOutRn,
  type FirebaseAuthTypes,
} from "@react-native-firebase/auth";

export type AuthUser = FirebaseAuthTypes.User;

export function getFirebaseAuth() {
  return getAuth();
}

export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChangedRn(getAuth(), callback);
}

export async function signInWithEmail(email: string, password: string) {
  return signInRn(getAuth(), email.trim(), password);
}

export async function createUserWithEmail(email: string, password: string) {
  return createUserRn(getAuth(), email.trim(), password);
}

export async function signOut() {
  return signOutRn(getAuth());
}
