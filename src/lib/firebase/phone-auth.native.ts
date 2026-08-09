import {
  linkWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";

import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";
import { doc, serverTimestamp, updateDoc } from "@/lib/firebase/db";

/**
 * Start Firebase Phone Auth SMS OTP.
 * Returns the verificationId used with `confirmPhoneVerificationCode`.
 *
 * Prefer calling this only after PNV (`attemptPhoneNumberVerification`) returns
 * `fallback-sms`, so users on supported Android carriers get instant verify.
 */
export async function sendPhoneVerificationCode(
  phoneE164: string,
): Promise<string> {
  const confirmation = await signInWithPhoneNumber(
    getFirebaseAuth(),
    phoneE164,
  );
  if (!confirmation.verificationId) {
    throw new Error("Phone verification could not be started.");
  }
  return confirmation.verificationId;
}

/**
 * Confirm SMS OTP and link the phone credential to the current user.
 * Updates users/{uid} with phone + phoneVerified.
 */
export async function confirmPhoneVerificationCode(
  verificationId: string,
  code: string,
): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in to verify your phone.");

  const credential = PhoneAuthProvider.credential(verificationId, code);
  await linkWithCredential(user, credential);

  await updateDoc(doc(getFirebaseDb(), "users", user.uid), {
    phone: user.phoneNumber ?? "",
    phoneVerified: true,
    updatedAt: serverTimestamp(),
  });
}

/** Dev helper: mark phone verified without SMS (never ship to production flows). */
export async function skipPhoneVerificationForDev(
  uid: string,
  phone?: string,
): Promise<void> {
  if (!__DEV__) {
    throw new Error("skipPhoneVerificationForDev is only available in development.");
  }
  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    phone: phone || "",
    phoneVerified: true,
    updatedAt: serverTimestamp(),
  });
}
