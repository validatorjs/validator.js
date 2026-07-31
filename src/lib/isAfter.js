import toDate from './toDate';

function resolveComparisonDate(options) {
  if (options instanceof Date) {
    return options;
  }
  if (typeof options === 'object' && options !== null) {
    return options.comparisonDate;
  }
  return options;
}

export default function isAfter(date, options) {
  // For backwards compatibility:
  // isAfter(str [, date]), i.e. `options` could be used as argument for the legacy `date`
  const comparisonDate = resolveComparisonDate(options) || Date().toString();

  const comparison = comparisonDate instanceof Date
    ? comparisonDate
    : toDate(comparisonDate);
  const original = toDate(date);

  return !!(original && comparison && original > comparison);
}
