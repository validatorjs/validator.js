import assertString from './util/assertString';

const isBICReg = /^[A-z]{4}[A-z]{2}\w{2}(\w{3})?$/;

export default function isBIC(str) {
  assertString(str);
  return isBICReg.test(str);
}
