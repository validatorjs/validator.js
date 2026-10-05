import assert from 'assert';
import validator from '../../src';
import test from '../testFunctions';
import emojis from '../fixtures/emoji';

describe('hasEmoji', () => {
  it('should detect at least one complete RGI emoji', () => {
    test({
      validator: 'hasEmoji',
      valid: [
        'hello, world! 🎉', '😃😆🥰', '✅', '❤️', '🇰🇷', '👍🏽',
        '👨‍👩‍👧‍👦', '🏳️‍🌈', '1️⃣', '#️⃣', '*️⃣', '©️', '®️', '🏽', '🦰',
        '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F',
      ],
      invalid: [
        '', 'nice to meet you.', '안녕하세요', '123', '#', '*', '$',
        '❤', '©', '®', 'ℹ', '™', 'e\u0301', '\uFE0F', '\uFE0E',
        '\u200D', '\u20E3', '\uD83D', '\uDE00', '\uD840\uDC00',
        '\uD83C\uDDE6', '🇦🇦', '1\u20E3', '1\uFE0F',
      ],
    });
  });

  it('should detect every Unicode Emoji 18.0 RGI character and sequence', () => {
    emojis.forEach((emoji) => {
      assert.strictEqual(validator.hasEmoji(emoji), true, JSON.stringify(emoji));
      assert.strictEqual(validator.hasEmoji(`before ${emoji} after`), true);
    });
  });

  it('should detect valid substrings without validating the surrounding sequence', () => {
    ['🐱\u200D', '😃\uFE0E', '😀\uFE0F', '👨‍👨', '🐱🏽'].forEach((value) => {
      assert.strictEqual(validator.hasEmoji(value), true);
      assert.strictEqual(validator.isEmoji(value), false);
    });
  });

  it('should preserve whitespace without joining separated emoji components', () => {
    const surroundings = [
      ' ', '\t', '\n', '\r', '\r\n', '\u00A0', '\u2003',
      '\u2028', '\u2029', '\uFEFF', '\u200B',
    ];
    surroundings.forEach((surrounding) => {
      assert.strictEqual(validator.hasEmoji(`${surrounding}😀${surrounding}`), true);
      assert.strictEqual(validator.hasEmoji(surrounding), false);
      assert.strictEqual(validator.hasEmoji(`©${surrounding}\uFE0F`), false);
      assert.strictEqual(validator.hasEmoji(`1${surrounding}\uFE0F\u20E3`), false);
    });
  });

  it('should preserve compatibility characters without normalization', () => {
    ['ℹ️', '™️'].forEach((emoji) => {
      assert.strictEqual(validator.hasEmoji(emoji), true);
      assert.strictEqual(validator.hasEmoji(emoji.normalize('NFKC')), false);
      assert.strictEqual(validator.hasEmoji(emoji.normalize('NFKD')), false);
    });
  });

  it('should return consistent results across repeated calls', () => {
    for (let i = 0; i < 3; i++) {
      assert.strictEqual(validator.hasEmoji('hello 🎉'), true);
      assert.strictEqual(validator.hasEmoji('hello'), false);
      assert.strictEqual(validator.hasEmoji('❤️'), true);
    }
  });

  it('should throw a TypeError for non-string input', () => {
    [undefined, null, [], {}, true, 42, NaN].forEach((value) => {
      assert.throws(() => validator.hasEmoji(value), TypeError);
    });
  });
});
