import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

initializeApp();

// TODO: set your preferred region
setGlobalOptions({ region: "asia-south1" });

export { linkVerifiedPhone } from "./auth/link-verified-phone";

/** Example callable — replace with real domain functions */
export const healthCheck = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in required");
  }
  return {
    ok: true,
    uid: request.auth.uid,
    at: new Date().toISOString(),
  };
});

/** Example scheduled job stub */
export const dailyMaintenance = onSchedule("every day 03:00", async () => {
  console.log("dailyMaintenance tick");
});
