import merge from './util/merge';
import assertString from './util/assertString';
import includes from './util/includes';
import { decimal } from './alpha';

function decimalRegExp(options) {
  const regExp = new RegExp(`^[-+]?([0-9]+)?(\\${decimal[options.locale]}[0-9]{${options.decimal_digits}})${options.force_decimal ? '' : '?'}$`);
  return regExp;
}

const exponentialRegexp = new RegExp('^[-+]?([0-9]+)$');

const default_decimal_options = {
  force_decimal: false,
  decimal_digits: '1,',
  locale: 'en-US',
  allow_exponential: false,
};

const blacklist = ['', '-', '+'];

export default function isDecimal(str, options) {
  assertString(str);
  options = merge(options, default_decimal_options);
  if (options.locale in decimal) {
    if (!options.allow_exponential) {
      return !includes(blacklist, str.replace(/ /g, '')) && decimalRegExp(options).test(str);
    }
    const [decimalPart, exponential] = str.split(new RegExp('e', 'i'));
    return !includes(blacklist, decimalPart.replace(/ /g, '')) && decimalRegExp(options).test(decimalPart) && exponentialRegexp.test(exponential);
  }

  throw new Error(`Invalid locale '${options.locale}'`);
}
