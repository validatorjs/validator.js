import assertString from './util/assertString';

/* eslint-disable no-control-regex */
let bitcoinregex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
/* eslint-enable no-control-regex */

export default function isBitcoinAddress(str) {
  assertString(str);
  return bitcoinregex.test(str);
}
