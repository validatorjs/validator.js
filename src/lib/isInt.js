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

  // Check min/max/lt/gt
  let minCheckPassed = (!options.hasOwnProperty('min') || isNullOrUndefined(options.min) || str >= options.min);
  let maxCheckPassed = (!options.hasOwnProperty('max') || isNullOrUndefined(options.max) || str <= options.max);
  let ltCheckPassed = (!options.hasOwnProperty('lt') || isNullOrUndefined(options.lt) || str < options.lt);
  let gtCheckPassed = (!options.hasOwnProperty('gt') || isNullOrUndefined(options.gt) || str > options.gt);

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
