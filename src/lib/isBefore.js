import toDate from './toDate';

export default function isBefore(date, options) {
  // accessing 'arguments' for backwards compatibility: isBefore(date [, comparisonDate])
  // eslint-disable-next-line prefer-rest-params
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : arguments[1]) || Date().toString();
  const comparison = toDate(comparisonDate);
  const original = toDate(date);

  return !!(original < comparison);
}
