import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Single app identity — one Android package + one iOS bundle ID for all builds.
 * Search-replace these placeholders when you create a project.
 */
const APP_NAME = "YOUR_APP_NAME";
const APP_SLUG = "your-app";
const APP_SCHEME = "yourapp";
const PACKAGE_NAME = "app.yourapp";
const EAS_PROJECT_ID = "YOUR_EAS_PROJECT_ID";
const EXPO_OWNER = "your-org";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  version: "1.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  primaryColor: "#171717",
  backgroundColor: "#000000",
  scheme: APP_SCHEME,
  userInterfaceStyle: "automatic",
  buildCacheProvider: "eas",
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    bundleIdentifier: PACKAGE_NAME,
    supportsTablet: false,
    usesAppleSignIn: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist",
  },
  android: {
    package: PACKAGE_NAME,
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      backgroundColor: "#000000",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    icon: "./assets/images/icon.png",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-font",
    "expo-image",
    "expo-secure-store",
    "expo-status-bar",
    "expo-apple-authentication",
    "react-native-nitro-google-signin",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/app-check",
    "@react-native-vector-icons/material-icons",
    // Play package ownership verification — paste token into assets/adi-registration.properties
    "expo-adi-registration",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          forceStaticLinking: [
            "RNFBApp",
            "RNFBAuth",
            "RNFBAppCheck",
            "RNFBFirestore",
            "RNFBStorage",
          ],
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#000000",
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        dark: {
          backgroundColor: "#000000",
          image: "./assets/images/splash-icon.png",
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#3B82F6",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Allow access to photos to upload images.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
  owner: EXPO_OWNER,
});
