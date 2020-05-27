import assertString from './util/assertString';
import merge from './util/merge';

const notBase64 = /[^A-Z0-9+\/=]/i;
const UrlSafeBase64 = /^[A-Z0-9_\-]+$/i;

const default_base64_options = {
  urlSafe: false,
};

export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, default_base64_options);
  const len = str.length;

  if (options.urlSafe) {
    return UrlSafeBase64.test(str);
  }

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === '=');
}
