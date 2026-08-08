import assertString from './util/assertString';

/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */

const dateFullYear = /[0-9]{4}/;
const dateMonth = /(0[1-9]|1[0-2])/;
const dateMDay = /([12]\d|0[1-9]|3[01])/;

const timeHour = /([01][0-9]|2[0-3])/;
const timeMinute = /[0-5][0-9]/;
const timeSecond = /([0-5][0-9]|60)/;

const timeSecFrac = /(\.[0-9]+)?/;
const timeNumOffset = new RegExp(`[-+]${timeHour.source}:${timeMinute.source}`);
const timeOffset = new RegExp(`([zZ]|${timeNumOffset.source})`);

const partialTime = new RegExp(`${timeHour.source}:${timeMinute.source}:${timeSecond.source}${timeSecFrac.source}`);

const fullDate = new RegExp(`${dateFullYear.source}-${dateMonth.source}-${dateMDay.source}`);
const fullTime = new RegExp(`${partialTime.source}${timeOffset.source}`);

const rfc3339 = new RegExp(`^${fullDate.source}[ tT]${fullTime.source}$`);

function daysInMonth(year, month) {
  if (month === 2) {
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
  }
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export default function isRFC3339(str) {
  assertString(str);
  if (!rfc3339.test(str)) {
    return false;
  }
  const [, year, month, day] = str.match(/^(\d{4})-(\d{2})-(\d{2})/).map(Number);
  return day <= daysInMonth(year, month);
}
