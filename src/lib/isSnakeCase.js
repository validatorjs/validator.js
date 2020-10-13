import assertString from './util/assertString';

const snakeCaseRegex = /^([A-Z]+(_[A-Z0-9]+)*)$|^([a-z]+(_[a-z0-9]+)*)$/;

export default function isSnakeCase(str) {
  assertString(str);

  // Make sure that the string contains either uppercase or lowercase letters only.
  if (str.toLowerCase() === str || str.toUpperCase() === str) {
    return snakeCaseRegex.test(str);
  }

  return false;
}
