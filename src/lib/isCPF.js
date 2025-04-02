import assertString from './util/assertString';


export default function isCPF(cpf) {
  assertString(cpf);
  if (cpf.length !== 11) return false;
  if (cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' || cpf === '88888888888' || cpf === '99999999999') return false;

  const paramD1 = {
    10: 0, 9: 1, 8: 2, 7: 3, 6: 4, 5: 5, 4: 6, 3: 7, 2: 8,
  };
  const paramD2 = {
    11: 0, 10: 1, 9: 2, 8: 3, 7: 4, 6: 5, 5: 6, 4: 7, 3: 8, 2: 9,
  };
  let firstNineCharacters = cpf.slice(0, 9);
  let d1 = 0;
  let d2 = 0;
  let d1AndD2 = '';

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

  d1AndD2 += d1;
  d1AndD2 += d2;

  if (d1AndD2 === cpf.slice(cpf.length - 2)) {
    return true;
  }

  return false;
}
