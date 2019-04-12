import assertString from './util/assertString';
var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
var _long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
export default function (str) {
  assertString(str);
  if (!str.includes(',')) return false;
  var pair = str.split(',');
  return lat.test(pair[0]) && _long.test(pair[1]);
}