import assertString from './util/assertString';

export default function isBetween(str, min, max) {
  assertString(str);
  const strLength = str.length;
  return strLength >= min && strLength <= max;
}
