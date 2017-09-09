import assertString from './util/assertString';
import { decimal } from './alpha';

export default function isDecimal(str, locale = 'en-US') {
  assertString(str);
  if (locale in decimal) {
    const decimalRegExp = new RegExp(`^[-+]?([0-9]+|\\${decimal[locale]}[0-9]+|[0-9]+\\${decimal[locale]}[0-9]+)$`);
    return str !== '' && decimalRegExp.test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}
