import test from '../testFunctions';

describe('isAfter', () => {
  it('should validate dates against a start date', () => {
    test({
      validator: 'isAfter',
      args: [{ comparisonDate: '2011-08-03' }],
      valid: ['2011-08-04', new Date(2011, 8, 10).toString()],
      invalid: ['2010-07-02', '2011-08-03', new Date(0).toString(), 'foo'],
    });

    test({
      validator: 'isAfter',
      valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
      invalid: ['2010-07-02', new Date(0).toString()],
    });

    test({
      validator: 'isAfter',
      args: [{ comparisonDate: '2011-08-03' }],
      valid: ['2015-09-17'],
      invalid: ['invalid date'],
    });

    test({
      validator: 'isAfter',
      args: [{ comparisonDate: 'invalid date' }],
      invalid: ['invalid date', '2015-09-17'],
    });
  });

  describe('isBetween', () => {
    it('should validate dates against a start date and end date', () => {
      test({
        validator: 'isBetween',
        args: [{ startDate: '2011-08-03', endDate: '2012-08-03' }],
        valid: ['2011-08-04', new Date(2011, 8, 10).toString(), '2012-08-02'],
        invalid: ['2010-07-02', '2013-08-03', new Date(0).toString(), 'foo'],
      });
    });

    it('should validate dates against boundary', () => {
      test({
        validator: 'isBetween',
        args: [{ startDate: '2011-08-03', endDate: '2012-08-03' }],
        valid: ['2011-08-05', new Date(2011, 8, 10).toString()],
        invalid: ['2011-08-03', '2012-08-03', new Date(0).toString(), 'foo'],
      });
    });
  });

  describe('(legacy syntax)', () => {
    it('should validate dates against a start date', () => {
      test({
        validator: 'isAfter',
        args: ['2011-08-03'],
        valid: ['2011-08-04', new Date(2011, 8, 10).toString()],
        invalid: ['2010-07-02', '2011-08-03', new Date(0).toString(), 'foo'],
      });

      test({
        validator: 'isAfter',
        valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
        invalid: ['2010-07-02', new Date(0).toString()],
      });

      test({
        validator: 'isAfter',
        args: ['2011-08-03'],
        valid: ['2015-09-17'],
        invalid: ['invalid date'],
      });

      test({
        validator: 'isAfter',
        args: ['invalid date'],
        invalid: ['invalid date', '2015-09-17'],
      });
    });
  });
});
