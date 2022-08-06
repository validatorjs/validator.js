import assertString from './util/assertString';

/* eslint-disable prefer-rest-params */
export default function isLength(str, options) {
  assertString(str);
  let min;
  let max;
  let exact;
  let result;
  let isPerfect = false;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
    exact = options.exact;
  } else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
    exact = arguments[3];
  }
  const presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || [];
  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  const len = str.length - presentationSequences.length - surrogatePairs.length;
  result = len >= min && (typeof max === 'undefined' || len <= max);
  if (result === false || typeof exact === 'undefined') return result;
  if (Array.isArray(exact) === true) {
    for (let oneElem of exact) {
      if (len === oneElem) {
        isPerfect = true;
        break;
      }
    }
  } else if (typeof exact === 'number') {
    if (len === exact) {
      isPerfect = true;
    }
  } else if (typeof exact === 'object') {
    for (let key in exact) {
      if (len === exact[key]) {
        isPerfect = true;
        break;
      }
    }
  } else { }
  return isPerfect;
}
