import assertString from './util/assertString';
import merge from './util/merge';

const base64WithPadding = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
const base64WithoutPadding = /^[A-Za-z0-9+/]+$/;
const base64UrlWithPadding = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}==|[A-Za-z0-9_-]{3}=|[A-Za-z0-9_-]{4})$/;
const base64UrlWithoutPadding = /^[A-Za-z0-9_-]+$/;

export default function isBase64(str, options) {
  assertString(str);
  options = merge(options, { urlSafe: false, padding: !options?.urlSafe });

  if (str === '') return true;

  let regex;
  if (options.urlSafe) {
    regex = options.padding ? base64UrlWithPadding : base64UrlWithoutPadding;
  } else {
    regex = options.padding ? base64WithPadding : base64WithoutPadding;
  }

  return (!options.padding || str.length % 4 === 0) && regex.test(str);
}
