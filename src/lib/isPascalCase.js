import assertString from './util/assertString';

export default function isPascalCase(str) {
  assertString(str);
  let pattern = /^[A-Z][a-z]+(?:[A-Z][a-z]*)*$/;
  return pattern.test(str);
}
