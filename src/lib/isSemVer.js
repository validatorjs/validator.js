import assertString from './util/assertString';

/**
 * Build RegExp object from an array
 * of multiple/multi-line RegExp objects
 *
 * @param {string[]} parts
 * @param {string} flags
 * @return {object} - RegExp object
 */
function buildMultiLineRegexp(parts, flags = '') {
  const regexpAsStringLiteral = parts.join('');

  return new RegExp(regexpAsStringLiteral, flags);
}

/**
 * Regular Expression to match
 * semantic versioning (SemVer)
 * built from multi-line, multi-parts regexp
 * Reference: https://semver.org/
 */
const semanticVersioningRegex = buildMultiLineRegexp([
  '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)',
  '(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))',
  '?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
]);

export default function isSemVer(str) {
  assertString(str);

  return semanticVersioningRegex.test(str);
}
