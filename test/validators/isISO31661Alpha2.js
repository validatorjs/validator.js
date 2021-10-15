import { test } from './testUtils';

describe('isISO31661Alpha2', () => {
  it('should validate ISO 3166-1 alpha 2 country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    test({
      validator: 'isISO31661Alpha2',
      valid: [
        'FR',
        'fR',
        'GB',
        'PT',
        'CM',
        'JP',
        'PM',
        'ZW',
        'MM',
        'cc',
        'GG',
      ],
      invalid: [
        '',
        'FRA',
        'AA',
        'PI',
        'RP',
        'WV',
        'WL',
        'UK',
        'ZZ',
      ],
    });
  });
});
