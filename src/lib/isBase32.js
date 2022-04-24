import assertString from './util/assertString';
import merge from './util/merge';

const base32 = /^[A-Z2-7]+=*$/;
const crockfordBase32 = /^[A-HJKMNP-TV-Z0-9]+$/;

const defaultBase32Options = {
  crockford: false,
};

export default function isBase32(str, options) {
  assertString(str);
  options = merge(options, defaultBase32Options);

  if (options.crockford) {
    return crockfordBase32.test(str);
  }

  const len = str.length;
  if (len % 8 === 0 && base32.test(str)) {
    return true;
  }
  return false;
}
