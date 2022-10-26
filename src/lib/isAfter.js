import assertString from './util/assertString';
import toDate from './toDate';

export default function isAfter(str, options) {
  assertString(str);

  // accessing 'arguments' for backwards compatibility: isAfter(str [, date])
  // eslint-disable-next-line prefer-rest-params
  const date = (typeof options === 'object' ? options.date : arguments[1]) || Date().toString();

  const comparison = toDate(date);
  const original = toDate(str);
  return !!(original && comparison && original > comparison);
}
