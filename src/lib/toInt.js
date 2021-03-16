import assertString from './util/assertString';
import isFloat from './isFloat';

export default function toInt(str, radix = 10) {
  assertString(str);
  str = str.trim();
  if (!isFloat(str)) {
    if (radix <= 10) {
      return NaN;
    }
    // it's a radix higher than 10
    str = str.toLowerCase();
    const base = radix - 11;
    const high = 'a'.charCodeAt(0) + base;
    const re = new RegExp(`^[-+]?[0-9a-${String.fromCharCode(high)}]+`);
    if (!re.test(str)) {
      return NaN;
    }
  }
  return parseInt(str, radix);
}
