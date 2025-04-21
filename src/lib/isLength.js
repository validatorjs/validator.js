import assertString from './util/assertString';

export default function isLength(str, options) {
  assertString(str);
  let min;
  let max;

  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0; // eslint-disable-line prefer-rest-params
    max = arguments[2]; // eslint-disable-line prefer-rest-params
  }

  const presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || [];
  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  const len = str.length - presentationSequences.length - surrogatePairs.length;
  const isInsideRange = len >= min && (typeof max === 'undefined' || len <= max);

  if (isInsideRange && Array.isArray(options?.discreteLengths)) {
    return options.discreteLengths.some((discreteLen) => discreteLen === len);
  }

  return isInsideRange;
}
