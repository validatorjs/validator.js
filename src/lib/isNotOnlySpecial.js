import assertString from './util/assertString';

export default function isNotOnlySpecial(str) {
  assertString(str);
  if (str.match(/^[^A-Z0-9]*$/i)) {
    return false;
  }
  return true;
}
