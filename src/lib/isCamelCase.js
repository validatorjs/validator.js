import assertString from './util/assertString';

export default function isCamelCase(str) {
  assertString(str);
  let pattern = /^[a-z]+(?:[A-Z][a-z]+)+$/;
  return pattern.test(str);
}
