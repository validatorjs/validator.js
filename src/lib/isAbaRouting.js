import assertString from './util/assertString';

// http://www.brainjar.com/js/validation/
const isRoutingReg = /^[0-9]{9}$/;

export default function isAbaRouting(str) {
  assertString(str);
  str = str.trim();

  if (!isRoutingReg.exec(str)) return false;

  const strArr = str.split('');
  let checkSumVal = 0;
  for (let i = 0; i < strArr.length; i++) {
    if (i % 3 === 0) checkSumVal += strArr[i] * 3;
    else if (i % 3 === 1) checkSumVal += strArr[i] * 7;
    else checkSumVal += strArr[i] * 1;
  }
  return (checkSumVal % 10 === 0);
}
