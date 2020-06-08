import assertString from './util/assertString';
import toFloat from './toFloat';

export default function isDivisibleBy(str, num) {
  assertString(str);
  return toFloat(str) % Number(num) === 0;
}
