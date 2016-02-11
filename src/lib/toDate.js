import assertString from '../util/assertString';

export default function toDate(date) {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return date;
  }
  assertString(date);
  date = Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
}
