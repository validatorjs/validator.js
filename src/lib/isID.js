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
    let birth = str.match(/^(\d{2})(\d{2})(\d{2})\-?([1-4])\d{6}$/);
    if (!birth) {
      return false;
    }

    let bd_txt = `${(birth[4] > 2 ? '20' : '19') + birth[1]}/${parseInt(birth[2], 10)}/${parseInt(birth[3], 10)}`;
    let bd = new Date(bd_txt);
    let new_bd_txt = `${bd.getFullYear()}/${bd.getMonth() + 1}/${bd.getDate()}`;
    let bd_check = (bd_txt === new_bd_txt);
    if (!bd_check) {
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

    const city_code = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91];
    if (city_code.indexOf[parseInt(str.substr(0, 2), 10)] === -1) {
      return false;
    }

    let birth = str.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    if (!birth) {
      return false;
    }

    let bd_txt = `${birth[2]}/${parseInt(birth[3], 10)}/${parseInt(birth[4], 10)}`;
    let bd = new Date(bd_txt);
    let new_bd_txt = `${bd.getFullYear()}/${bd.getMonth() + 1}/${bd.getDate()}`;
    let bd_check = (bd_txt === new_bd_txt);
    if (!bd_check) {
      return false;
    }

    let result = 0;
    const ckint = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const ck = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    for (let i = 0; i < 17; i++) {
      result += str.substr(i, 1) * ckint[i];
    }
    result = ck[result % 11];
    if (result === str.substr(17, 1)) {
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
