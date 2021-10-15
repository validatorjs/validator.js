import { test } from './testUtils';

describe('isSurrogatePair', () => {
  it('should validate surrogate pair strings', () => {
    test({
      validator: 'isSurrogatePair',
      valid: [
        '𠮷野𠮷',
        '𩸽',
        'ABC千𥧄1-2-3',
      ],
      invalid: [
        '吉野竈',
        '鮪',
        'ABC1-2-3',
      ],
    });
  });
});
