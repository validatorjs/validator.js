import assertString from './util/assertString';

const lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
const long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;

export default function (str) {
  assertString(str);
  if (!str.includes(',')) return false;
  const pair = str.split(',');
  return lat.test(pair[0]) && long.test(pair[1]);
}
