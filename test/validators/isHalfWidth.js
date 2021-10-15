import { test } from './testUtils';

describe('isHalfWidth', () => {
  it('should validate half-width strings', () => {
    test({
      validator: 'isHalfWidth',
      valid: [
        '!"#$%&()<>/+=-_? ~^|.,@`{}[]',
        'l-btn_02--active',
        'abc123い',
        'ｶﾀｶﾅﾞﾬ￩',
      ],
      invalid: [
        'あいうえお',
        '００１１',
      ],
    });
  });
});
