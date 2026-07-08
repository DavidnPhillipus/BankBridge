/** Extracts the last 4 digits from a masked string, or null. */
export function last4(masked: string | null | undefined): string | null {
  if (!masked) return null;
  const digits = masked.replace(/\D/g, '');
  return digits.length >= 4 ? digits.slice(-4) : (digits || null);
}

/** Parses a DD/MM/YYYY string into a Date (UTC midnight). */
export function parseDdMmYyyy(value: string): Date {
  const [d, m, y] = value.split('/').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Rounds to 2 decimals to avoid float noise after unit conversions. */
export function money(value: number): number {
  return Math.round(value * 100) / 100;
}
