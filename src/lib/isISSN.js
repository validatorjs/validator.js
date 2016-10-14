import assertString from './util/assertString';

const issn = /^\d{4}-\d{3}[\dX]$/;

export default function isISSN(str, options = {}) {
  assertString(str);
  const testIssn = options.case_sensitive ? issn : new RegExp(issn, 'i');
  if (!testIssn.test(str)) {
    return false;
  }
  const issnDigits = str.replace('-', '');
  let position = 8;
  let checksum = 0;
  for (const digit of issnDigits) {
    const digitValue = digit.toUpperCase() === 'X' ? 10 : +digit;
    checksum += digitValue * position;
    --position;
  }
  return checksum % 11 === 0;
}
