import assertString from './util/assertString';

const luhnArray = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

export default function isLuhn(number) {
  assertString(number);
  const sanitized = number.replace(/[- ]+/g, '');
  if (!sanitized) return false;
  let length = sanitized.length;
  let bit = 1;
  let sum = 0;
  let value;

  while (length) {
    // eslint-disable-next-line no-plusplus
    value = parseInt(sanitized.charAt(--length), 10);
    // eslint-disable-next-line no-bitwise
    bit ^= 1;
    sum += bit ? luhnArray[value] : value;
  }

  return sum % 10 === 0;
}
