import { test } from './testUtils';

describe('isInt', () => {
  it('should validate integers', () => {
    test({
      validator: 'isInt',
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
        '01',
        '-01',
        '000',
      ],
      invalid: [
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{ allow_leading_zeroes: false }],
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
      ],
      invalid: [
        '01',
        '-01',
        '000',
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{ allow_leading_zeroes: true }],
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
        '01',
        '-01',
        '000',
        '-000',
        '+000',
      ],
      invalid: [
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        min: 10,
      }],
      valid: [
        '15',
        '80',
        '99',
      ],
      invalid: [
        '9',
        '6',
        '3.2',
        'a',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        min: 10,
        max: 15,
      }],
      valid: [
        '15',
        '11',
        '13',
      ],
      invalid: [
        '9',
        '2',
        '17',
        '3.2',
        '33',
        'a',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        gt: 10,
        lt: 15,
      }],
      valid: [
        '14',
        '11',
        '13',
      ],
      invalid: [
        '10',
        '15',
        '17',
        '3.2',
        '33',
        'a',
      ],
    });
  });
});
