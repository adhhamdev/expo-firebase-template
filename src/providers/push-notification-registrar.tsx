import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import {
  ensureAndroidNotificationChannels,
  registerNotificationCategories,
} from "@/lib/notifications/categories";
import { registerPushTokenForUser } from "@/lib/notifications/register-push-token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registers the device for push when a user is signed in, and sets up
 * Android channels + interactive categories once at mount.
 * Drop domain-specific rich rendering / action handlers here when needed.
 */
export function PushNotificationRegistrar() {
  const { user } = useAuth();

  useEffect(() => {
    void ensureAndroidNotificationChannels();
    void registerNotificationCategories();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    void registerPushTokenForUser(user.uid).catch(() => {
      // Non-fatal: permission denied or simulator without push support.
    });
  }, [user?.uid]);

  useEffect(() => {
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      () => {
        // Wire navigation from notification data in your product code.
      },
    );
    return () => responseSub.remove();
  }, []);

  return null;
}
