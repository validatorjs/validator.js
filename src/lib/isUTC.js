import assertString from './util/assertString';

const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:[0-5]\d:[0-5]\dZ$/;
const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:[0-5]\d:[0-5]\d[+\/-]\d{2}:[0-5]\d$/;

const validHour = /(^[0-1]\d$)|(^2[0-3]$)/;
const validMonth = /(^0[1-9]$)|(^1[0-2]$)/;
const validDate = /(^0[1-9]$)|(^[1-2]\d$)|(^3[0-1]$)/;

function isValidHour(str) {
  return validHour.test(str);
}

function isValidMonth(str) {
  return validMonth.test(str);
}

function isValidDate(str) {
  return validDate.test(str);
}

function isValidTime(month, date, hour) {
  if (isValidMonth(month)) {
    if (isValidDate(date)) {
      if (isValidHour(hour)) {
        return true;
      }
    }
  }
  return false;
}

export default function isUTC(str, options) {
  assertString(str);

  if (options.ISO_8601) {
    if (ISO_8601.test(str)) {
      let valid = isValidTime(str.substring(5, 7), str.substring(8, 10), str.substring(11, 13));
      if (valid) {
        return isValidHour(str.substring(20, 22));
      }
    }
    return false;
  }
  if ((UTC.test(str))) {
    return isValidTime(str.substring(5, 7), str.substring(8, 10), str.substring(11, 13));
  }
  return false;
}

