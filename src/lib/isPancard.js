import assertString from './util/assertString';

/**
 * Check if str is a valid PAN card number
 *
 * @param {string} str
 * @return {boolean}
 */
export default function isPancard(str) {
  assertString(str);
  const pancardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const isPancardNumber = pancardRegex.test(str);
  return isPancardNumber;
}
