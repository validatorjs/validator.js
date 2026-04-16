import test from '../testFunctions';

describe('isBase32', () => {
  it('should validate base32 strings', () => {
    test({
      validator: 'isBase32',
      valid: [
        'ZG======',
        'JBSQ====',
        'JBSWY===',
        'JBSWY3A=',
        'JBSWY3DP',
        'JBSWY3DPEA======',
        'K5SWYY3PNVSSA5DPEBXG6ZA=',
        'K5SWYY3PNVSSA5DPEBXG6===',
      ],
      invalid: [
        '12345',
        '',
        'JBSWY3DPtesting123',
        'ZG=====',
        'Z======',
        'Zm=8JBSWY3DP',
        '=m9vYg==',
        'Zm9vYm/y====',
      ],
    });
  });

  it('should validate base32 strings with crockford alternative', () => {
    test({
      validator: 'isBase32',
      args: [{ crockford: true }],
      valid: [
        '91JPRV3F41BPYWKCCGGG',
        '60',
        '64',
        'B5QQA833C5Q20S3F41MQ8',
      ],
      invalid: [
        '91JPRV3F41BUPYWKCCGGG',
        'B5QQA833C5Q20S3F41MQ8L',
        '60I',
        'B5QQA833OULIC5Q20S3F41MQ8',
      ],
    });
  });
});
