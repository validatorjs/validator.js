import assertString from './util/assertString';

const macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

export default function isMACAddress(str) {
  assertString(str);
  return macAddress.test(str);
}
