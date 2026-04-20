import test from '../testFunctions';

describe('isLowercase', () => {
  it('should validate lowercase strings', () => {
    test({
      validator: 'isLowercase',
      valid: [
        'abc',
        'abc123',
        'this is lowercase.',
        'tr竪s 端ber',
      ],
      invalid: [
        'fooBar',
        '123A',
      ],
    });
  });
});
