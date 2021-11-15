import assertString from './util/assertString';

/**
 * Check if string is valid EAN:
 * Matches EAN-8/EAN-13/EAN-14 regex
 * Has valid check digit.
 *
 * https://en.wikipedia.org/wiki/Social_Insurance_Number
 * https://www.canada.ca/en/employment-social-development/services/sin.html
 * https://www.codercrunch.com/challenge/819302488/sin-validator
 *
 * @param {string} str
 * @return {boolean}
 */
export default function isSIN(str) {
  assertString(str);

  if (!(/^\d{9}$/ui).test(str)) {
    return false;
  }

  const digitsArray = str.split('');
  const even = digitsArray
    .filter((_, idx) => idx % 2)
    .map(i => Number(i) * 2)
    .join('')
    .split('');

  const total = digitsArray
    .filter((_, idx) => !(idx % 2))
    .concat(even)
    .map(i => Number(i))
    .reduce((acc, cur) => acc + cur);

  return (total % 10 === 0);
}
