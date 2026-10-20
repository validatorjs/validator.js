import assertString from './util/assertString';
import toFloat from './toFloat';

export default function isDivisibleBy(str, num) {
  assertString(str);
  const divisor = Number(num);
  return Number.isInteger(divisor) && toFloat(str) % divisor === 0;
}
