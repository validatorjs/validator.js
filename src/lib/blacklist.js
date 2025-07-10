import assertString from './util/assertString';

/**
 * Removes all characters from `str` that appear in the `chars` string.
 *
 * @param {string} str - The input string to modify.
 * @param {string} chars - A string containing characters to remove from `str`.
 * @returns {string} - The modified string with characters from `chars` removed.
 */
export default function blacklist(str, chars) {
  assertString(str);

  if (typeof chars !== 'string') {
    throw new Error('`chars` must be a string');
  }

  // Escape special characters for use in regex
  const escapedChars = chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  
  // Remove characters in `chars` from `str`
  return str.replace(new RegExp(`[${escapedChars}]+`, 'g'), '');
}
