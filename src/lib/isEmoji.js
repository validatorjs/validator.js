import assertString from './util/assertString';

const emoji = /\p{Emoji_Presentation}/u;

export default function isEmoji(str) {
  assertString(str)
  return emoji.test(str);
}