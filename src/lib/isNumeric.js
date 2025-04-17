import assertString from './util/assertString';
import { decimal } from './alpha';

const numericNoSymbols = /^[0-9]+$/;

export default function isNumeric(str, options = { no_symbols: false }) {
  assertString(str); // Verify if the str is a string, if not report a TypeError

  // Destructure options to extract the required properties
  const { locale, no_symbols } = options;

  // Decide the separator upfront (default separator is '.')
  const decimalSeparator = locale ? decimal[locale] : '.';

  // Set the regex depending on the value of no_symbols
  const regex = no_symbols
    ? numericNoSymbols
    : new RegExp(`^[+-]?([0-9]*[${decimalSeparator}])?[0-9]+([eE][+-]?[0-9]+)?$`);

  // Test the string using the regular expression
  return regex.test(str);
}
