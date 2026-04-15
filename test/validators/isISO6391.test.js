import test from '../testFunctions';

describe('isISO6391', () => {
  it('should validate ISO 639-1 language codes', () => {
    test({
      validator: 'isISO6391',
      valid: ['ay', 'az', 'ba', 'be', 'bg'],
      invalid: ['aj', 'al', 'pe', 'pf', 'abc', '123', ''],
    });
  });
});
