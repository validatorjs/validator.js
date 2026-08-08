import assertString from './util/assertString';

const possibleIsmn10 = /^M[0-9]{9}$/;
const possibleIsmn13 = /^9790[0-9]{9}$/;
const factor = [1, 3];

function hasValidCheckDigit(ismn) {
  let checksum = 0;

  for (let i = 0; i < 12; i++) {
    checksum += factor[i % 2] * Number(ismn.charAt(i));
  }

  return Number(ismn.charAt(12)) === ((10 - (checksum % 10)) % 10);
}

export default function isISMN(ismn) {
  assertString(ismn);

  const sanitizedIsmn = ismn.replace(/[\s-]+/g, '').toUpperCase();

  if (possibleIsmn10.test(sanitizedIsmn)) {
    return hasValidCheckDigit(`9790${sanitizedIsmn.slice(1)}`);
  }

  return possibleIsmn13.test(sanitizedIsmn) && hasValidCheckDigit(sanitizedIsmn);
}
