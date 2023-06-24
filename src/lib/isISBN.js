import assertString from './util/assertString';

const possibleIsbn10 = /^(?:[0-9]{9}X|[0-9]{10})$/;
const possibleIsbn13 = /^(?:[0-9]{13})$/;
const factor = [1, 3];

export default function isISBN(isbn, options) {
  assertString(isbn);

  // For backwards compatibility:
  // isISBN(str [, version]), i.e. `options` could be used as argument for the legacy `version`
  const version = String(options?.version || options);

  if (!(options?.version || options)) {
    return isISBN(isbn, { version: 10 }) || isISBN(isbn, { version: 13 });
  }

  const sanitizedIsbn = isbn.replace(/[\s-]+/g, '');

  let checksum = 0;

  if (version === '10') {
    if (!possibleIsbn10.test(sanitizedIsbn)) {
      return false;
    }

    for (let i = 0; i < version - 1; i++) {
      checksum += (i + 1) * sanitizedIsbn.charAt(i);
    }

    if (sanitizedIsbn.charAt(9) === 'X') {
      checksum += 10 * 10;
    } else {
      checksum += 10 * sanitizedIsbn.charAt(9);
    }

    if ((checksum % 11) === 0) {
      return true;
    }
  } else if (version === '13') {
    if (!possibleIsbn13.test(sanitizedIsbn)) {
      return false;
    }

    for (let i = 0; i < 12; i++) {
      checksum += factor[i % 2] * sanitizedIsbn.charAt(i);
    }

    if (sanitizedIsbn.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
      return true;
    }
  }

  return false;
}
