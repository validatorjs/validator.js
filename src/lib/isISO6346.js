import assertString from './util/assertString';

// https://en.wikipedia.org/wiki/ISO_6346
// according to ISO6346 standard, checksum digit is mandatory for freight container but recommended
// for other container types (J and Z)
const isISO6346Str = /^[A-Z]{3}(U[0-9]{7})|([J,Z][0-9]{6,7})$/;
const isDigit = /^[0-9]$/;

export function isISO6346(str) {
  assertString(str);

  str = str.toUpperCase();

  if (!isISO6346Str.test(str)) return false;

  if (str.length === 11) {
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

    let checkSumDigit = sum % 11;
    if (checkSumDigit === 10) checkSumDigit = 0;
    return Number(str[str.length - 1]) === checkSumDigit;
  }

  return true;
}

export const isFreightContainerID = isISO6346;
