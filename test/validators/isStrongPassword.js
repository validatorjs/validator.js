import { test } from './testUtils';

describe('isStrongPassword', () => {
  it('should validate strong passwords', () => {
    test({
      validator: 'isStrongPassword',
      args: [{
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }],
      valid: [
        '%2%k{7BsL"M%Kd6e',
        'EXAMPLE of very long_password123!',
        'mxH_+2vs&54_+H3P',
        '+&DxJ=X7-4L8jRCD',
        'etV*p%Nr6w&H%FeF',
      ],
      invalid: [
        '',
        'password',
        'hunter2',
        'hello world',
        'passw0rd',
        'password!',
        'PASSWORD!',
      ],
    });
  });
});
