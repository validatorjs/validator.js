import assertString from './util/assertString';

/* eslint-disable max-len */
const IDS = {
  'es-ES': function (str) {
    const spanishID = /(\d{8})(\s|-)?([a-zA-Z]{1})$/;
    const isValidFormat = spanishID.test(str);
    if (!isValidFormat) {
      return false;
    }
    const letter = str[str.length - 1];
    const encoder = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const sum = str
      .replace(/[ a-zA-Z_-]+/, '')
      .split('')
      .reduce((acc, digit) => acc + Number(digit));

    return letter.toUpperCase() === encoder[sum % 23];
  },
  'ko-KR': function (str) {
    if (!/^\d{6}\-?(1|2)\d{6}$/.test(str)) {
      return false;
    }
    str = str.replace(/\-/g, '');
    let len = str.length;
    if (len !== 13) {
      return false;
    }
    const ck = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let result = 0;
    for (let i = 0; i < (str.length - 1); i++) {
      result += parseInt(str.charAt(i), 10) * ck[i];
    }
    result = (11 - (result % 11)) % 10;
    if (result === parseInt(str.charAt(12), 10)) {
      return true;
    }
    return false;
  },
  'zh-CN': function (str) {
    str = str.toUpperCase().replace(/[^0-9X]/g, '');
    let len = str.length;
    if (len !== 18) {
      return false;
    }
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(str)) {
      return false;
    }
    const aCity = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91];
    if (aCity.indexOf[parseInt(str.substr(0, 2), 10)] === -1) {
      return false;
    }
    const re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    let arrSplit = str.match(re);
    let dtmBirth = new Date(`${arrSplit[2]}'/'${arrSplit[3]}'/'${arrSplit[4]}`);
    let bGoodDay = dtmBirth.getFullYear() === Number(arrSplit[2]) && dtmBirth.getMonth() + 1 === Number(arrSplit[3]) && dtmBirth.getDate() === Number(arrSplit[4]);
    if (!bGoodDay) {
      return false;
    }
    let nTemp = 0;
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    for (let i = 0; i < 17; i++) {
      nTemp += str.substr(i, 1) * arrInt[i];
    }
    let valstr = arrCh[nTemp % 11];
    if (valstr === str.substr(17, 1)) {
      return true;
    }
    return false;
  },
};
/* eslint-enable max-len */

export default function isID(str, locale) {
  assertString(str);
  if (locale in IDS) {
    if (typeof IDS[locale] === 'function') {
      return IDS[locale](str);
    }
    return IDS[locale].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}
