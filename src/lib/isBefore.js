import assertString from '../util/assertString';
import toDate from './toDate';

export default function isBefore(str, date) {
  assertString(str);
  const comparison = toDate(date || new Date());
  const original = toDate(str);
  return !!(original && comparison && original < comparison);
}
