import assertString from './util/assertString';

export default function isCamelCase(str) {
  assertString(str);
  let pattern = /^[01]+$/;
  return pattern.test(str);
}
