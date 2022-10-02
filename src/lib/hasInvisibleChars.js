import assertString from './util/assertString';

const invisibleChars = /^[^\u00ad\u034f\u061c\u115f\u1160\u17b4\u17b5\u180e\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\u206a\u206b\u206c\u206d\u206e\u206f\ufeff]+$/i;

// check this site https://invisible-characters.com/ for list of invisible chars. I have excluded the space characters that are part of \s regex check
// eslint-disable-next-line max-len
// \s matches any whitespace character (equivalent to [\r\n\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff])
export default function hasInvisibleChars(str) {
  assertString(str);
  return !invisibleChars.test(str);
}
