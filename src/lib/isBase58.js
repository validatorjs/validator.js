import assertString from './util/assertString';

// Accepted chars - 123456789ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz
const base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/;

export default function isBase58(str) {
  assertString(str);
  return base58Reg.test(str);
}
