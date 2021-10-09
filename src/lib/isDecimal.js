import merge from './util/merge';
import assertString from './util/assertString';
import includes from './util/includes';
import { decimal } from './alpha';

function decimalRegExp(options) {
  const integerPartExp = '([0-9]+)';
  const decimalPartExp = `(\\${decimal[options.locale]}[0-9]{${options.decimal_digits}})`;
  const exponentialPartExp = '(e(-|\\+)?(0)?[1-9]{1,})';
  const eitherIntegerPartOrDecimalPartOrBothExp = `(${integerPartExp}|${decimalPartExp}|${integerPartExp}${decimalPartExp})`;
  const regExp = new RegExp(`^[-+]?((${integerPartExp}?${decimalPartExp}${options.force_decimal ? '' : '?'})|(${eitherIntegerPartOrDecimalPartOrBothExp}${exponentialPartExp}))$`);
  return regExp;
}

const default_decimal_options = {
  force_decimal: false,
  decimal_digits: '1,',
  locale: 'en-US',
};

const blacklist = ['', '-', '+'];

export default function isDecimal(str, options) {
  assertString(str);
  options = merge(options, default_decimal_options);
  if (options.locale in decimal) {
    return !includes(blacklist, str.replace(/ /g, '')) && decimalRegExp(options).test(str);
  }
  throw new Error(`Invalid locale '${options.locale}'`);
}
