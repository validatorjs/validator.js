import assertString from './util/assertString';

const xtz = /^(tz1|KT1)[0-9a-zA-Z]{33}$/;

export default function isTezosAddress(str) {
  assertString(str);
  return xtz.test(str);
}
