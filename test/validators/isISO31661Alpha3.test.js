import test from '../testFunctions';

describe('isISO31661Alpha3', () => {
  it('should validate official alpha 3 code', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [],
      valid: ['BEL', 'FRA', 'GBR', 'USA'],
      invalid: ['XXK'],
    });
  });

  it('should validate user assigned alpha 3 code if provided', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{ userAssignedCodes: ['XXK', 'XXL'] }],
      valid: ['BEL', 'FRA', 'GBR', 'USA', 'XXK', 'XXL'],
      invalid: ['XXA', 'GGG'],
    });
  });

  it('should not validate user assigned alpha 3 not valid code if provided', () => {
    test({
      validator: 'isISO31661Alpha3',
      args: [{ userAssignedCodes: ['', 'x', 'XX', 'XXXX'] }],
      valid: ['FRA'],
      invalid: ['XX', 'XXXX', 'X'],
    });
  });
});
