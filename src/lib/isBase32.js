import assertString from './util/assertString';
import includes from './util/includesArray';
import merge from './util/merge';

const base32 = /^[A-Z2-7]+=*$/;
const crockfordBase32 = /^[A-HJKMNP-TV-Z0-9]+$/;

/**
 * RFC 4648 (section 6) encodes each 40-bit group as 8 characters. A final
 * group of 1, 2, 3 or 4 octets encodes to 2, 4, 5 or 7 characters and is then
 * padded to 8, so an encoder only ever emits 0, 1, 3, 4 or 6 padding
 * characters - never 2, 5 or 7.
 */
const validPaddingLengths = [0, 1, 3, 4, 6];

const defaultBase32Options = {
  crockford: false,
};

/* `str` has already been matched against `base32`, so any '=' is part of the
   single trailing padding run. */
function hasValidPadding(str) {
  const paddingStart = str.indexOf('=');

  return includes(validPaddingLengths, paddingStart === -1 ? 0 : str.length - paddingStart);
}

export default function isBase32(str, options) {
  assertString(str);
  options = merge(options, defaultBase32Options);

  if (options.crockford) {
    return crockfordBase32.test(str);
  }

  return str.length % 8 === 0 && base32.test(str) && hasValidPadding(str);
}
