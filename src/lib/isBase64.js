import assertString from './util/assertString';
import merge from './util/merge';

const base64WithPadding = /^[A-Za-z0-9+/]+={0,2}$/;
const base64WithoutPadding = /^[A-Za-z0-9+/]+$/;
const base64UrlWithPadding = /^[A-Za-z0-9_-]+={0,2}$/;
const base64UrlWithoutPadding = /^[A-Za-z0-9_-]+$/;

// When padding is required, the length must be a multiple of 4.
// When padding is omitted, the length must be one of the valid
// unpadded base64 lengths: 0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16, ...
// i.e. (length % 4) is 0, 2, or 3 — never 1. Lengths of the form
// (4k+1) cannot be produced by any base64 encoding of any byte string.
const validUnpaddedLength = (n) => n % 4 !== 1;

export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, { urlSafe: false, padding: !options?.urlSafe });

  if (str === '') return true;

  if (options.padding) {
    if (str.length % 4 !== 0) return false;
  } else if (!validUnpaddedLength(str.length)) {
    return false;
  }

  let regex;
  if (options.urlSafe) {
    regex = options.padding ? base64UrlWithPadding : base64UrlWithoutPadding;
  } else {
    regex = options.padding ? base64WithPadding : base64WithoutPadding;
  }

  return regex.test(str);
}
