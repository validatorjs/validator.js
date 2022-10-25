import assertString from './util/assertString';
import toDate from './toDate';

export default function isBefore(date, options) {
  assertString(date);

  // accessing 'arguments' for backwards compatibility: isBefore(date [, date])
  // eslint-disable-next-line prefer-rest-params
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : arguments[1]) || Date().toString();
  const comparison = toDate(comparisonDate);
  const original = toDate(date);

  return !!(original < comparison);
}
