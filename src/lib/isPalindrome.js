import assertString from './util/assertString';

export default function isPalindrome(str) {
  assertString(str);
  /* remove all special characters, spaces and make lowercase*/
  let removeChar = str.replace(/[^A-Z0-9]/ig, "").toLowerCase();
  let reverseStr = removeChar.split('').reverse().join('');
  return removeChar === reverseStr;
}
