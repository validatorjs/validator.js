import assertString from './util/assertString';
import isEmail from './isEmail';

export default function containsEmail(str) {
  assertString(str);
  let n = str.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (isEmail(str.substring(i, j))) {
        return true;
      }
    }
  }
  return false;
}
