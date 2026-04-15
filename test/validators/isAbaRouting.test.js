import test from '../testFunctions';

describe('isAbaRouting', () => {
  it('should validate ABA routing number', () => {
    test({
      validator: 'isAbaRouting',
      valid: [
        '322070381',
        '011103093',
        '263170175',
        '124303065',
      ],
      invalid: [
        '426317017',
        '789456124',
        '603558459',
        'qwerty',
        '12430306',
        '382070381',
      ],
    });
  });
});
