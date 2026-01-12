import assertString from './util/assertString';

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

export default function isEmoji(str) {
  assertString(str);
  return emojiRegex.test(str);
}
