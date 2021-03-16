import assertString from './util/assertString';
import toFloat from './toFloat';
import isInt from './isInt';

export default function isDivisibleBy(str, num) {
  assertString(str);
  if (num.constructor !== Number && !isInt(num)) {
    return false;
  }
  return toFloat(str) % parseInt(num, 10) === 0;
}
