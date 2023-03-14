import assertString from './util/assertString';

function validateChecksum(str) {
  str = str.replace(/\D/g, '');
  if (str === '00000000000') {
    return false;
  }
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digits = str.split('').slice(0, 10).map(Number);
  const checksum = digits.reduce((acc, curr, index) => acc + (curr * weights[index]), 0) % 11;
  return (checksum < 2 ? 0 : 11 - checksum) === parseInt(str[str.length - 1], 10);
}

export default function isPIS(str) {
  assertString(str);
  // ^(?!000\.0000\.000-0)\d{3}\.\d{4}\.\d{3}-\d$
  if (!/^\d{3}\.{0,1}\d{4}\.{0,1}\d{3}-{0,1}\d$/.test(str)) {
    return false;
  }
  return validateChecksum(str);
}
