import assertString from './util/assertString.js';
import toFloat from './toFloat.js';

export default function isDivisibleBy(str, num) {
  assertString(str);
  return toFloat(str) % parseInt(num, 10) === 0;
}
