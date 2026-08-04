import assertString from "./util/assertString";

const sha256 = /^[a-f0-9]{64}$/;

export function isSHA256(str) {
  assertString(str);
  return sha256.test(str);
}
