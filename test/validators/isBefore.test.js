import { describe } from 'mocha';
import test from '../testFunctions';

describe('isBefore', () => {
  describe('should validate dates a given end date', () => {
    describe('new syntax', () => {
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

    describe('legacy syntax', () => {
      test({
        validator: 'isBefore',
        args: ['08/04/2011'],
        valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
        invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
      });
      test({
        validator: 'isBefore',
        args: [new Date(2011, 7, 4).toString()],
        valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
        invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
      });
      test({
        validator: 'isBefore',
        args: ['2011-08-03'],
        valid: ['1999-12-31'],
        invalid: ['invalid date'],
      });
      test({
        validator: 'isBefore',
        args: ['invalid date'],
        invalid: ['invalid date', '1999-12-31'],
      });
    });
  });

  describe('should validate dates a default end date', () => {
    describe('new syntax', () => {
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
        args: undefined, // will fall back to the current date
        valid: ['1999-06-07'],
      });
      test({
        validator: 'isBefore',
        args: [], // will fall back to the current date
        valid: ['1999-06-07'],
      });
      test({
        validator: 'isBefore',
        args: [undefined], // will fall back to the current date
        valid: ['1999-06-07'],
      });
      test({
        validator: 'isBefore',
        args: [{ comparisonDate: undefined }], // will fall back to the current date
        valid: ['1999-06-07'],
      });
    });

    describe('legacy syntax', () => {
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
        args: undefined, // will fall back to the current date
        valid: ['1999-06-07'],
      });
      test({
        validator: 'isBefore',
        args: [], // will fall back to the current date
        valid: ['1999-06-07'],
      });
      test({
        validator: 'isBefore',
        args: [undefined], // will fall back to the current date
        valid: ['1999-06-07'],
      });
    });
  });
});
