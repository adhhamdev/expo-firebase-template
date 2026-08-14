#!/usr/bin/env node
/**
 * Print Android SHA-1 / SHA-256 for Google Sign-In & Firebase.
 *
 * Local debug keystore (default Android debug):
 *   bun run signing:fingerprints
 *
 * Custom keystore:
 *   node scripts/print-android-fingerprints.mjs --keystore path.jks --alias ALIAS
 *
 * EAS-managed credentials: use `eas credentials -p android` → download keystore,
 * then pass --keystore / --alias. Also add Play App Signing cert from Play Console.
 *
 * @see docs/SIGNING.md
 */

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const keystore =
  arg("--keystore") ??
  join(homedir(), ".android", "debug.keystore");
const alias = arg("--alias") ?? "androiddebugkey";
const storepass = arg("--storepass") ?? "android";
const keypass = arg("--keypass") ?? storepass;

if (!existsSync(keystore)) {
  console.error(`Keystore not found: ${keystore}`);
  console.error(
    "Create a debug keystore by building once, or pass --keystore / --alias for EAS/release keys.",
  );
  process.exit(1);
}

function fingerprints(alg) {
  const result = spawnSync(
    "keytool",
    [
      "-list",
      "-v",
      "-keystore",
      keystore,
      "-alias",
      alias,
      "-storepass",
      storepass,
      "-keypass",
      keypass,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || "keytool failed");
    process.exit(result.status ?? 1);
  }
  const text = result.stdout || "";
  const re =
    alg === "SHA1"
      ? /SHA1:\s*([0-9A-Fa-f:]+)/
      : /SHA256:\s*([0-9A-Fa-f:]+)/;
  const m = text.match(re);
  return m?.[1] ?? null;
}

const sha1 = fingerprints("SHA1");
const sha256 = fingerprints("SHA256");

console.log(`Keystore: ${keystore}`);
console.log(`Alias:    ${alias}`);
console.log(`SHA-1:    ${sha1 ?? "(not found)"}`);
console.log(`SHA-256:  ${sha256 ?? "(not found)"}`);
console.log("");
console.log("Add both to Firebase Console → Project settings → Your Android app → SHA certificate fingerprints.");
console.log("Then re-run: bun run firebase:sync");
console.log("Also register EAS + Play App Signing fingerprints (see docs/SIGNING.md).");
