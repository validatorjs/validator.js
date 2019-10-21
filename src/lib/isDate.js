import assertString from './util/assertString';

export default function isDate(str) {
  assertString(str);
  return (new Date(str) !== 'Invalid Date') && !isNaN(new Date(str));
}
