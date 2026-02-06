import test from '../testFunctions';

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
        'XXK',
      ],
    });
  });

  it('should validate user assigned ISO 3166-1 alpha 3 code if provided', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{ userAssignedCodes: ['XXK', 'xxl'] }],
      valid: ['BEL', 'FRA', 'GBR', 'USA', 'XXK', 'XXL'],
      invalid: ['XXA', 'GGG'],
    });
  });

  it('should not validate user assigned ISO 3166-1 alpha 3 not valid code if provided', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{ userAssignedCodes: ['', 'x', 'XX', 'XXXX'] }],
      valid: ['FRA'],
      invalid: ['XX', 'XXXX', 'X'],
    });
  });

  it('should still validate ISO 3166-1 alpha 3 country codes if the options object is empty', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{}],
      valid: ['FRA', 'USA'],
      invalid: ['XXK'],
    });
  });

  it('should still validate ISO 3166-1 alpha 3 country codes if the userAssignedCodes option is empty', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{ userAssignedCodes: [] }],
      valid: ['FRA', 'USA'],
      invalid: ['XXK'],
    });
  });
});
