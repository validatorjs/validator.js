import test from '../testFunctions';

describe('isISO4217', () => {
  it('should validate ISO 4217 corrency codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_4217
    test({
      validator: 'isISO4217',
      valid: [
        'AED',
        'aed',
        'AUD',
        'CUP',
        'EUR',
        'GBP',
        'LYD',
        'MYR',
        'SGD',
        'SLE',
        'USD',
        'VED',
        'SLE',
      ],
      invalid: [
        '',
        '$',
        'US',
        'us',
        'AAA',
        'aaa',
        'RWA',
        'EURO',
        'euro',
        'HRK',
        'CUC',
      ],
    });
  });
});
