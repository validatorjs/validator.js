import test from '../testFunctions';

describe('isISO31661Alpha2', () => {
  it('should validate official alpha 2 code', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [],
      valid: ['BE', 'FR', 'GB', 'US'],
      invalid: ['XK'],
    });
  });

  it('should validate user assigned alpha 2 code if provided', () => {
    test({
      validator: 'isISO31661Alpha2',
      args: [{ userAssignedCodes: ['XK', 'XL', '', 'x'] }],
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
});
