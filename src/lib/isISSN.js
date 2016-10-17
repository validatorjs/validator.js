import assertString from './util/assertString';

const issn = '^\\d{4}-?\\d{3}[\\dX]$';

export default function isISSN(str, options = {}) {
  assertString(str);
  let testIssn = issn;
  testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn;
  testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i');
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
