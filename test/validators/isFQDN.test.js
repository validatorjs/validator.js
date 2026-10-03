import test from '../testFunctions';

describe('isFQDN', () => {
  it('should validate domain names.', () => {
    test({
      validator: 'isFQDN',
      args: [],
      valid: [
        'google.com',
      ],
      invalid: [
        'google.l33t',
      ],
    });
    test({
      validator: 'isFQDN',
      args: [{ allow_numeric_tld: true }],
      valid: [
        'google.com',
        'google.l33t',
      ],
      invalid: [
      ],
    });
  });

  it('should enforce the 253-character domain length limit', () => {
    const label = 'a'.repeat(63);
    const atLimit = [label, label, label, 'a'.repeat(57), 'com'].join('.');
    const tooLong = [label, label, label, label, 'comm'].join('.');
    test({
      validator: 'isFQDN',
      valid: [
        atLimit,
      ],
      invalid: [
        tooLong,
      ],
    });
    test({
      validator: 'isFQDN',
      args: [{ ignore_max_length: true }],
      valid: [
        tooLong,
      ],
    });
  });
});
