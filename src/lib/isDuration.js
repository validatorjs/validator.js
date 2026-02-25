import assertString from './util/assertString';

const BaseDurationUnits = [
  'Years',
  'Year',
  'Yrs',
  'Yr',
  'Y',
  'Weeks',
  'Week',
  'W',
  'Days',
  'Day',
  'D',
  'Hours',
  'Hour',
  'Hrs',
  'Hr',
  'H',
  'Minutes',
  'Minute',
  'Mins',
  'Min',
  'M',
  'Seconds',
  'Second',
  'Secs',
  'Sec',
  's',
  'Milliseconds',
  'Millisecond',
  'Msecs',
  'Msec',
  'Ms',
];

const AllDurationUnits = new Set(BaseDurationUnits.flatMap(unit => [
  unit, unit.toUpperCase(), unit.toLowerCase(),
]));

/**
 * Checks if the string is a valid duration.
 * It is designed to match the format used by the [ms](https://github.com/vercel/ms) package.
 * The duration can be "1 week","2 days","1h", "30m", "15 s", etc.
 */
export default function isDuration(value) {
  assertString(value);

  // Match number (integer or decimal) optionally followed by a unit
  // Supports: "1", "1.5", ".5", "-1", "-1.5", "-.5", "1h", "1.5 hours", etc.
  // Using indexed capture groups for Node.js <10 compatibility
  const match = value.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))(?:\s?([a-zA-Z]+))?$/);

  if (!match) {
    return false;
  }

  const unit = match[2];

  return unit === undefined || AllDurationUnits.has(unit);
}
