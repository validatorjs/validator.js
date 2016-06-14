import assertString from './util/assertString';

export default function isCPF(str) {
  let strCPF;
  let sumCalc;
  let restCalc;
  let interation;
  assertString(str);

  strCPF = str.replace(/[^\d]+/g, '');

  if (strCPF === '' || strCPF.length !== 11 || strCPF === '00000000000' ||
      strCPF === '11111111111' || strCPF === '22222222222' || strCPF === '33333333333' ||
      strCPF === '44444444444' || strCPF === '55555555555' || strCPF === '66666666666' ||
      strCPF === '77777777777' || strCPF === '88888888888' || strCPF === '99999999999') {
    return false;
  }

  //  Check the first validation digit
  sumCalc = 0;
  for (interation = 0; interation < 9; interation++) {
    sumCalc = sumCalc + (parseInt(strCPF.charAt(interation), 10) * (10 - interation));
  }

  restCalc = (sumCalc * 10) % 11;
  if ((restCalc === 10) || (restCalc === 11)) {
    restCalc = 0;
  }

  if (restCalc !== parseInt(strCPF.charAt(9), 10)) {
    return false;
  }

  // Check the second validation digit
  sumCalc = 0;
  for (interation = 0; interation < 10; interation++) {
    sumCalc += parseInt(strCPF.charAt(interation), 10) * (11 - interation);
  }

  restCalc = (sumCalc * 10) % 11;
  if ((restCalc === 10) || (restCalc === 11)) {
    restCalc = 0;
  }

  if (restCalc !== parseInt(strCPF.charAt(10), 10)) {
    return false;
  }

  return true;
}
