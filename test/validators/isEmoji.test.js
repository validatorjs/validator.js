import assert from 'assert';
import validator from '../../src';
import test from '../testFunctions';
import emojis from '../fixtures/emoji';

describe('isEmoji', () => {
  it('should validate exactly one complete RGI emoji', () => {
    test({
      validator: 'isEmoji',
      valid: [
        '❤️', '✅', '🟢', '😆', '🇰🇷', '👍🏽', '👨‍👩‍👧‍👦', '🏳️‍🌈',
        '1️⃣', '#️⃣', '*️⃣', '©️', '®️', 'ℹ️', '™️', '🏽', '🦰',
        '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F',
      ],
      invalid: [
        '', '🟢😆', '😀😀', 'hello 😀', '😀 world', '$', '123', '#', '*',
        '❤', '©', '®', 'ℹ', '™', '안녕하세요', 'ABC', 'e\u0301',
        '\uFE0F', '\uFE0E', '\u200D', '\u20E3', '\uD83D', '\uDE00',
        '\uD840\uDC00', '\uD83C\uDDE6', '1\u20E3', '🐱\u200D',
        '😃\uFE0E', '😀\uFE0F', '👨‍👨', '🐱🏽',
      ],
    });
  });

  it('should validate every Unicode Emoji 18.0 RGI character and sequence', () => {
    emojis.forEach((emoji) => {
      assert.strictEqual(validator.isEmoji(emoji), true, JSON.stringify(emoji));
      assert.strictEqual(validator.isEmoji(emoji + emoji), false, JSON.stringify(emoji));
    });
  });

  it('should preserve whitespace and other surrounding characters', () => {
    const surroundings = [
      ' ', '\t', '\n', '\r', '\r\n', '\u00A0', '\u2003',
      '\u2028', '\u2029', '\uFEFF', '\u200B', 'a',
    ];
    surroundings.forEach((surrounding) => {
      assert.strictEqual(validator.isEmoji(`${surrounding}😀`), false);
      assert.strictEqual(validator.isEmoji(`😀${surrounding}`), false);
      assert.strictEqual(validator.isEmoji(`${surrounding}😀${surrounding}`), false);
    });
    assert.strictEqual(validator.isEmoji('👨 ‍👩‍👧‍👦'), false);
    assert.strictEqual(validator.isEmoji(validator.trim(' 😀 ')), true);
  });

  it('should preserve compatibility characters without normalization', () => {
    ['ℹ️', '™️'].forEach((emoji) => {
      assert.strictEqual(validator.isEmoji(emoji), true);
      assert.strictEqual(validator.isEmoji(emoji.normalize('NFKC')), false);
      assert.strictEqual(validator.isEmoji(emoji.normalize('NFKD')), false);
    });
  });

  it('should return consistent results across repeated calls', () => {
    for (let i = 0; i < 3; i++) {
      assert.strictEqual(validator.isEmoji('❤️'), true);
      assert.strictEqual(validator.isEmoji('❤'), false);
      assert.strictEqual(validator.isEmoji('👍🏽'), true);
    }
  });

  it('should throw a TypeError for non-string input', () => {
    [undefined, null, [], {}, true, 42, NaN].forEach((value) => {
      assert.throws(() => validator.isEmoji(value), TypeError);
    });
  });
});
