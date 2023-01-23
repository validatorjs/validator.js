export default function isCnpj(cnpj) {
  let cnpjClean = cnpj.replace(/[^\d]+/g, '');
  let constants = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  if (cnpjClean === '' || cnpjClean.length !== 14) return false;
  let newCnpj = cnpjClean.split('');
  newCnpj.splice(12, 2);

  for (let i = 0; i < 2; i++) {
    let somaNumberCnpj = newCnpj
      .reduce((total, value, indice) => total + (constants[indice] * value), 0);

    constants.unshift(constants[0] + 1);
    let digit = 11 - (somaNumberCnpj % 11);
    if (digit > 9) {
      newCnpj.push(0);
    } else {
      newCnpj.push(digit);
    }
  }

  newCnpj = newCnpj.join('');
  return cnpjClean === newCnpj;
}
