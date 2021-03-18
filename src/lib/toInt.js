import assertString from './util/assertString';
import isInt from './isInt';

export default function toInt(str, radix = 10) {
  assertString(str);
  str = str.trim();
  const options = { radix, int: undefined };
  if (!isInt(str, options)) {
    return NaN;
  }
  return options.int;
}
