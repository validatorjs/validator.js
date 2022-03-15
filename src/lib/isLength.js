import assertString from './assertString';

/* eslint-disable prefer-rest-params */
export default function isLength(str, options) {
  assertString(str);
  let min;
  let max;
  let exact;
  let match = false;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
    exact = options.exact
  } else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
    exact = arguments[3];

  }
  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  const len = str.length - surrogatePairs.length;
  if (exact && (len >= min && (typeof max === 'undefined' || len <= max))) {
    exact.forEach(element => {
      if(len === element){
        match = true;
      }
    })
  } else {
    return len >= min && (typeof max === 'undefined' || len <= max);
  }
  return match;
}