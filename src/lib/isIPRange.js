import assertString from './util/assertString';

const ipv4RangeMaybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;

export default function isIPRange(str, version = '') {
  assertString(str);
  version = String(version);
  if (!version) {
    return isIPRange(str, 4) || isIPRange(str, 6);
  } else if (version === '4') {
    if (!ipv4RangeMaybe.test(str)) {
      return false;
    }
    const parts = str.split('.').sort((a, b) => a - b);
    const lastPart = parts[3].split('/');
    return parts[2] <= 255 && lastPart[0] <= 255 && lastPart[1] <= 32;
  } else if (version === '6') {
    // This part needs a solution
    return false;
  }
  return false;
}
