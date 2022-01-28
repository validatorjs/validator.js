import assertString from './util/assertString';

/* eslint-disable no-control-regex */
const unitedStatesPhoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const internationalPhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
/* eslint-enable no-control-regex */

export default function isPhoneNumber(str) {
  assertString(str);
  return unitedStatesPhoneNumber.test(str) || internationalPhoneNumber.test(str);
}
