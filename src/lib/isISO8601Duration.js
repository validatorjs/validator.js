import assertString from './util/assertString';

const quantity = '\\d+(?:[.,]\\d+)?';
const duration = new RegExp(`^P(?=\\d|T\\d)(?:${quantity}Y)?(?:${quantity}M)?(?:${quantity}D)?`
  + `(?:T(?=\\d)(?:${quantity}H)?(?:${quantity}M)?(?:${quantity}S)?)?$`);
const weeks = new RegExp(`^P${quantity}W$`);
const fractionalComponent = /^[.,]\d+[YMDHMSW]$/;

function alternativePattern(dateSeparator, timeSeparator) {
  // ISO 8601:2004, 4.4.3.3: these fields describe quantities, not a calendar date.
  const completeDate = `\\d{4}${dateSeparator}`
    + `(?:(?:0\\d|1[0-2])${dateSeparator}(?:[0-2]\\d|30)|(?:[0-2]\\d{2}|3[0-5]\\d|36[0-6]))`;
  // Reduced dates cannot be combined with a time component (4.3.3).
  const reducedDate = '(?:\\d{4}(?:-(?:0\\d|1[0-2]))?|\\d{2})(?!T)';
  return new RegExp(`^P(?=\\d|T\\d)(?:${completeDate}|${reducedDate})?`
    + `(?:T([01]\\d|2[0-4])(?:${timeSeparator}([0-5]\\d|60)(?:${timeSeparator}([0-5]\\d|60))?)?`
    + '([.,]\\d+)?)?$');
}

const alternativeBasic = alternativePattern('', '');
const alternativeExtended = alternativePattern('-', ':');

export default function isISO8601Duration(str) {
  assertString(str);

  const match = duration.exec(str) || weeks.exec(str);
  // JavaScript's $ anchor also matches before a final line terminator.
  if (match && match[0].length === str.length) {
    // A fraction may only appear in the lowest-order component present.
    const fraction = str.search(/[.,]/);
    return fraction === -1 || fractionalComponent.test(str.slice(fraction));
  }

  const alternative = alternativeBasic.exec(str) || alternativeExtended.exec(str);
  if (!alternative || alternative[0].length !== str.length) {
    return false;
  }

  // Compare the fraction as text so rounding cannot hide an exceeded carry-over point.
  const lowest = alternative[3] || alternative[2] || alternative[1];
  const limit = alternative[2] ? '60' : '24';
  return lowest !== limit || !/[1-9]/.test(alternative[4] || '');
}
