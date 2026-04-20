import test from '../testFunctions';

describe('isUppercase', () => {
  it('should validate uppercase strings', () => {
    test({
      validator: 'isUppercase',
      valid: [
        'ABC',
        'ABC123',
        'ALL CAPS IS FUN.',
        '   .',
      ],
      invalid: [
        'fooBar',
        '123abc',
      ],
    });
  });
});
