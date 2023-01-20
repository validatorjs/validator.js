import assertString from './util/assertString.js';
import toDate from './toDate.js';

export default function isAfter(str, date = String(new Date())) {
  assertString(str);
  const comparison = toDate(date);
  const original = toDate(str);
  return !!(original && comparison && original > comparison);
}
