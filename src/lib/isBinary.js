import assertString from './util/assertString';

export default function isBinary(str) {
  assertString(str);
  let pattern = /^[01]+$/;
  return pattern.test(str);
}
