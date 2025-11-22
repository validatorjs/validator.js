import test from '../testFunctions';

describe('isIBAN', () => {
  it('should validate IBANs', () => {
    test({
      validator: 'isIBAN',
      valid: [
        'IR576406610070915600106898',
      ],
      invalid: [
        // Invalid format/checksum
        'IR545049154806779008008299',

        // Invalid structure
        'IR5750491548067790080082',

        // Country code not in whitelist when specified
        // Empty/null values
        '',
        '   ',

        // Random invalid strings
        'not an iban',
        '1234567890',
        'ABCD1234567890',
      ],
    });
  });
});
