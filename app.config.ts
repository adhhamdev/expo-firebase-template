import type { ConfigContext, ExpoConfig } from "expo/config";

const env = process.env.EXPO_PUBLIC_APP_ENV ?? "development";

const bundleIds: Record<string, string> = {
  development: "app.yourapp.dev",
  preview: "app.yourapp.preview",
  production: "app.yourapp",
};

const bundleId = bundleIds[env] ?? bundleIds.development;

/** Native Google Services files differ per EAS bundle ID. */
const googleServicesSuffix =
  env === "production" ? "" : env === "preview" ? ".preview" : ".dev";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "YOUR_APP_NAME",
  slug: "your-app",
  version: "1.0.0",
  platforms: ["ios", "android"],
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  primaryColor: "#171717",
  backgroundColor: "#000000",
  scheme: "yourapp",
  userInterfaceStyle: "automatic",
  buildCacheProvider: "eas",
  updates: {
    url: "https://u.expo.dev/YOUR_EAS_PROJECT_ID",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: false,
    usesAppleSignIn: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ??
      `./google-services/GoogleService-Info${googleServicesSuffix}.plist`,
  },
  android: {
    package: bundleId,
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      backgroundColor: "#000000",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    icon: "./assets/images/icon.png",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ??
      `./google-services/google-services${googleServicesSuffix}.json`,
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
    "@react-native-vector-icons/material-icons",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          forceStaticLinking: [
            "RNFBApp",
            "RNFBAuth",
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
      projectId: "YOUR_EAS_PROJECT_ID",
    },
    appEnv: env,
  },
  owner: "your-org",
});
