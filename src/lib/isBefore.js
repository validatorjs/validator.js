import toDate from './toDate';

export default function isBefore(date, options) {
  // For backwards compatibility:
  // isBefore(str [, date]), i.e. `options` could be used as argument for the legacy `date`
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : options) || Date().toString();

  const comparison = toDate(comparisonDate);
  const original = toDate(date);

  return !!(original && comparison && original < comparison);
}
