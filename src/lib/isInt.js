import assertString from './util/assertString';

const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const intLeadingZeroes = /^[-+]?[0-9]+$/;

export default function isInt(str, options) {
  assertString(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  const regex = (
    // this strict equality check is required
    options.allow_leading_zeroes === false ?
      int : intLeadingZeroes
  );

  // Check min/max/lt/gt
  // When options.[option] is undefined or null, create an always-true check
  const minCheckPassed = str >= (options.min ?? -Infinity);
  const maxCheckPassed = str <= (options.max ?? Infinity);
  const ltCheckPassed = str < (options.lt ?? Infinity);
  const gtCheckPassed = str > (options.gt ?? -Infinity);

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
