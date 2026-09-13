import assertString from './util/assertString';

function utf8ByteLength(str) {
  let length = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code <= 0x7F) {
      length += 1;
    } else if (code <= 0x7FF) {
      length += 2;
    } else if (code >= 0xD800 && code <= 0xDBFF &&
      i + 1 < str.length &&
      str.charCodeAt(i + 1) >= 0xDC00 && str.charCodeAt(i + 1) <= 0xDFFF) {
      length += 4;
      i += 1;
    } else {
      // UTF-8 encoders replace unpaired surrogates with U+FFFD (three bytes).
      length += 3;
    }
  }

  return length;
}

/* eslint-disable prefer-rest-params */
export default function isByteLength(str, options) {
  assertString(str);
  let min;
  let max;
  if (options !== null && typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else { // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  const len = utf8ByteLength(str);
  return len >= min && (typeof max === 'undefined' || len <= max);
}
