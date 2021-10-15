import { test } from './testUtils';

describe('isISO4217', () => {
  it('should validate ISO 4217 corrency codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_4217
    test({
      validator: 'isISO4217',
      valid: [
        'AED',
        'aed',
        'AUD',
        'CUC',
        'EUR',
        'GBP',
        'LYD',
        'MYR',
        'SGD',
        'USD',
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
      ],
    });
  });
});
