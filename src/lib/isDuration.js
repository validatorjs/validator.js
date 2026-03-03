import assertString from './util/assertString';

/* eslint-disable max-len */
// Matches the ms package (https://github.com/vercel/ms) StringValue format:
// A numeric value (optionally decimal, optionally negative) followed by an optional unit.
// Unit is optional — a bare number is treated as milliseconds.
// Format: `${number}`, `${number}${unit}`, or `${number} ${unit}` (case-insensitive)
const msFormatRegex =
  /^(-?\d*\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i;
/* eslint-enable max-len */

export default function isDuration(str, options = {}) {
  assertString(str);

  const allowNegative =
    typeof options.allowNegative === 'boolean' ? options.allowNegative : true;

  const match = msFormatRegex.exec(str);

  if (!match) return false;

  if (!allowNegative && parseFloat(match[1]) < 0) return false;

  return true;
}
