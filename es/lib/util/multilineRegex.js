/**
 * Build RegExp object from an array
 * of multiple/multi-line regexp parts
 *
 * @param {string[]} parts
 * @param {string} flags
 * @return {object} - RegExp object
 */
export default function multilineRegexp(parts) {
  var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var regexpAsStringLiteral = parts.join('');
  return new RegExp(regexpAsStringLiteral, flags);
}