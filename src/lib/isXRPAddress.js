import assertString from './util/assertString';

const classicAddressRegex = /^r[A-HJ-NP-Za-km-z1-9]{24,35}$/;
const xAddressMainnetRegex = /^X[A-HJ-NP-Za-km-z1-9]{46,}$/;
const xAddressNonMainnetRegex = /^T[A-HJ-NP-Za-km-z1-9]{46,}$/;

export default function isXRPAddress(address, options) {
  assertString(address);

  if (typeof (options) !== 'object') {
    // only check for classic address
    return classicAddressRegex.test(address);
  }

  if (typeof (options.xAddress) !== 'object') {
    // just passthrough if user does not want to check anything
    return options.classicAddress ? classicAddressRegex.test(address) : true;
  }

  let xAddressRegex = xAddressMainnetRegex;
  if (options.xAddress.test) {
    xAddressRegex = xAddressNonMainnetRegex;
  }

  if (options.classicAddress) {
    return xAddressRegex.test(address) || classicAddressRegex.test(address);
  }

  return xAddressRegex.test(address);
}
