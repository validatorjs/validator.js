import assertString from './util/assertString';

// https://en.wikipedia.org/wiki/ISO_6346
const isContainerIdReg = new RegExp('^[A-Z]{3}U[0-9]{7}$');
const isDigit = new RegExp('^[0-9]{1}');

export default function isContainerID(str) {
  assertString(str);
  str = str.trim();

  if (!isContainerIdReg.test(str)) return false;

  let sum = 0;
  for (let i = 0; i < str.length - 1; i++) {
    if (!isDigit.test(str[i])) {
      let convertedCode;
      const letterCode = str.charCodeAt(i) - 55;
      if (letterCode < 11) convertedCode = letterCode;
      else if (letterCode >= 11 && letterCode <= 20) convertedCode = 12 + (letterCode % 11);
      else if (letterCode >= 21 && letterCode <= 30) convertedCode = 23 + (letterCode % 21);
      else convertedCode = 34 + (letterCode % 31);
      sum += convertedCode * (2 ** i);
    } else sum += str[i] * (2 ** i);
  }

  const checkSumDigit = sum % 11;
  return Number(str[str.length - 1]) === checkSumDigit;
}
