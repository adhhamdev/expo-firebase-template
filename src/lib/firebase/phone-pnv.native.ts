import {
  enableTestSession,
  getVerificationSupportInfo,
  getVerifiedPhoneNumber,
} from "@react-native-firebase/phone-number-verification";
import { Platform } from "react-native";

import { callFunction } from "@/lib/firebase/call-function";
import { normalizePhoneNumber } from "@/lib/firebase/phone-utils";

const TEST_TOKEN = process.env.EXPO_PUBLIC_FIREBASE_PNV_TEST_TOKEN;
let testSessionEnabled = false;
let testSessionAttempted = false;

/**
 * Dev-only: activates the Firebase Console Phone Number Verification test
 * session (SIM-less). No-op outside __DEV__ or when the env token is unset.
 */
async function enablePnvTestSessionIfConfigured(): Promise<{ enabled: boolean }> {
  if (!__DEV__ || !TEST_TOKEN) return { enabled: false };
  if (testSessionEnabled) return { enabled: true };
  if (testSessionAttempted) return { enabled: false };
  testSessionAttempted = true;
  try {
    await enableTestSession(TEST_TOKEN);
    testSessionEnabled = true;
    return { enabled: true };
  } catch (error) {
    if (errorCode(error) === "pnv/test-session-already-enabled") {
      testSessionEnabled = true;
      return { enabled: true };
    }
    console.warn(
      "[PNV] Test session enable failed; using real SIM check.",
      errorCode(error),
    );
    return { enabled: false };
  }
}

export type PhoneVerificationAttempt =
  | { status: "verified"; phoneNumber: string }
  | { status: "fallback-sms" };

/**
 * Try Firebase Phone Number Verification (carrier / Play Services, Android).
 *
 * - On success: server `linkVerifiedPhone` callable links Auth + Firestore.
 * - On any failure/unsupported: returns `{ status: 'fallback-sms' }` so the
 *   caller can run SMS OTP (`sendPhoneVerificationCode`).
 * - Throws only when the number is already linked to another account.
 */
export async function attemptPhoneNumberVerification(
  expectedPhone: string,
): Promise<PhoneVerificationAttempt> {
  try {
    return await withTimeout(runPnvAttempt(expectedPhone), 15_000);
  } catch (error) {
    if (errorCode(error) === "functions/already_exists") {
      throw new Error(
        "That mobile number is already linked to another account.",
      );
    }
    return { status: "fallback-sms" };
  }
}

async function runPnvAttempt(
  expectedPhone: string,
): Promise<PhoneVerificationAttempt> {
  if (Platform.OS !== "android") {
    return { status: "fallback-sms" };
  }

  const { enabled: testMode } = await enablePnvTestSessionIfConfigured();
  if (!testMode) {
    let support;
    try {
      support = await getVerificationSupportInfo();
    } catch {
      return { status: "fallback-sms" };
    }
    if (!support.some((slot) => slot.isSupported)) {
      return { status: "fallback-sms" };
    }
  }

  let result;
  try {
    // Android consent dialog — prepare the user in UI before calling.
    result = await getVerifiedPhoneNumber();
  } catch {
    return { status: "fallback-sms" };
  }

  if (!testMode) {
    const verified = normalizePhoneNumber(result.phoneNumber);
    const expected = normalizePhoneNumber(expectedPhone);
    if (expected && verified !== expected) {
      return { status: "fallback-sms" };
    }
  }

  const { phoneNumber } = await callFunction<
    { phoneNumber: string },
    { token: string }
  >("linkVerifiedPhone", { token: result.token });
  return { status: "verified", phoneNumber };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("pnv/timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function errorCode(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code ?? "")
    : "";
}
