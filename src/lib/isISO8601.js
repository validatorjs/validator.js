import assertString from './util/assertString';

/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function has53Week(year) {
  const d = new Date(Date.UTC(year, 11, 31)); // Dec 31st
  const UTCday = d.getUTCDay();
  // ISO weeks: week starts on Monday (1), ends Sunday (7)
  // Dec 31 must be Thursday (4) or it's a leap year ending on Wednesday (3)
  return UTCday === 4 || (UTCday === 3 && isLeapYear(year));
}

function lastDayofYear(year) {
  const dec31 = new Date(year, 11, 31);
  const lastDay = dec31.getDay();
  return lastDay === 0 ? 7 : lastDay;
}

const isValidIso8601 = (str) => {
  const iso8601 = /^(?:\d{4}(?:-\d{2}(?:-\d{2})?|-\d{3}|-W\d{2}(?:-\d)?)?)(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+\-]\d{2}:\d{2}|[+\-]\d{4}|[+\-]\d{2})?)?$/;
  //  this above regex check iso8601 format along with correct milisecond and second variation and T if time exist
  //  it rejects basic format(20251231) , only accepts date with extended format(2025-12-31).
  // future Bug: it doesnot validate astronomical year, change the regex and fix its working if it's needed
  const checkIso8601Format = iso8601.test(str);
  if (!checkIso8601Format) {
    return false;
  }

  //  need to check for ordinary dates
  const ordinalMatch = str.match(/^(\d{4})-?(\d{3})([T]{1}\.*|$)/);
  if (ordinalMatch) {
    const oYear = Number(ordinalMatch[1]);
    const oDay = Number(ordinalMatch[2]);
    // if is leap year
    if (isLeapYear(oYear)) return oDay <= 366;
    return oDay <= 365;
  }

  //  need to check for dates with week, dates with week and day
  const WeekMatch = str.match(/^(\d{4})-W(\d{2})(?:-(\d))?$/);
  if (WeekMatch) {
    const [, yearStr, weekStr, dayStr] = WeekMatch;
    const year = Number(yearStr);
    const week = parseInt(weekStr, 10);
    const day = dayStr ? parseInt(dayStr, 10) : null;
    // check if week is in correct range
    if (week < 1 || week > (has53Week(year) ? 53 : 52)) return false;
    // check if week is last week of year it means 53 or 52, does it ends in between the last day
    // check if day exist if it does it is in correct range
    if (day != null) {
      const maxValidDay = week === 53 || week === 52 ? lastDayofYear(year) : 7;
      if (day < 1 || day > maxValidDay) return false;
    }
    return true;
  }

  //  check for correct values in iso8601 format
  if (isNaN(Date.parse(str))) {
    return false;
  }

  // Final date check for correct range of date if it has month and day
  // for edge cases like feb 30 is parsed in date.parse so it should be checked manually so date.parse check for out of 31 days and rest is passed through it
  const dateMatch = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
  const year = dateMatch[1];
  const month = dateMatch[2];
  const day = dateMatch[3];
  // check for valid month and day
  if (month && day) {
    const d = new Date(Date.UTC(year, month - 1, day));
    return (
      d.getUTCFullYear() === year &&
      d.getUTCMonth() + 1 === month &&
      d.getUTCDate() === day
    );
  }

  return true;
};

export default function isISO8601(str) {
  assertString(str);
  return isValidIso8601(str);
}
