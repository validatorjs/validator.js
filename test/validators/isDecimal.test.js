import test from '../testFunctions';

describe('isDecimal', () => {
  it('Checks whether a number is Decimal or not', () => {
    test({
      validator: 'isDecimal',
      valid: ['1.2', '+2.4', '-122.5'],
      invalid: ['+-2.4'],
    });
    test({
      validator: 'isDecimal',
      args: [{ locale: 'ar', force_decimal: false, decimal_digits: '1' }],
      valid: ['1٫2', '+2٫4', '-122٫5'],
      invalid: ['+-2٫4', '2.4', '12٫8979', '1,2'],
    });
    test({
      validator: 'isDecimal',
      valid: ['1.2', '+2.4', '-122.5', '.5', '+.5', '-.5', '0.123', '1.234'],
      invalid: ['', ' ', '+', '-', '1,2', '1.', ' 1.2', '1.2 ', '+-2.4'],
    });
    test({
      validator: 'isDecimal',
      args: [{ force_decimal: true }],
      valid: ['1.0', '+.5', '-.5', '0.12', '.1'],
      invalid: ['1', '2', '', '1.', ' 1.0'],
    });
    test({
      validator: 'isDecimal',
      args: [{ force_decimal: true, decimal_digits: '2' }],
      valid: ['1.23', '+.12', '-0.12', '0.00'],
      invalid: ['1.2', '1.234', '1', '.1', '.123'],
    });
    test({
      validator: 'isDecimal',
      args: [{ decimal_digits: '1,3' }],
      valid: ['1.2', '1.23', '1.234', '.1', '.12', '.123'],
      invalid: ['1.', '1.2345', '.1234'],
    });
    test({
      validator: 'isDecimal',
      args: [{ locale: 'ar' }],
      valid: ['1٫2', '٫5', '+٫5', '-٫5'],
      invalid: ['1.2', '1,2', '1٫', ' 1٫2'],
    });
  });
});
