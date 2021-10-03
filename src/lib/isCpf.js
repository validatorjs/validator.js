import assertString from './util/assertString';

// Brazilian CPF (Cadastro de Pessoas Físicas)

export default function isCpf(cpfString) {
  assertString(cpfString);

  let sum = 0;
  let rest;

  const cpf = cpfString.toString().replace(/[^0-9]+/g, '');

  if (cpf === '00000000000') {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) {
    rest = 0;
  }

  if (rest !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }
  return true;
}

