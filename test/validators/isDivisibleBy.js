import { test } from './testUtils';

describe('isDivisibleBy', () => {
  it('should validate that integer strings are divisible by a number', () => {
    test({
      validator: 'isDivisibleBy',
      args: [2],
      valid: ['2', '4', '100', '1000'],
      invalid: [
        '1',
        '2.5',
        '101',
        'foo',
        '',
        '2020-01-06T14:31:00.135Z',
      ],
    });
  });
});
