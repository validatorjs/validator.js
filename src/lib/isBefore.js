import assertString from './util/assertString';

export default function isBefore(date, options = {}) {
  assertString(date);

  const { comparisonDate = Date().toString() } = options;
  const comparison = new Date(comparisonDate);
  const original = new Date(date);

  return !!(original < comparison);
}
