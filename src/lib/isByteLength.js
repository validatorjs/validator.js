import assertString from './util/assertString';

export default function isByteLength(str, options) {
  assertString(str);
  let min;
  let max;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else { // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1]; // eslint-disable-line prefer-rest-params
    max = arguments[2]; // eslint-disable-line prefer-rest-params
  }
  const len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
