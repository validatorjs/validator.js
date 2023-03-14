import assertString from './util/assertString';

function validateChecksum(str) {
  str = str.replace(/\D/g, '');
  if (/^(\d)\1*$/.test(str)) {
    return false;
  }
  const digits = str.slice(0, 9).split('').map(Number);
  let csd1 = digits.reduce((acc, curr, index) => acc + (curr * (10 - index)), 0) % 11;
  csd1 = csd1 < 2 ? 0 : 11 - csd1;
  let csd2 = [...digits, csd1].reduce((acc, curr, index) => acc + (curr * (11 - index)), 0) % 11;
  csd2 = csd2 < 2 ? 0 : 11 - csd2;
  return str.slice(str.length - 2) === `${csd1}${csd2}`;
}

export default function isCPF(str) {
  assertString(str);
  if (!/^\d{3}\.{0,1}\d{3}\.{0,1}\d{3}-{0,1}\d{2}$/.test(str)) {
    return false;
  }
  return validateChecksum(str);
}
