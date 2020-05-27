import assertString from './util/assertString';
import merge from './util/merge';
var notBase64 = /[^A-Z0-9+\/=]/i;
var urlSafeBase64 = /^[A-Z0-9_\-]+$/i;
var default_base64_options = {
  urlSafe: false
};
export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, default_base64_options);
  var len = str.length;

  if (options.urlSafe) {
    return urlSafeBase64.test(str);
  }

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}