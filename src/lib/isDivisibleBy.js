import assertString from './util/assertString';
import assertNumber from './util/assertNumber';
import toFloat from './toFloat';

export default function isDivisibleBy(str, num) {
  assertString(str);
  assertNumber(num);
  return toFloat(str) % parseInt(num, 10) === 0;
}
