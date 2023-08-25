import assertString from './util/assertString';
import toDate from './toDate';
import isAfter from './isAfter';
import isBefore from './isBefore';

/* eslint-disable prefer-rest-params */
export default function isBetween(str, options) {
  assertString(str);
  const original = toDate(str);
  let startComparision;
  let endComparison;
  if (typeof (options) === 'object') {
    startComparision = options.startDate || Date().toString();
    endComparison = options.endDate || Date().toString();
  } else { // backwards compatibility: isBetween(str, startDate [, endDate])
    startComparision = arguments[1];
    endComparison = arguments[2];
  }

  return !!(original
    && startComparision && endComparison
    && isAfter(str, startComparision) && isBefore(str, endComparison));
}
