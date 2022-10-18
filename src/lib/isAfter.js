import assertString from './util/assertString';
import toDate from './toDate';

export default function isAfter(str, options) {
  assertString(str);

  let date;

  if (typeof (options) === 'object') {
    date = options.date;
  } else { // backwards compatibility: isAfter(str [, date])
    // eslint-disable-next-line prefer-rest-params
    date = arguments[1];
  }

  if (!date) {
    date = String(new Date());
  }

  const comparison = toDate(date);
  const original = toDate(str);
  return !!(original && comparison && original > comparison);
}
