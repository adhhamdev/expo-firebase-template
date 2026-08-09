/**
 * Normalize phone numbers toward E.164 for storage, Firebase Phone Auth,
 * and WhatsApp / tel: deep links.
 *
 * Heuristics:
 * - Already +E.164 → keep digits with leading +
 * - Leading 0 national trunk → caller should prefer passing country code;
 *   bare national numbers without country context are left as +{digits}
 * - Preserve Firebase PNV all-zero test numbers in __DEV__
 */
export function normalizePhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  // PNV test numbers are country code + zeros (e.g. +10000000000).
  if (__DEV__ && /^\d{1,3}0{7,12}$/.test(digits)) {
    return `+${digits}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  // Common national trunk: drop a single leading 0 when the rest looks long enough.
  if (digits.startsWith("0") && digits.length >= 10) {
    digits = digits.slice(1);
  }

  return `+${digits}`;
}

/** Normalize for storage; empty / whitespace → null. */
export function normalizePhoneForStorage(
  phone: string | null | undefined,
): string | null {
  if (phone == null) return null;
  const normalized = normalizePhoneNumber(phone);
  return normalized || null;
}
