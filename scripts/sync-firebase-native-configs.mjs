import { copyFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

/**
 * Download Firebase native configs for the single app (one Android + one iOS app).
 * Writes to the **project root** (Expo / RNFB convention):
 *   ./google-services.json
 *   ./GoogleService-Info.plist
 * Must match PACKAGE_NAME in app.config.ts.
 *
 * Usage:
 *   node scripts/sync-firebase-native-configs.mjs
 *   node scripts/sync-firebase-native-configs.mjs --upload-eas
 */

const root = resolve(import.meta.dirname, "..");
const uploadToEas = process.argv.includes("--upload-eas");

/** Keep in sync with app.config.ts → PACKAGE_NAME */
const PACKAGE_NAME = "app.yourapp";

const androidOut = "google-services.json";
const iosOut = "GoogleService-Info.plist";

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
      `No Firebase app found for ${key}=${value}.\n` +
        `Create one Android and one iOS app in Firebase Console with package/bundle ID "${PACKAGE_NAME}",\n` +
        `or update PACKAGE_NAME in this script and app.config.ts.`,
    );
  }
  return app.appId;
}

const androidApps = firebaseJson(["apps:list", "ANDROID"]);
const iosApps = firebaseJson(["apps:list", "IOS"]);
const tempRoot = mkdtempSync(join(tmpdir(), "expo-firebase-template-"));

try {
  const androidPath = resolve(root, androidOut);
  const iosPath = resolve(root, iosOut);
  const androidTempPath = resolve(tempRoot, "google-services.json");
  const iosTempPath = resolve(tempRoot, "GoogleService-Info.plist");
  const androidAppId = findApp(androidApps, "packageName", PACKAGE_NAME);
  const iosAppId = findApp(iosApps, "bundleId", PACKAGE_NAME);

  console.log(`Syncing Firebase native config for ${PACKAGE_NAME}`);
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
    throw new Error("Firebase CLI did not write both config files");
  }
  copyFileSync(androidTempPath, androidPath);
  copyFileSync(iosTempPath, iosPath);
  console.log(`Wrote ${androidOut}`);
  console.log(`Wrote ${iosOut}`);

  if (uploadToEas) {
    for (const environment of ["development", "preview", "production"]) {
      for (const [name, file] of [
        ["GOOGLE_SERVICES_JSON", androidPath],
        ["GOOGLE_SERVICES_PLIST", iosPath],
      ]) {
        console.log(`Uploading ${name} to EAS ${environment}`);
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
    ? "Native configs synced to project root and uploaded to EAS (all environments use the same files)."
    : "Native configs synced to project root (google-services.json, GoogleService-Info.plist). Pass --upload-eas to push to EAS.",
);
