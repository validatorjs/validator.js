import assertString from './util/assertString';
import isURL from './isURL';

const simpleUrlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2}|(www\.)?[a-zA-Z0-9]+\.[^\s]{2})/gmi;

export default function containsURL(str, options) {
  assertString(str);
  if (options && options.deep) {
    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j <= str.length; j++) {
        if (isURL(str.substring(i, j))) {
          return true;
        }
      }
    }
  } else {
    let matcher = str.match(simpleUrlPattern);
    if (matcher) {
      console.log('matcher');
      for (let match of matcher) {
        if (isURL(match)) {
          return true;
        }
      }
    }
    console.log(str);
  }
  return false;
}
