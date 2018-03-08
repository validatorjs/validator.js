import assertString from './util/assertString';

export const kana_patterns = {
  hiragana: /^[\u3041-\u3096\u3099-\u309A\u309D-\u309F]+$/,
  katakana: /^[\u30A0-\u30FF]+$/,
  'half-katakana': /^[\uFF61-\uFF9F]+$/,
};

export default function isKana(str, kana_type) {
  assertString(str);
  if (kana_type in kana_patterns) {
    return kana_patterns[kana_type].test(str);
  }
  throw new Error(`Invalid Kana type '${kana_type}'`);
}
