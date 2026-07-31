import type { ConfigContext, ExpoConfig } from "expo/config";

const env = process.env.EXPO_PUBLIC_APP_ENV ?? "development";

// TODO: Replace with your bundle identifiers
const bundleIds: Record<string, string> = {
  development: "app.yourapp.dev",
  preview: "app.yourapp.preview",
  production: "app.yourapp",
};

const bundleId = bundleIds[env] ?? bundleIds.development;

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
  scheme: "yourapp",
  userInterfaceStyle: "automatic",
  updates: {
    // TODO: run `eas init` and paste project URL / id
    url: "https://u.expo.dev/YOUR_EAS_PROJECT_ID",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: false,
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
      foregroundImage: "./assets/images/adaptive-icon.png",
    },
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ??
      "./google-services/google-services.json",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-font",
    "expo-secure-store",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
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
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#3B82F6",
        defaultChannel: "default",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow access to photos to upload images.",
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
