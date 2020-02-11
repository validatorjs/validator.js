import assertString from './util/assertString';

// supports Bech32 addresses
const btc = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

export default function isBtcAddress(str) {
  assertString(str);
  return btc.test(str);
}
