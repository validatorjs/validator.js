import assertString from './util/assertString';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  let regex = (
    options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ?
      int : intLeadingZeroes
  );

  // Check min/max/lt/gt
  let minCheckPassed = (!options.hasOwnProperty('min') || options.min === undefined || options.min === null || str >= options.min);
  let maxCheckPassed = (!options.hasOwnProperty('max') || options.max === undefined || options.max === null || str <= options.max);
  let ltCheckPassed = (!options.hasOwnProperty('lt') || options.lt === undefined || options.lt === null || str < options.lt);
  let gtCheckPassed = (!options.hasOwnProperty('gt') || options.gt === undefined || options.gt === null || str > options.gt);

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
