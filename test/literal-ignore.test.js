import assert from 'assert';
import validator from '../index';

['isAlpha', 'isAlphanumeric'].forEach((method) => {
  describe(`${method} literal ignored characters`, () => {
    it('does not treat an ignored s as whitespace', () => {
      [' ', '\t', '\n', '\r', '\u00a0'].forEach((space) => {
        assert.strictEqual(validator[method](`ab${space}cd`, 'en-US', { ignore: 's' }), false);
      });
    });

    it('removes a literal s outside the selected alphabet', () => {
      assert.strictEqual(validator[method]('\u0430s\u0431', 'ru-RU', { ignore: 's' }), true);
    });

    it('continues to escape regular expression metacharacters', () => {
      const ignore = '-[]{}()*+?.,\\^$|#';
      assert.strictEqual(validator[method](`ab${ignore}cd`, 'en-US', { ignore }), true);
    });

    it('only ignores whitespace when explicitly requested', () => {
      assert.strictEqual(validator[method]('ab cd', 'en-US', { ignore: ' ' }), true);
      assert.strictEqual(validator[method]('ab\tcd', 'en-US', { ignore: ' ' }), false);
      assert.strictEqual(validator[method]('ab\tcd', 'en-US', { ignore: /\s/g }), true);
    });
  });
});
