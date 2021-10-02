import assertString from './util/assertString';
import isInt from './isInt';

/**
 * Key: Position of digit (starts from 1).
 * Value: Weight of digit at specified position.
 */

const weightOfDigits = {
  1: 1,
  2: 3,
  3: 7,
  4: 9,
  5: 1,
  6: 3,
  7: 7,
  8: 9,
  9: 1,
  10: 3,
  11: 1,
};

/**
 * PESEL is a national identification number used by Polish government.
 * It is assigned to every Polish citzen and is unique.
 *
 * Reference: https://en.wikipedia.org/wiki/PESEL
 *
 * @param {string} str
 * @return {boolean}
 */

export default function isPESEL(str) {
  assertString(str);

  if (str == null || str.length !== 11 || !isInt(str, { allow_leading_zeroes: true })) {
    return false;
  }

  const digits = str.split('');
  let sum = 0;

  digits.forEach((digit, index) => {
    if (index !== 10) {
      sum += Number(digit) * weightOfDigits[index + 1];
    }
  });

  const modulo = sum % 10;
  const lastDigit = Number(str.charAt(str.length - 1));

  return (modulo === 0 && lastDigit === 0) || (lastDigit === 10 - modulo);
}
