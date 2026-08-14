import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import {
  GoogleOneTapSignIn,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from "react-native-nitro-google-signin";

import {
  AppleAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithCredential,
  signOut,
} from "@/lib/firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "@/lib/firebase/db";
import type { UserProfile } from "@/types";

export type SocialSignInResult = {
  user: { uid: string; email: string | null; displayName: string | null };
  profile: UserProfile;
  isNewProfile: boolean;
};

type ProfileIdentity = {
  email?: string | null;
  displayName?: string | null;
};

type PendingSocialRegistration = {
  provider: "google" | "apple";
  credential: Parameters<typeof signInWithCredential>[1];
  identity: ProfileIdentity;
};

/**
 * Thrown when federated sign-in succeeds but no Firestore profile exists yet.
 * Call `completePendingSocialRegistration()` after collecting any extra fields
 * (or call it immediately with no extras for a minimal profile).
 */
export class SocialRegistrationRequiredError extends Error {
  readonly code = "social/registration-required";

  constructor() {
    super("Complete registration to finish signing in.");
    this.name = "SocialRegistrationRequiredError";
  }
}

let googleConfigured = false;
let pendingSocialRegistration: PendingSocialRegistration | null = null;

function configureGoogle() {
  if (googleConfigured) return;
  // webClientId: 'autoDetect' reads the Web client ID from google-services.json
  GoogleOneTapSignIn.configure({ webClientId: "autoDetect" });
  googleConfigured = true;
}

function defaultDisplayName(identity: ProfileIdentity, fallback: string | null) {
  return identity.displayName?.trim() || fallback?.trim() || "User";
}

async function finishSocialSignIn(
  credential: Parameters<typeof signInWithCredential>[1],
  createProfile: boolean,
  identity: ProfileIdentity,
  provider: PendingSocialRegistration["provider"],
  extra?: Partial<UserProfile>,
): Promise<SocialSignInResult> {
  const auth = getFirebaseAuth();
  const result = await signInWithCredential(auth, credential);
  const user = result.user;
  const profileRef = doc(getFirebaseDb(), "users", user.uid);
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    const profile = { uid: user.uid, ...existing.data() } as UserProfile;
    await updateDoc(profileRef, {
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { user, profile, isNewProfile: false };
  }

  if (!createProfile) {
    pendingSocialRegistration = { provider, credential, identity };
    await signOut();
    throw new SocialRegistrationRequiredError();
  }

  const email =
    identity.email?.trim().toLowerCase() || user.email?.trim().toLowerCase();
  if (!email) {
    await signOut();
    throw new Error("Your provider did not return an email address.");
  }

  const profile = {
    uid: user.uid,
    email,
    displayName: defaultDisplayName(identity, user.displayName),
    phone: "",
    phoneVerified: false,
    fcmToken: null,
    createdAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...extra,
  };

  // Create profile before AuthProvider reacts to auth state (avoids orphan sessions).
  await setDoc(profileRef, profile);
  return {
    user,
    profile: { ...profile, createdAt: new Date().toISOString() } as UserProfile,
    isNewProfile: true,
  };
}

/**
 * Google One Tap / Credential Manager → Firebase credential.
 * Pass `createProfile: true` to auto-create a minimal users/{uid} doc on first sign-in.
 * Otherwise throws `SocialRegistrationRequiredError` so you can collect extras first.
 */
export async function signInWithGoogle(
  options: { createProfile?: boolean; extra?: Partial<UserProfile> } = {},
): Promise<SocialSignInResult> {
  configureGoogle();
  await GoogleOneTapSignIn.checkPlayServices(true);

  let response = await GoogleOneTapSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }
  if (!isSuccessResponse(response) || !response.data?.idToken) {
    throw new Error("Google Sign-In was cancelled or did not return an ID token.");
  }

  return finishSocialSignIn(
    GoogleAuthProvider.credential(response.data.idToken),
    options.createProfile ?? false,
    {
      email: response.data.user.email,
      displayName: response.data.user.name,
    },
    "google",
    options.extra,
  );
}

/** Apple Sign-In with nonce → Firebase credential. */
export async function signInWithApple(
  options: { createProfile?: boolean; extra?: Partial<UserProfile> } = {},
): Promise<SocialSignInResult> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
    { encoding: Crypto.CryptoEncoding.HEX },
  );
  const apple = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });
  if (!apple.identityToken) {
    throw new Error("Apple Sign-In did not return an identity token.");
  }

  const displayName = AppleAuthentication.formatFullName(
    apple.fullName ?? {
      namePrefix: null,
      givenName: null,
      middleName: null,
      familyName: null,
      nameSuffix: null,
      nickname: null,
    },
  );
  return finishSocialSignIn(
    AppleAuthProvider.credential(apple.identityToken, rawNonce),
    options.createProfile ?? false,
    { email: apple.email, displayName },
    "apple",
    options.extra,
  );
}

export function isSocialRegistrationRequired(
  error: unknown,
): error is SocialRegistrationRequiredError {
  return error instanceof SocialRegistrationRequiredError;
}

export function getPendingSocialRegistration() {
  return pendingSocialRegistration;
}

/** Finish a first-time social sign-in after collecting any extra profile fields. */
export async function completePendingSocialRegistration(
  extra?: Partial<UserProfile>,
) {
  const pending = pendingSocialRegistration;
  if (!pending) {
    throw new Error("The social registration session has expired. Please try again.");
  }

  const result = await finishSocialSignIn(
    pending.credential,
    true,
    pending.identity,
    pending.provider,
    extra,
  );
  pendingSocialRegistration = null;
  return result;
}

export async function reauthenticateWithGoogle() {
  configureGoogle();
  await GoogleOneTapSignIn.checkPlayServices(true);
  let response = await GoogleOneTapSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }
  if (!isSuccessResponse(response) || !response.data?.idToken) {
    throw new Error("Google Sign-In was cancelled or did not return an ID token.");
  }
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in to continue.");
  await reauthenticateWithCredential(
    user,
    GoogleAuthProvider.credential(response.data.idToken),
  );
}

export async function reauthenticateWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
    { encoding: Crypto.CryptoEncoding.HEX },
  );
  const apple = await AppleAuthentication.signInAsync({ nonce: hashedNonce });
  if (!apple.identityToken) {
    throw new Error("Apple Sign-In did not return an identity token.");
  }
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in to continue.");
  await reauthenticateWithCredential(
    user,
    AppleAuthProvider.credential(apple.identityToken, rawNonce),
  );
}
