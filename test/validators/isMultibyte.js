import { test } from './testUtils';

describe('isMultibyte', () => {
  it('should validate multibyte strings', () => {
    test({
      validator: 'isMultibyte',
      valid: [
        'ひらがな・カタカナ、．漢字',
        'あいうえお foobar',
        'test＠example.com',
        '1234abcDEｘｙｚ',
        'ｶﾀｶﾅ',
        '中文',
      ],
      invalid: [
        'abc',
        'abc123',
        '<>@" *.',
      ],
    });
  });
});
