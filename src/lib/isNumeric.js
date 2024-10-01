import assertString from './util/assertString';
import { decimal } from './alpha';

const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options = { no_symbols: false }) {
  assertString(str); // verify if the str is a string, if not report a TypeError

  // destructure options to extract the required properties
  const { locale, no_symbols } = options;

  // deciding the separator upfront (default separator is '.')
  const decimalSeparator = locale ? decimal[locale] : '.';

  // setting the regex depending on the value of no_symbols
  const regex = no_symbols ? numericNoSymbols : `^[+-]?([0-9]*[${ decimalSeparator }])?[0-9]+([eE][+-]?[0-9]+)?$`;

  return regex.test(str);
}
