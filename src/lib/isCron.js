import assertString from './util/assertString';

const validMonths = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC',
};


const verifySecondsAndMinutes = (field) => {
  if (field === '*') {
    return true;
  }

  if (field.includes(',')) {
    const fieldList = field.split(',');
    return fieldList.every(second => verifySecondsAndMinutes(second));
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-');
    if (parseInt(start, 10) > 59 || parseInt(end, 10) > 59) {
      return false;
    }
    return parseInt(start, 10) < parseInt(end, 10);
  }

  if (field.includes('/')) {
    if (field.startsWith('*/')) {
      const interval = field.split('/')[1];
      return parseInt(interval, 10) < 60;
    }
    const [start, interval] = field.split('/');
    if (parseInt(start, 10) > 59 || parseInt(interval, 10) > 59) {
      return false;
    }
    return parseInt(start, 10) < 60 && parseInt(interval, 10) < 60;
  }

  return parseInt(field, 10) < 60;
};

const verifyHours = (hours) => {
  if (hours === '*') {
    return true;
  }

  if (hours.includes(',')) {
    const hoursList = hours.split(',');
    return hoursList.every(hour => verifyHours(hour));
  }

  if (hours.includes('-')) {
    const [start, end] = hours.split('-');
    if (parseInt(start, 10) > 23 || parseInt(end, 10) > 23) {
      return false;
    }
    return parseInt(start, 10) < parseInt(end, 10);
  }

  if (hours.includes('/')) {
    if (hours.startsWith('*/')) {
      const interval = hours.split('/')[1];
      return parseInt(interval, 10) < 24;
    }
    const [start, interval] = hours.split('/');
    if (parseInt(start, 10) > 23 || parseInt(interval, 10) > 23) {
      return false;
    }
    return parseInt(start, 10) < 24 && parseInt(interval, 10) < 24;
  }

  return parseInt(hours, 10) < 24;
};

const verifyDaysOfMonth = (dayOfMonth) => {
  if (dayOfMonth === '*') {
    return true;
  }

  if (dayOfMonth.includes(',')) {
    const dayOfMonthList = dayOfMonth.split(',');
    return dayOfMonthList.every(day => verifyDaysOfMonth(day));
  }

  if (dayOfMonth.includes('-')) {
    const [start, end] = dayOfMonth.split('-');
    if (parseInt(start, 10) > 31 || parseInt(end, 10) > 31
    || parseInt(start, 10) < 1 || parseInt(end, 10) < 1) {
      return false;
    }
    return parseInt(start, 10) < parseInt(end, 10);
  }

  if (dayOfMonth.includes('/')) {
    if (dayOfMonth.startsWith('*/')) {
      const interval = dayOfMonth.split('/')[1];
      return parseInt(interval, 10) < 32;
    }
    const [start, interval] = dayOfMonth.split('/');
    if (parseInt(start, 10) > 31 || parseInt(interval, 10) > 31
    || parseInt(start, 10) < 1 || parseInt(interval, 10) < 1) {
      return false;
    }
    return parseInt(start, 10) < 32 && parseInt(interval, 10) < 32;
  }

  if (dayOfMonth.startsWith('L')) {
    if (dayOfMonth.length > 1) {
      return false;
    }
    return true;
  }

  if (dayOfMonth.startsWith('L-')) {
    const daysBefore = dayOfMonth.split('L-')[1];
    return parseInt(daysBefore, 10) < 32 && parseInt(daysBefore, 10) > 0;
  }

  if (dayOfMonth.startsWith('LW')) {
    if (dayOfMonth.length > 2) {
      return false;
    }
    return true;
  }

  if (dayOfMonth.startsWith('LW-')) {
    const daysBefore = dayOfMonth.split('LW-')[1];
    return parseInt(daysBefore, 10) < 32 && parseInt(daysBefore, 10) > 0;
  }

  if (dayOfMonth.startsWith('W')) {
    const daysBefore = dayOfMonth.split('W')[1];
    return parseInt(daysBefore, 10) < 32 && parseInt(daysBefore, 10) > 0;
  }

  if (dayOfMonth.startsWith('W-')) {
    const daysBefore = dayOfMonth.split('W-')[1];
    return parseInt(daysBefore, 10) < 32 && parseInt(daysBefore, 10) > 0;
  }


  return parseInt(dayOfMonth, 10) < 32 && parseInt(dayOfMonth, 10) > 0;
};

const monthToNumber = (month) => {
  const monthAbbreviation = month.toUpperCase();
  const monthNumber = Object.keys(validMonths).find(key => validMonths[key] === monthAbbreviation);
  return monthNumber ? parseInt(monthNumber, 10) : null;
};

const verifyMonths = (month) => {
  if (month === '*') {
    return true;
  }

  if (month.includes(',')) {
    const monthList = month.split(',');
    return monthList.every(m => verifyMonths(m));
  }

  if (month.includes('-')) {
    const [start, end] = month.split('-');
    const startMonth = parseInt(start, 10);
    const endMonth = parseInt(end, 10);

    if (!startMonth || !endMonth || startMonth > 12 || endMonth > 12 ||
       startMonth < 1 || endMonth < 1) {
      return false;
    }
    return startMonth < endMonth;
  }

  if (month.includes('/')) {
    if (month.startsWith('*/')) {
      const interval = month.split('/')[1];
      return parseInt(interval, 10) < 13;
    }
    const [start, interval] = month.split('/');

    if (parseInt(start, 10) > 12 || parseInt(interval, 10) > 12 ||
       parseInt(start, 10) < 1 || parseInt(interval, 10) < 1) {
      return false;
    }
  }

  const numericMonth = parseInt(month, 10);
  return validMonths[numericMonth] !== undefined || monthToNumber(month) !== null;
};


const validDaysOfWeek = {
  1: 'SUN',
  2: 'MON',
  3: 'TUE',
  4: 'WED',
  5: 'THU',
  6: 'FRI',
  7: 'SAT',
};

const dayToNumber = (day) => {
  const dayAbbreviation = day.toUpperCase();
  const dayNumber = Object.keys(validDaysOfWeek)
    .find(key => validDaysOfWeek[key] === dayAbbreviation);
  return dayNumber ? parseInt(dayNumber, 10) : null;
};

const verifyDaysOfWeek = (day) => {
  if (day === '*') {
    return true;
  }

  if (day.includes(',')) {
    const dayList = day.split(',');
    return dayList.every(d => verifyDaysOfWeek(d));
  }

  if (day.includes('-')) {
    const [start, end] = day.split('-');
    const startDay = dayToNumber(start);
    const endDay = dayToNumber(end);

    if (!startDay || !endDay || startDay > 7 || endDay > 7 || startDay < 1 || endDay < 1) {
      return false;
    }
    return startDay < endDay;
  }

  const numericDay = parseInt(day, 10);
  return validDaysOfWeek[numericDay] !== undefined || dayToNumber(day) !== null;
};


export default function isCron(cron) {
  assertString(cron);
  if (cron.includes('(') || cron.includes(')')) {
    cron = cron.replace(/[(]/g, '');
    cron = cron.replace(/[)]/g, '');
  }


  const cronParts = cron.split(' ');

  if (cronParts.length !== 6) {
    return false;
  }

  const seconds = cronParts[0];
  const minutes = cronParts[1];
  const hours = cronParts[2];
  const dayOfMonth = cronParts[3];
  const month = cronParts[4];
  const dayOfWeek = cronParts[5];

  const validSeconds = verifySecondsAndMinutes(seconds);
  const validMinutes = verifySecondsAndMinutes(minutes);
  const validHours = verifyHours(hours);
  const validDayOfMonth = verifyDaysOfMonth(dayOfMonth);
  const validMonth = verifyMonths(month);
  const validDayOfWeek = verifyDaysOfWeek(dayOfWeek);

  return validSeconds && validMinutes && validHours &&
   validDayOfMonth && validMonth && validDayOfWeek;
}

