import test from '../testFunctions';

describe('isEmpty', () => {
  it('should validate null strings', () => {
    test({
      validator: 'isEmpty',
      valid: [
        '',
      ],
      invalid: [
        ' ',
        'foo',
        '3',
      ],
    });
    test({
      validator: 'isEmpty',
      args: [{ ignore_whitespace: false }],
      valid: [
        '',
      ],
      invalid: [
        ' ',
        'foo',
        '3',
      ],
    });
    test({
      validator: 'isEmpty',
      args: [{ ignore_whitespace: true }],
      valid: [
        '',
        ' ',
      ],
      invalid: [
        'foo',
        '3',
      ],
    });
  });

  it('should error on non-string input', () => {
    test({
      validator: 'isEmpty',
      error: [undefined, null, [], NaN],
    });
  });
});
