import assertString from './util/assertString';
import toFloat from './toFloat';
import isFloat from './isFloat';

export default function isDivisibleBy(str, num) {
  assertString(str);
  if (num.constructor !== Number && !isFloat(num)) {
    return false;
  }
  return toFloat(str) % parseFloat(num) === 0;
}
