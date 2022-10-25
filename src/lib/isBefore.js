import assertString from './util/assertString';
import toDate from './toDate';

export default function isBefore(str, options = {}) {
  assertString(str);

  const { comparisonDate = Date().toString() } = options;
  const comparison = toDate(comparisonDate);
  const original = toDate(str);

  return !!(original && comparison && original < comparison);
}
