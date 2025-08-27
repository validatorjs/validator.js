import assertString from "./util/assertString";
import { decimal } from "./alpha";

const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options) {
  assertString(str);
  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  const decimalSymbol = (options || {}).locale ? decimal[options.locale] : ".";

  return new RegExp(
    `^[+-]?(?:\\d+|\\d*${decimalSymbol}\\d+)(?:[eE][+-]?\\d+)?$`
  ).test(str);
}
