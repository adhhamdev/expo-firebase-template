/** Generic helpers — keep domain-specific formatting in feature modules. */

export function toJsDate(
  ts: { toDate?: () => Date } | Date | string | null | undefined,
): Date | null {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  if (typeof ts === "string") {
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof ts.toDate === "function") return ts.toDate();
  return null;
}

export function formatDate(
  ts: { toDate?: () => Date } | Date | string | null | undefined,
): string {
  const date = toJsDate(ts);
  if (!date) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
