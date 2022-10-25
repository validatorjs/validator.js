import assertString from './util/assertString';
import toDate from './toDate';

export default function isBefore(date, options = {}) {
  assertString(date);

  const { comparisonDate = Date().toString() } = options;
  const comparison = toDate(comparisonDate);
  const original = toDate(date);

  return !!(original < comparison);
}
