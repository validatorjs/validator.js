import assertString from './util/assertString';

// https://en.wikipedia.org/wiki/ISO_9362
const isBICReg = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export default function isBIC(str) {
  assertString(str);
  return isBICReg.test(str);
}
