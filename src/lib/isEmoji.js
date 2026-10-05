import assertString from './util/assertString';
import { emojiPattern } from './util/emoji';

// Unlike $, the final assertion also rejects a trailing line terminator.
const emoji = new RegExp(`^(?:${emojiPattern})(?![\\s\\S])`);

export default function isEmoji(str) {
  assertString(str);
  return emoji.test(str);
}
