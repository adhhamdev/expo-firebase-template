/**
 * Domain helpers for auth + Firestore profile work.
 * Screens stay thin; call these for account lifecycle operations.
 */
import {
  createUserWithEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
  requireCurrentUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmail,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirebaseDb,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@/lib/firebase/db";
import {
  reauthenticateWithApple,
  reauthenticateWithGoogle,
} from "@/lib/firebase/social-auth";
import type { UserProfile } from "@/types";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function ensureUserProfile(
  uid: string,
  email: string,
  extra?: Partial<UserProfile>,
): Promise<UserProfile> {
  const ref = doc(getFirebaseDb(), "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { uid, ...snap.data() } as UserProfile;
  }
  const profile = {
    uid,
    email: normalizeEmail(email),
    displayName: extra?.displayName?.trim() || undefined,
    phone: extra?.phone ?? "",
    phoneVerified: extra?.phoneVerified ?? false,
    fcmToken: null as string | null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
    ...extra,
  };
  await setDoc(ref, profile);
  return {
    uid,
    email: profile.email,
    displayName: profile.displayName,
    phone: profile.phone,
    phoneVerified: profile.phoneVerified,
    fcmToken: null,
    createdAt: new Date().toISOString(),
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as UserProfile;
}

/** Email/password sign-in. */
export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmail(email, password);
  const uid = cred.user.uid;
  const profile = await ensureUserProfile(uid, cred.user.email ?? email);
  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    lastActiveAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).catch(() => undefined);
  return { user: cred.user, profile };
}

/**
 * Register with email/password, create Firestore profile, optionally verify email.
 */
export async function registerWithEmail(options: {
  email: string;
  password: string;
  displayName?: string;
  sendVerification?: boolean;
}) {
  const { email, password, displayName, sendVerification = true } = options;
  const cred = await createUserWithEmail(email, password);
  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  const profile = await ensureUserProfile(cred.user.uid, cred.user.email ?? email, {
    displayName: displayName?.trim(),
  });
  if (sendVerification) {
    await sendEmailVerification(cred.user).catch(() => undefined);
  }
  return { user: cred.user, profile };
}

export async function logout() {
  await signOut();
}

/** Send password-reset email (no signed-in user required). */
export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), normalizeEmail(email));
}

/** Resend verification email for the current user. */
export async function requestEmailVerification() {
  const user = requireCurrentUser();
  if (user.emailVerified) return;
  await sendEmailVerification(user);
}

/** Reload Auth user (e.g. after they verified email). */
export async function reloadCurrentUser() {
  const user = requireCurrentUser();
  await reload(user);
  return getFirebaseAuth().currentUser;
}

/** Reauthenticate with email/password (required before sensitive changes). */
export async function reauthenticateWithEmail(password: string) {
  const user = requireCurrentUser();
  const email = user.email;
  if (!email) {
    throw new Error("This account has no email/password credential.");
  }
  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, credential);
}

export type ReauthMethod = "password" | "google" | "apple";

/**
 * Reauthenticate using the method that matches how the user signed in.
 * Call before change password, change email, or delete account when required.
 */
export async function reauthenticate(options: {
  method: ReauthMethod;
  password?: string;
}) {
  if (options.method === "password") {
    if (!options.password) throw new Error("Password is required.");
    await reauthenticateWithEmail(options.password);
    return;
  }
  if (options.method === "google") {
    await reauthenticateWithGoogle();
    return;
  }
  await reauthenticateWithApple();
}

/** Change password (email/password accounts). Reauth first when Firebase requires it. */
export async function changePassword(options: {
  currentPassword: string;
  newPassword: string;
}) {
  await reauthenticateWithEmail(options.currentPassword);
  const user = requireCurrentUser();
  await updatePassword(user, options.newPassword);
}

/** Update email on Auth + Firestore profile. Reauth first. */
export async function changeEmail(options: {
  currentPassword: string;
  newEmail: string;
}) {
  await reauthenticateWithEmail(options.currentPassword);
  const user = requireCurrentUser();
  const next = normalizeEmail(options.newEmail);
  await updateEmail(user, next);
  await updateDoc(doc(getFirebaseDb(), "users", user.uid), {
    email: next,
    updatedAt: serverTimestamp(),
  });
  await sendEmailVerification(user).catch(() => undefined);
}

/** Update Auth displayName / photoURL and mirror to Firestore. */
export async function updateAccountProfile(options: {
  displayName?: string;
  photoURL?: string | null;
  extra?: Partial<UserProfile>;
}) {
  const user = requireCurrentUser();
  const authUpdates: { displayName?: string; photoURL?: string | null } = {};
  if (options.displayName !== undefined) {
    authUpdates.displayName = options.displayName.trim();
  }
  if (options.photoURL !== undefined) {
    authUpdates.photoURL = options.photoURL;
  }
  if (Object.keys(authUpdates).length > 0) {
    await updateProfile(user, authUpdates);
  }

  const firestoreUpdates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
    ...options.extra,
  };
  if (options.displayName !== undefined) {
    firestoreUpdates.displayName = options.displayName.trim();
  }
  await updateDoc(doc(getFirebaseDb(), "users", user.uid), firestoreUpdates);
}

/**
 * Delete Auth user and best-effort remove users/{uid}.
 * Pass reauth credentials when Firebase returns requires-recent-login.
 */
export async function deleteAccount(options?: {
  method?: ReauthMethod;
  password?: string;
}) {
  const user = requireCurrentUser();
  const uid = user.uid;

  if (options?.method) {
    await reauthenticate({
      method: options.method,
      password: options.password,
    });
  }

  try {
    await deleteDoc(doc(getFirebaseDb(), "users", uid));
  } catch {
    // Profile may already be gone or rules may block client delete — Auth delete still proceeds.
  }

  await deleteUser(requireCurrentUser());
}
