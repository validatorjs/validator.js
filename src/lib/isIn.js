import assertString from '../util/assertString';
import toString from '../util/toString';

export default function isIn(str, options) {
  assertString(str);
  let i;
  if (Object.prototype.toString.call(options) === '[object Array]') {
    const array = [];
    /* eslint-disable guard-for-in */
    for (i in options) {
      array[i] = toString(options[i]);
    }
    return array.indexOf(str) >= 0;
  } else if (typeof options === 'object') {
    return options.hasOwnProperty(str);
  } else if (options && typeof options.indexOf === 'function') {
    return options.indexOf(str) >= 0;
  }
  return false;
}
