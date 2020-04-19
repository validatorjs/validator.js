import assertString from './util/assertString';

let vowels = 'aeiouAEIOU';

export default function isVowel(str) {
  assertString(str);
  // catch cases like AE || aeiou
  if (str.length > 1) return false;
  return vowels.includes(str);
}
