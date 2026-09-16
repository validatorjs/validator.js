import test from '../testFunctions';

describe('isFQDN', () => {
  it('should reject unpaired UTF-16 surrogates without throwing', () => {
    [undefined, { ignore_max_length: true }].forEach((options) => {
      test({
        validator: 'isFQDN',
        args: [options],
        valid: ['example.com', 'é.com', '\uD83D\uDE00.com', 'a\uD83D\uDE00b.com'],
        invalid: [
          '\uD800.com',
          '\uDC00.com',
          '\uD800abc.com',
          '\uDC00abc.com',
          'a\uD800b.com',
          'a\uDC00b.com',
          'abc\uD800.com',
          'abc\uDC00.com',
          '\uD83D\uDE00\uDC00.com',
          '\uD800\uD83D\uDE00.com',
        ],
      });
    });
  });

  it('should validate domain names.', () => {
    test({
      validator: 'isFQDN',
      args: [],
      valid: [
        'google.com',
      ],
      invalid: [
        'google.l33t',
      ],
    });
    test({
      validator: 'isFQDN',
      args: [{ allow_numeric_tld: true }],
      valid: [
        'google.com',
        'google.l33t',
      ],
      invalid: [
      ],
    });
  });
});
