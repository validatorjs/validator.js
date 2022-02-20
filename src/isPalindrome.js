import assertString from './util/assertString';

export default function isPalindrome(str) {
  assertString(str);

  for (let i = 0; i < str.length / 2; i++) {
    if (str[i] !== str[str.length - i - 1]) return false;
  }

  return true;
}
