import assertString from './util/assertString';

// https://mths.be/emoji
const EMOJI_REG = /<% RGI_Emoji %>|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}/;

export default function isEmoji(str) {
  assertString(str);

  return EMOJI_REG.test(str);
}
