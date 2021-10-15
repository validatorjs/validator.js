import { test } from './testUtils';

describe('isVAT', () => {
  it('should validate VAT numbers', () => {
    test({
      validator: 'isVAT',
      args: ['GB'],
      valid: [
        'GB999 9999 00',
        'GB999 9999 96',
        'GB999999999 999',
        'GBGD000',
        'GBGD499',
        'GBHA500',
        'GBHA999',
      ],
      invalid: [
        'GB999999900',
        'GB999999996',
        'GB999 9999 97',
        'GB999999999999',
        'GB999999999 9999',
        'GB9999999999 999',
        'GBGD 000',
        'GBGD 499',
        'GBHA 500',
        'GBHA 999',
        'GBGD500',
        'GBGD999',
        'GBHA000',
        'GBHA499',
      ],
    });

    test({
      validator: 'isVAT',
      args: ['IT'],
      valid: [
        'IT12345678910',
        '12345678910',
      ],
      invalid: [
        'IT12345678 910',
        'IT 123456789101',
        'IT123456789101',
        'GB12345678910',
        'IT123456789',
      ],
    });

    test({
      validator: 'isVAT',
      args: ['NL'],
      valid: [
        'NL123456789B10',
        '123456789B10',
      ],
      invalid: [
        'NL12345678 910',
        'NL 123456789101',
        'NL123456789B1',
        'GB12345678910',
        'NL123456789',
      ],
    });

    test({
      validator: 'isVAT',
      args: ['invalidCountryCode'],
      error: [
        'GB999 9999 00',
      ],
    });
  });
});
