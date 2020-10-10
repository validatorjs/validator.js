import assertString from './util/assertString';

export default function isReverse(str, target) {
  assertString(str);
  if (str.split('').reverse().join('') === target) {
    return true;
  }
  return false;
}
