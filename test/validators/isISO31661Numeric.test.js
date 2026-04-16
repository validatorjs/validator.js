import test from '../testFunctions';

describe('isISO31661Numeric', () => {
  it('should validate ISO 3166-1 numeric country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_numeric
    test({
      validator: 'isISO31661Numeric',
      valid: [
        '076',
        '208',
        '276',
        '348',
        '380',
        '410',
        '440',
        '528',
        '554',
        '826',
      ],
      invalid: [
        '',
        'NL',
        'NLD',
        '002',
        '197',
        '249',
        '569',
        '810',
        '900',
        '999',
      ],
    });
  });
});
