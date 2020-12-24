import merge from './util/merge';
import assertString from './util/assertString';

function currencyRegex(options) {
  let decimal_digits = `\\d{${options.digits_after_decimal[0]}}`;
  options.digits_after_decimal.forEach((digit, index) => { if (index !== 0) decimal_digits = `${decimal_digits}|\\d{${digit}}`; });

  const symbol =
    `(${options.symbol.replace(/\W/, m => `\\${m}`)})${(options.require_symbol ? '' : '?')}`,
    negative = '-?',
    whole_dollar_amount_without_sep = '[1-9]\\d*',
    whole_dollar_amount_with_sep = `[1-9]\\d{0,2}(\\${options.thousands_separator}\\d{3})*`,
    valid_whole_dollar_amounts = [
      '0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
    whole_dollar_amount = `(${valid_whole_dollar_amounts.join('|')})?`,
    decimal_amount = `(\\${options.decimal_separator}(${decimal_digits}))${options.require_decimal ? '' : '?'}`;
  let pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : '');

  // default is negative sign before symbol, but there are two other options (besides parens)
  if (options.allow_negatives && !options.parens_for_negatives) {
    if (options.negative_sign_after_digits) {
      pattern += negative;
    } else if (options.negative_sign_before_digits) {
      pattern = negative + pattern;
    }
  }

  // South African Rand, for example, uses R 123 (space) and R-123 (no space)
  if (options.allow_negative_sign_placeholder) {
    pattern = `( (?!\\-))?${pattern}`;
  } else if (options.allow_space_after_symbol) {
    pattern = ` ?${pattern}`;
  } else if (options.allow_space_after_digits) {
    pattern += '( (?!$))?';
  }

  if (options.symbol_after_digits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }

  if (options.allow_negatives) {
    if (options.parens_for_negatives) {
      pattern = `(\\(${pattern}\\)|${pattern})`;
    } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
      pattern = negative + pattern;
    }
  }

  // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space
  return new RegExp(`^(?!-? )(?=.*\\d)${pattern}$`);
}


const default_currency_options = {
  symbol: '$',
  require_symbol: false,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false,
  min: undefined,
  max: undefined,
};

function numericValue(str, options) {
  if (str === undefined) return str;
  if (typeof str === 'number') return str;

  let tsre = new RegExp(options.thousands_separator, 'g');
  let trimed_str = str.replace(options.symbol, '').trim()
    .replace(tsre, '')
    .replace(options.decimal_separator, '.');
  return Number.parseFloat(trimed_str);
}

function isInInterval(str, options) {
  let { max, min } = options;

  // if max/min is empty there is no need check
  if (max === undefined && min === undefined) {
    return true;
  }

  const min_val = numericValue(min, options);
  const max_val = numericValue(max, options);
  const str_val = numericValue(str, options);

  const min_condition = min_val === undefined || min_val <= str_val;
  const max_condition = max_val === undefined || max_val >= str_val;

  return min_condition && max_condition;
}

export default function isCurrency(str, options) {
  assertString(str);
  options = merge(options, default_currency_options);
  return currencyRegex(options).test(str) && isInInterval(str, options);
}
