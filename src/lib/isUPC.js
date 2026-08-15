import assertString from './util/assertString';

const UPCA_REGEX = /^\d{12}$/;

function calculateCheckDigit(upc) {
  const digits = upc
    .slice(0, -1)
    .split('')
    .map(Number);

  const sumOddPositions = digits
    .filter((_, index) => index % 2 === 0)
    .reduce((acc, digit) => acc + digit, 0);

  const sumEvenPositions = digits
    .filter((_, index) => index % 2 === 1)
    .reduce((acc, digit) => acc + digit, 0);

  const total = (sumOddPositions * 3) + sumEvenPositions;
  const remainder = total % 10;

  return remainder === 0 ? 0 : 10 - remainder;
}

export default function isUPC(str) {
  assertString(str);

  if (!UPCA_REGEX.test(str)) {
    return false;
  }

  const actualCheckDigit = Number(str.slice(-1));

  return actualCheckDigit === calculateCheckDigit(str);
}

