import assertString from './util/assertString';
import { emojiPattern } from './util/emoji';

const emoji = new RegExp(emojiPattern);

export default function hasEmoji(str) {
  assertString(str);
  return emoji.test(str);
}
