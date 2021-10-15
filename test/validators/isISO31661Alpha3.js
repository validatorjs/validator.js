import { test } from './testUtils';

describe('isISO31661Alpha3', () => {
  it('should validate ISO 3166-1 alpha 3 country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
    test({
      validator: 'isISO31661Alpha3',
      valid: [
        'ABW',
        'HND',
        'KHM',
        'RWA',
      ],
      invalid: [
        '',
        'FR',
        'fR',
        'GB',
        'PT',
        'CM',
        'JP',
        'PM',
        'ZW',
      ],
    });
  });
});
