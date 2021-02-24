import assertString from './util/assertString';

const macAddress = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){4}([0-9a-fA-F]{2})$/;
const macAddressNoSeparators = /^([0-9a-fA-F]){12}$/;
const macAddressWithDots = /^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/;

export default function isMACAddress(str, options) {
  assertString(str);
  /**
   * @deprecated `no_colons` TODO: remove it in the next major
  */
  if (options && (options.no_colons || options.no_separators)) {
    return macAddressNoSeparators.test(str);
  }

  return macAddress.test(str)
    || macAddressWithDots.test(str);
}
