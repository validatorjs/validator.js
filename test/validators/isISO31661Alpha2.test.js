import test from '../testFunctions';

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

  it('should validate user assigned alpha 2 code if provided', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [{ userAssignedCodes: ['XK', 'xl', '', 'x'] }],
      valid: ['BE', 'FR', 'GB', 'US', 'XK', 'XL'],
      invalid: ['XA', 'XB'],
    });
  });

  it('should not validate user assigned alpha 2 not valid code if provided', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [{ userAssignedCodes: ['', 'x', 'XXX'] }],
      valid: ['FR'],
      invalid: ['XXX', 'X'],
    });
  });

  it('should still validate ISO 3166-1 alpha 2 country codes if the options object is empty', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [{}],
      valid: ['FR', 'US'],
      invalid: ['XK'],
    });
  });

  it('should still validate ISO 3166-1 alpha 2 country codes if the userAssignedCodes option is empty', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [{ userAssignedCodes: [] }],
      valid: ['FR', 'US'],
      invalid: ['XK'],
    });
  });
});
