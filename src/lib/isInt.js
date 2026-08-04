import assertString from './util/assertString';
import isNullOrUndefined from './util/nullUndefinedCheck';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  const regex = options.allow_leading_zeroes === false ? int : intLeadingZeroes;

  if (!regex.test(str)) {
    return false;
  }

  // Compare numerically, not lexically. With `str >= options.min` (where
  // options.min is a number) JavaScript coerces `str` to a number for the
  // comparison, but the coercion is only performed one side at a time and a
  // future refactor that calls e.g. `String.prototype.localeCompare` or
  // `>=` between two strings would silently break — and the existing code
  // also mishandles negative bounds (`str >= -5` still works but `str
  // >= options.min` with options.min being a positive integer is the
  // only path currently exercised). Parsing here keeps the comparison
  // explicit and avoids any future string-comparison footgun.
  const num = Number(str);

  // Check min/max/lt/gt against the numeric value.
  let minCheckPassed = (!options.hasOwnProperty('min') || isNullOrUndefined(options.min) || num >= options.min);
  let maxCheckPassed = (!options.hasOwnProperty('max') || isNullOrUndefined(options.max) || num <= options.max);
  let ltCheckPassed = (!options.hasOwnProperty('lt') || isNullOrUndefined(options.lt) || num < options.lt);
  let gtCheckPassed = (!options.hasOwnProperty('gt') || isNullOrUndefined(options.gt) || num > options.gt);

  return minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
