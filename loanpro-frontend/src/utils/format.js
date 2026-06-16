// Shared formatting helpers. The backend returns money as numeric (BigDecimal
// -> number/string) and dates as ISO strings; these turn them into the
// display strings the UI expects (e.g. "LKR 24,500.00", "Apr 15, 2024").

const numberFmt = (digits) =>
  new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

// "LKR 24,500.00" — accepts number | numeric string | null/undefined.
export function formatLKR(amount, digits = 2) {
  const n = Number(amount);
  if (amount === null || amount === undefined || Number.isNaN(n)) return 'LKR 0.00';
  return `LKR ${numberFmt(digits).format(n)}`;
}

// "24,500.00" — number with thousands separators, no currency prefix.
export function formatAmount(amount, digits = 2) {
  const n = Number(amount);
  if (Number.isNaN(n)) return '0';
  return numberFmt(digits).format(n);
}

// "Apr 15, 2024" — accepts an ISO date / date-time string. Falls back to the
// raw value if it isn't parseable (some endpoints pre-format dates).
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Convenience: pull a human-friendly message out of an ApiError (or anything).
export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return (err && err.message) || fallback;
}
