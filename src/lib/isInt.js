import assertString from './util/assertString';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  let regex = (
    options.hasOwnProperty('allow_leading_zeroes') && options.allow_leading_zeroes ?
    intLeadingZeroes :
    int
  );

  // Check min/max
  let minCheckPassed = (!options.hasOwnProperty('min') || str >= options.min);
  let maxCheckPassed = (!options.hasOwnProperty('max') || str <= options.max);

  return regex.test(str) && minCheckPassed && maxCheckPassed;
}
