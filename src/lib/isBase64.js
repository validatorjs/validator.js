import assertString from './util/assertString';
import merge from './util/merge';

const notBase64 = /[^A-Z0-9+\/=]/i;
const urlSafeBase64 = /^[A-Z0-9_\-]*$/i;

const defaultBase64Options = {
  urlSafe: false,
};

export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, defaultBase64Options);
  const len = str.length;

  if (options.urlSafe) {
    return urlSafeBase64.test(str);
  }

  if (len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === '=');
}
