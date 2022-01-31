import isEmail from './isEmail';

export default function containsEmail(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '@') {
      let l = i;
      let r = i;

      while (l !== 0 || r !== str.length) {
        if (l !== 0) {
          l -= 1;
          if (isEmail(str.substr(l, r))) {
            return true;
          }
        }
        if (r !== str.length) {
          r += 1;
          if (isEmail(str.substr(l, r))) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
