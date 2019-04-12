import assertString from './util/assertString';
export default function ltrim(str, chars) {
  assertString(str);
  var pattern = chars ? new RegExp("^[".concat(chars, "]+"), 'g') : /^\s+/g;
  return str.replace(pattern, '');
}