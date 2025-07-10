import assertString from './util/assertString';

/**
 * Keeps only characters from `str` that appear in the `chars` string.
 *
 * @param {string} str - The input string to modify.
 * @param {string} chars - A string containing characters to keep in `str`.
 * @returns {string} - The modified string with only characters from `chars`.
 * @throws {Error} - If `chars` is not a string.
 */
export default function whitelist(str, chars) {
  assertString(str);

  if (typeof chars !== 'string') {
    throw new Error('`chars` must be a string');
  }

  // Escape special characters for use in regex
  const escapedChars = chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  
  // Keep only characters in `chars` from `str`
  return str.replace(new RegExp(`[^${escapedChars}]+`, 'g'), '');
}
