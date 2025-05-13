import assertString from './util/assertString';

const isMask = /[.-]/g;
const repeatedDigitsRegex = /^(\d)\1{10}$/;

export default function isCPF(cpf) {
  assertString(cpf);

  let cleanedCPF = String(cpf);

  if (isMask.test(cleanedCPF)) {
    cleanedCPF = cleanedCPF.replace(isMask, '');
  }

  if (cleanedCPF.length !== 11) return false;
  if (repeatedDigitsRegex.test(cleanedCPF)) return false;

  const paramD1 = {
    10: 0, 9: 1, 8: 2, 7: 3, 6: 4, 5: 5, 4: 6, 3: 7, 2: 8,
  };
  const paramD2 = {
    11: 0, 10: 1, 9: 2, 8: 3, 7: 4, 6: 5, 5: 6, 4: 7, 3: 8, 2: 9,
  };
  let firstNineCharacters = cleanedCPF.slice(0, 9);
  let d1 = 0;
  let d2 = 0;

  for (let i = 10; i >= 2; i--) {
    if (Number.isNaN(Number(firstNineCharacters[paramD1[i]]))) return false;
    d1 += Number(firstNineCharacters[paramD1[i]]) * i;
  }

  if (d1 % 11 < 2) {
    d1 = 0;
  } else {
    d1 = 11 - (d1 % 11);
  }

  firstNineCharacters += String(d1);

  for (let i = 11; i >= 2; i--) {
    d2 += Number(firstNineCharacters[paramD2[i]]) * i;
  }

  if (d2 % 11 < 2) {
    d2 = 0;
  } else {
    d2 = 11 - (d2 % 11);
  }

  return cleanedCPF.slice(-2) === `${d1}${d2}`;
}
