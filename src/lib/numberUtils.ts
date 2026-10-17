/**
 * Sanitizes numeric input strings by removing leading zeros,
 * while preserving valid single '0' or decimals like '0.5'.
 * Example: '010' -> '10', '05' -> '5', '0' -> '0', '0.5' -> '0.5'
 */
export function sanitizeNumericInput(val: string): string {
  if (!val) return '';
  // If it starts with multiple zeros or zero followed by a digit (not decimal point)
  // e.g. "010" -> "10", "005" -> "5"
  return val.replace(/^0+(?=\d)/, '');
}

/**
 * Parses numeric input and prevents leading zeros or NaN issues.
 */
export function parseSanitizedNumber(val: string): number | undefined {
  const cleaned = sanitizeNumericInput(val.trim());
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  return isNaN(num) ? undefined : num;
}
