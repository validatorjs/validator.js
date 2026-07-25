import assertString from './util/assertString';

/* eslint-disable prefer-rest-params */
export default function isByteLength(str, options) {
  assertString(str);
  let min;
  let max;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else { // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  // encodeURI() throws on unpaired surrogates, so replace any with U+FFFD first.
  // A UTF-8 encoder substitutes the same replacement character (3 bytes), which
  // keeps the byte count correct while leaving valid surrogate pairs untouched.
  const sanitized = str.replace(/[\uD800-\uDFFF]/g, (surrogate, index) => {
    const isHighSurrogate = surrogate.charCodeAt(0) <= 0xDBFF;
    if (isHighSurrogate) {
      const next = str.charCodeAt(index + 1);
      if (next >= 0xDC00 && next <= 0xDFFF) return surrogate;
    } else {
      const prev = str.charCodeAt(index - 1);
      if (prev >= 0xD800 && prev <= 0xDBFF) return surrogate;
    }
    return '\uFFFD';
  });
  const len = encodeURI(sanitized).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
