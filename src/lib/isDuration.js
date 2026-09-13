import assertString from './util/assertString';

const durationRegex = /^(-?(?:\d+)?\.?\d+)(?:\s?([a-zA-Z]+))?$/;

const durationUnits = [
  'y', 'yr', 'yrs', 'year', 'years',
  'mo', 'month', 'months',
  'w', 'week', 'weeks',
  'd', 'day', 'days',
  'h', 'hr', 'hrs', 'hour', 'hours',
  'm', 'min', 'mins', 'minute', 'minutes',
  's', 'sec', 'secs', 'second', 'seconds',
  'ms', 'msec', 'msecs', 'millisecond', 'milliseconds',
];

export default function isDuration(str) {
  assertString(str);
  const match = str.match(durationRegex);
  if (!match) {
    return false;
  }
  const unit = match[2];
  if (unit === undefined) {
    return true;
  }
  return durationUnits.indexOf(unit.toLowerCase()) !== -1;
}
