import assertString from './util/assertString';

export default function isUsername(str) {
  assertString(str);
  if (str.length < 3 || str.length > 15) {
    return false;
  }
  for (let i = 0; i<str.length; i++) {
    let char = str[i];
    if (char === '@' || char === '#' || char === '$') {
      return false;
    }
  }
  return true;
}
