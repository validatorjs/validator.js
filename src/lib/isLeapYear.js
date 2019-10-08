import assertString from './util/assertString';

export default function isLeapYear(str) {
  assertString(str);
  let isValidPositiveNumber = (!isNaN(str) && parseInt(str, 10) > 0);

  return isValidPositiveNumber
    ? ((str % 4 === 0 && str % 100 !== 0) || str % 400 === 0)
    : isValidPositiveNumber;
}
