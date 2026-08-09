import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Android channels — extend as needed for your product. */
export const ANDROID_CHANNELS = {
  default: "default",
  alerts: "alerts",
} as const;

export const ANDROID_CHANNEL_ID = ANDROID_CHANNELS.default;

/** Interactive push categories — keep in sync with Cloud Functions if used. */
export const PUSH_CATEGORIES = {
  openRef: "open_ref",
} as const;

export async function ensureAndroidNotificationChannels() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNELS.default, {
    name: "App updates",
    importance: Notifications.AndroidImportance.DEFAULT,
    description: "General notifications",
  });

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNELS.alerts, {
    name: "Alerts & reminders",
    importance: Notifications.AndroidImportance.HIGH,
    description: "Important alerts and reminders",
    vibrationPattern: [0, 250, 120, 250],
  });
}

export async function registerNotificationCategories() {
  await Notifications.setNotificationCategoryAsync(PUSH_CATEGORIES.openRef, [
    {
      identifier: "view",
      buttonTitle: "View",
      options: { opensAppToForeground: true },
    },
  ]);
}
