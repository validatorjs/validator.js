import assertString from './util/assertString';

const isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

// this link details how the check digit is calculated:
// https://www.isin.org/isin-format/. it is a little bit
// odd in that it works with digits, not numbers. in order
// to make only one pass through the ISIN characters, the
// each alpha character is handled as 2 characters within
// the loop.

export default function isISIN(str) {
  assertString(str);
  if (!isin.test(str)) {
    return false;
  }

  let double = true;
  let sum = 0;
  // convert values
  for (let i = str.length - 2; i >= 0; i--) {
    if (str[i] >= 'A' && str[i] <= 'Z') {
      const value = str[i].charCodeAt(0) - 55;
      const lo = value % 10;
      const hi = Math.trunc(value / 10);
      // letters have two digits, so handle the low order
      // and high order digits separately.
      for (const digit of [lo, hi]) {
        if (double) {
          if (digit >= 5) {
            sum += 1 + ((digit - 5) * 2);
          } else {
            sum += digit * 2;
          }
        } else {
          sum += digit;
        }
        double = !double;
      }
    } else {
      const digit = str[i].charCodeAt(0) - '0'.charCodeAt(0);
      if (double) {
        if (digit >= 5) {
          sum += 1 + ((digit - 5) * 2);
        } else {
          sum += digit * 2;
        }
      } else {
        sum += digit;
      }
      double = !double;
    }
  }

  const check = (Math.trunc(((sum + 9) / 10)) * 10) - sum;

  return +str[str.length - 1] === check;
}
