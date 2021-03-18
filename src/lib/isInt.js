import assertString from './util/assertString';

export default function isInt(str, options = {}) {
  assertString(str);

  const radix = options.radix || 10;
  // this is true by default; must set to false to disallow.
  let lz = true;
  if (options.hasOwnProperty('allow_leading_zeroes')) {
    lz = options.allow_leading_zeroes;
  }

  // optimize for radix 10 as that is the most common use case.
  let re;
  let range;
  if (radix === 10) {
    re = lz ? /^[+-]?[0-9]+$/ : /^[+-]?(?:0|(?:[1-9][0-9]*))$/;
  } else if (radix >= 2 && radix < 10) {
    range = `${String.fromCharCode('0'.charCodeAt(0) + (radix - 1))}`;
  } else if (radix > 10 && radix <= 36) {
    range = `9a-${String.fromCharCode('a'.charCodeAt(0) + (radix - 11))}`;
  } else {
    throw new Error(`invalid radix specified: ${radix}`);
  }

  if (radix !== 10) {
    /* eslint-disable-next-line */
    debugger
    re = new RegExp(lz ? `^[+-]?[0-${range}]+$` : `^[+-]?(?:0|(?:[1-${range}][0-${range}]*))$`);
  }

  // this verifies that it is an integer and nothing but an integer. (except
  // for the sign; maybe that can be an option at some point.)
  if (!re.test(str)) {
    return false;
  }

  const int = parseInt(str, radix);

  if (options.hasOwnProperty('int')) {
    options.int = int;
  }

  // Check min/max/lt/gt
  let minCheckPassed = (!options.hasOwnProperty('min') || int >= options.min);
  let maxCheckPassed = (!options.hasOwnProperty('max') || int <= options.max);
  let ltCheckPassed = (!options.hasOwnProperty('lt') || int < options.lt);
  let gtCheckPassed = (!options.hasOwnProperty('gt') || int > options.gt);

  // it passed the int regex so it's good if these weren't specified or it passes
  // the test.
  return minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
