import assert from 'assert';
import { emojiPattern, emojiVersion } from '../src/lib/util/emoji';
import emojis from './fixtures/emoji';

describe('RGI emoji data', () => {
  it('should match every Unicode Emoji 18.0 RGI character and sequence', () => {
    const regex = new RegExp(`^(?:${emojiPattern})(?![\\s\\S])`);
    assert.strictEqual(emojiVersion, '18.0');
    assert.strictEqual(emojis.length, 3972);
    emojis.forEach((emoji) => {
      assert.strictEqual(regex.test(emoji), true, JSON.stringify(emoji));
    });
  });
});
