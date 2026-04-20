import test from '../testFunctions';

describe('isISRC', () => {
  it('should validate ISRC code strings', () => {
    test({
      validator: 'isISRC',
      valid: [
        'USAT29900609',
        'GBAYE6800011',
        'USRC15705223',
        'USCA29500702',
      ],
      invalid: [
        'USAT2990060',
        'SRC15705223',
        'US-CA29500702',
        'USARC15705223',
      ],
    });
  });
});
