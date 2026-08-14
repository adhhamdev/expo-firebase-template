import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

/**
 * Download Firebase native configs (google-services.json / GoogleService-Info.plist)
 * for each EAS environment and optionally upload them as sensitive EAS file vars.
 *
 * Placeholders match app.config.ts — search-replace bundle IDs when you create a project.
 *
 * Usage:
 *   node scripts/sync-firebase-native-configs.mjs
 *   node scripts/sync-firebase-native-configs.mjs preview
 *   node scripts/sync-firebase-native-configs.mjs --upload-eas
 */

const root = resolve(import.meta.dirname, "..");
const uploadToEas = process.argv.includes("--upload-eas");
const requestedEnvironment = process.argv.find((arg) =>
  ["development", "preview", "production"].includes(arg),
);

/** Bundle / package IDs must match app.config.ts and Firebase Console apps. */
const environments = {
  development: {
    packageName: "app.yourapp.dev",
    bundleId: "app.yourapp.dev",
    androidFile: "google-services/google-services.dev.json",
    iosFile: "google-services/GoogleService-Info.dev.plist",
  },
  preview: {
    packageName: "app.yourapp.preview",
    bundleId: "app.yourapp.preview",
    androidFile: "google-services/google-services.preview.json",
    iosFile: "google-services/GoogleService-Info.preview.plist",
  },
  production: {
    packageName: "app.yourapp",
    bundleId: "app.yourapp",
    androidFile: "google-services/google-services.json",
    iosFile: "google-services/GoogleService-Info.plist",
  },
};

const selected = requestedEnvironment
  ? { [requestedEnvironment]: environments[requestedEnvironment] }
  : environments;

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowNonZero) {
    throw new Error(`${command} ${args.join(" ")} exited with ${result.status}`);
  }
  return result.stdout ?? "";
}

function firebaseJson(args) {
  const output = run(npx, ["--no-install", "firebase-tools", ...args, "--json"], {
    capture: true,
    allowNonZero: true,
  });
  return JSON.parse(output.trim()).result ?? [];
}

function findApp(apps, key, value) {
  const app = apps.find((candidate) => candidate[key] === value);
  if (!app) {
    throw new Error(
      `No Firebase app found for ${key}=${value}. Create matching Android/iOS apps in Firebase Console (or update package/bundle IDs in this script and app.config.ts).`,
    );
  }
  return app.appId;
}

mkdirSync(resolve(root, "google-services"), { recursive: true });

const androidApps = firebaseJson(["apps:list", "ANDROID"]);
const iosApps = firebaseJson(["apps:list", "IOS"]);
const tempRoot = mkdtempSync(join(tmpdir(), "expo-firebase-template-"));

try {
  for (const [environment, config] of Object.entries(selected)) {
    const androidPath = resolve(root, config.androidFile);
    const iosPath = resolve(root, config.iosFile);
    const androidTempPath = resolve(tempRoot, `${environment}-google-services.json`);
    const iosTempPath = resolve(tempRoot, `${environment}-GoogleService-Info.plist`);
    const androidAppId = findApp(androidApps, "packageName", config.packageName);
    const iosAppId = findApp(iosApps, "bundleId", config.bundleId);

    console.log(`Syncing Firebase native config: ${environment}`);
    run(
      npx,
      [
        "--no-install",
        "firebase-tools",
        "apps:sdkconfig",
        "ANDROID",
        androidAppId,
        "--out",
        androidTempPath,
      ],
      { allowNonZero: true },
    );
    run(
      npx,
      [
        "--no-install",
        "firebase-tools",
        "apps:sdkconfig",
        "IOS",
        iosAppId,
        "--out",
        iosTempPath,
      ],
      { allowNonZero: true },
    );

    if (!existsSync(androidTempPath) || !existsSync(iosTempPath)) {
      throw new Error(`Firebase CLI did not write both files for ${environment}`);
    }
    copyFileSync(androidTempPath, androidPath);
    copyFileSync(iosTempPath, iosPath);

    if (uploadToEas) {
      for (const [name, file] of [
        ["GOOGLE_SERVICES_JSON", androidPath],
        ["GOOGLE_SERVICES_PLIST", iosPath],
      ]) {
        console.log(`Uploading ${name} to EAS ${environment} environment`);
        run(npx, [
          "--yes",
          "eas-cli@latest",
          "env:set",
          "--environment",
          environment,
          "--scope",
          "project",
          "--name",
          name,
          "--value",
          file,
          "--type",
          "file",
          "--visibility",
          "sensitive",
          "--non-interactive",
        ]);
      }
    }
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

console.log(
  uploadToEas
    ? "Firebase native configs synced locally and uploaded to EAS as sensitive file variables."
    : "Firebase native configs synced locally under google-services/. Pass --upload-eas to update EAS file variables.",
);
