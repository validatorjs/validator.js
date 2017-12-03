import assertString from './util/assertString';

const spanishDNI = /(\d{8})(\s|-)?([a-zA-Z]{1})$/;

export default function isSpanishDNI(str) {
  assertString(str);
  const isValidFormat = spanishDNI.test(str);
  if (!isValidFormat) {
    return false;
  }
  const letter = str[str.length - 1];
  const encoder = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const sum = str
    .replace(/[ a-zA-Z_-]+/, '')
    .split('')
    .reduce((acc, digit) => acc + Number(digit));

  return letter.toUpperCase() === encoder[sum % 23];
}
