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
    test({
      validator: 'isAfter',
      args: [], // will fall back to the current date
      valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
    });
    test({
      validator: 'isAfter',
      args: [undefined], // will fall back to the current date
      valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
    });
    test({
      validator: 'isAfter',
      args: [{ comparisonDate: undefined }], // will fall back to the current date
      valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
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
describe('(legacy syntax with Date object)', () => {
  it('should accept a Date object as the second argument and use it as the comparison date', () => {
    // Regression: previously `typeof options === 'object' && options.comparisonDate === undefined`
    // meant the Date argument was silently ignored and the comparison fell back to "now".
    test({
      validator: 'isAfter',
      args: [new Date('2010-01-01T00:00:00Z')],
      valid: ['2010-01-02', '2011-08-04', '2030-01-01', new Date(2020, 0, 1).toString()],
      invalid: ['2009-12-31', '2010-01-01', new Date(0).toString()],
    });

    test({
      validator: 'isAfter',
      args: [new Date('2030-01-01T00:00:00Z')],
      valid: ['2030-01-02', '2050-06-15'],
      invalid: ['2025-06-26', '2029-12-31', new Date(2025, 0, 1).toString()],
    });
  });
});
