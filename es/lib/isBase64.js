import assertString from './util/assertString';
var notBase64 = /[^A-Z0-9+\/=]/i;
export default function isBase64(str) {
  assertString(str);
  var len = str.length;

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}