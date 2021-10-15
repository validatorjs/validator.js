import { test } from './testUtils';

describe('isBase58', () => {
  it('should validate base58 strings', () => {
    test({
      validator: 'isBase58',
      valid: [
        'BukQL',
        '3KMUV89zab',
        '91GHkLMNtyo98',
        'YyjKm3H',
        'Mkhss145TRFg',
        '7678765677',
        'abcodpq',
        'AAVHJKLPY',
      ],
      invalid: [
        '0OPLJH',
        'IMKLP23',
        'KLMOmk986',
        'LL1l1985hG',
        '*MP9K',
        'Zm=8JBSWY3DP',
        ')()(=9292929MKL',
      ],
    });
  });
});
