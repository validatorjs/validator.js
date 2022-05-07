import assertString from './util/assertString';
import toDate from './toDate';

export default function isAfter(str, date = String(new Date())) {
  assertString(str);
  const comparison = toDate(date);
  const original = toDate(str);
  return !!(original && comparison && original > comparison);
}
