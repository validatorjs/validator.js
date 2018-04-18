import assertString from './util/assertString';

/* eslint-disable max-len */
const rfc3339 = /^[0-9]{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])[ tT]([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?([zZ]|[-+]([01][0-9]|2[0-3]):[0-5][0-9])$/;
/* eslint-enable max-len */

export default function isRFC3339(str) {
  assertString(str);
  return rfc3339.test(str);
}
