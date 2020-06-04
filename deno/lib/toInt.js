import assertString from './util/assertString.js';

export default function toInt(str, radix) {
  assertString(str);
  return parseInt(str, radix || 10);
}
