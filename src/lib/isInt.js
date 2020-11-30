import assertString from './util/assertString';
import hasOption from './util/hasOption';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  let regex = (
    hasOption(options, 'allow_leading_zeroes') && !options.allow_leading_zeroes ?
      int : intLeadingZeroes
  );

  // Check min/max/lt/gt
  let minCheckPassed = (!hasOption(options, 'min') || str >= options.min);
  let maxCheckPassed = (!hasOption(options, 'max') || str <= options.max);
  let ltCheckPassed = (!hasOption(options, 'lt') || str < options.lt);
  let gtCheckPassed = (!hasOption(options, 'gt') || str > options.gt);

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
