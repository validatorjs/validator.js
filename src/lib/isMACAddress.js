import assertString from './util/assertString';

const macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
const macAddressNoColons = /^([0-9a-fA-F]){12}$/;

export default function isMACAddress(str, options) {
  assertString(str);
  if (options && options.no_colons) {
    return macAddressNoColons.test(str);
  }
  return macAddress.test(str);
}
