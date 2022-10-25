import toDate from './toDate';

export default function isAfter(date, options) {
  // accessing 'arguments' for backwards compatibility: isAfter(str [, date])
  // eslint-disable-next-line prefer-rest-params
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : arguments[1]) || Date().toString();

  const comparison = toDate(comparisonDate);
  const original = toDate(date);
  return !!(original > comparison);
}
