import assertString from './util/assertString';

// https://en.wikipedia.org/wiki/ISO_9362
const isBICReg = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;

export default function isBIC(str) {
  assertString(str);
  return isBICReg.test(str);
}
