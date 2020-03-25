import assertString from './util/assertString';
var numeric = /^[+-]?([0-9]*[.])?[0-9]+$/;
var numericNoSymbols = /^[0-9]+$/;
export default function isNumeric(str, options) {
  assertString(str);

  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  return numeric.test(str);
}