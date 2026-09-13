import assertString from './util/assertString';
import isNullOrUndefined from './util/nullUndefinedCheck';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  const regex = options.allow_leading_zeroes === false ? int : intLeadingZeroes;

  // Check min/max/lt/gt
  let minCheckPassed = (!hasOwnProperty.call(options, 'min') || isNullOrUndefined(options.min) || str >= options.min);
  let maxCheckPassed = (!hasOwnProperty.call(options, 'max') || isNullOrUndefined(options.max) || str <= options.max);
  let ltCheckPassed = (!hasOwnProperty.call(options, 'lt') || isNullOrUndefined(options.lt) || str < options.lt);
  let gtCheckPassed = (!hasOwnProperty.call(options, 'gt') || isNullOrUndefined(options.gt) || str > options.gt);

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
