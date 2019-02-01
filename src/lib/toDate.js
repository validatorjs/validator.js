import { assertStringOrNumber } from './util/asserts';

export default function toDate(date) {
  assertStringOrNumber(date);
  if (!date) {
    return date;
  }
  if (typeof date === 'number') {
    date = String(date);
  }
  if (typeof date === 'string' && (/^\d+$/).test(date)) {
    if (date.length === 10) {
      date += '000';
    }
    date = new Date(Number(date));
  } else {
    date = Date.parse(date);
  }
  return !isNaN(date) ? new Date(date) : null;
}
