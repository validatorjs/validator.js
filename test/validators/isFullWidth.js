import { test } from './testUtils';

describe('isFullWidth', () => {
  it('should validate full-width strings', () => {
    test({
      validator: 'isFullWidth',
      valid: [
        'ひらがな・カタカナ、．漢字',
        '３ー０　ａ＠ｃｏｍ',
        'Ｆｶﾀｶﾅﾞﾬ',
        'Good＝Parts',
      ],
      invalid: [
        'abc',
        'abc123',
        '!"#$%&()<>/+=-_? ~^|.,@`{}[]',
      ],
    });
  });
});
