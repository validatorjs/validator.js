import assertString from './util/assertString';
import isIP from './isIP';

const subnetMaybe = /^\d{1,2}$/;

export default function isIPRange(str) {
  assertString(str);
  const [ip, subnet, err] = str.split('/');

  if (typeof err !== 'undefined') {
    return false;
  }

  if (!subnetMaybe.test(subnet)) {
    return false;
  }

  // Disallow preceding 0 i.e. 01, 02, ...
  if (subnet.length > 1 && subnet.startsWith('0')) {
    return false;
  }

  return isIP(ip, 4) && subnet <= 32 && subnet >= 0;
}
