import assertString from './util/assertString';

const validators = {
  NO: (str) => {
    const sanitized = str.trim();
    if (isNaN(Number(sanitized))) return false;
    if (sanitized.length !== 11) return false;
    if (sanitized === '00000000000') return false;

    // https://no.wikipedia.org/wiki/F%C3%B8dselsnummer
    const f = sanitized.split('').map(Number);
    let k1 = (11 - (((3 * f[0]) + (7 * f[1]) + (6 * f[2])
      + (1 * f[3]) + (8 * f[4]) + (9 * f[5]) + (4 * f[6])
      + (5 * f[7]) + (2 * f[8])) % 11)) % 11;
    let k2 = (11 - (((5 * f[0]) + (4 * f[1]) + (3 * f[2])
      + (2 * f[3]) + (7 * f[4]) + (6 * f[5]) + (5 * f[6])
      + (4 * f[7]) + (3 * f[8]) + (2 * k1)) % 11)) % 11;
    if (k1 === 11) {
      k1 = 0;
    }
    if (k1 !== f[9] || k2 !== f[10]) return false;
    return true;
  },
};

export default function isIdentityNumber(str, locale) {
  assertString(str);
  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (const key in validators) {
      if (validators.hasOwnProperty(key)) {
        const validator = validators[key];
        if (validator(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
