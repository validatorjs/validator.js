import assertString from './util/assertString';
var notBase64 = /[^A-Z0-9+\/=]/i;
export default function isBase64(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertString(str);

  if (options.urlSafe) {
    return /^[A-Za-z0-9_-]+$/.test(str);
  }

  var len = str.length;

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}