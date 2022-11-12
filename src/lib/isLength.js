import assertString from './util/assertString';

/* eslint-disable prefer-rest-params */
export default function isLength(str, options) {
  assertString(str);
  let min;
  let max;
  let exact;
  let result;
  let isValid = false;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
    exact = options.exact;
  } else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
  }
  const presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || [];
  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  const len = str.length - presentationSequences.length - surrogatePairs.length;
  result = len >= min && (typeof max === 'undefined' || len <= max);
const isInsideRange =
len >= min && (typeof max === 'undefined' || len <= max);

if (isInsideRange && Array.isArray(options?.discreteLengths)) {
    return options.discreteLengths.some(discreteLen => discreteLen === len);
}

return isInsideRange;
