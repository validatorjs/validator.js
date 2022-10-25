import assertString from './util/assertString';

export default function toDate(date) {
  assertString(date);

  return new Date(date);
}
