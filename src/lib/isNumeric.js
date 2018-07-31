import assertString from './util/assertString';

const numeric = /^[+-]?([0-9]*[.])?[0-9]+$/;
const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options) {
  assertString(str);
  if (options && options.noSymbols) {
    return numericNoSymbols.test(str);
  }
  return numeric.test(str);
}
