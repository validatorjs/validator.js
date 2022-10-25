import { test } from '../testFunctions';

describe('isBefore', () => {
  it('should validate dates against an end date', () => {
    test({
      validator: 'isBefore',
      args: [{ comparisonDate: '08/04/2011' }],
      valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
      invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
    });
    test({
      validator: 'isBefore',
      args: [{ comparisonDate: new Date(2011, 7, 4).toString() }],
      valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
      invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
    });
    test({
      validator: 'isBefore',
      valid: [
        '2000-08-04',
        new Date(0).toString(),
        new Date(Date.now() - 86400000).toString(),
      ],
      invalid: ['2100-07-02', new Date(2217, 10, 10).toString()],
    });
    test({
      validator: 'isBefore',
      args: [{ comparisonDate: '2011-08-03' }],
      valid: ['1999-12-31'],
      invalid: ['invalid date'],
    });
    test({
      validator: 'isBefore',
      args: [{ comparisonDate: 'invalid date' }],
      invalid: ['invalid date', '1999-12-31'],
    });
  });
});
