import { format } from 'util';
import test from '../testFunctions';
import validator from '../../src';

describe('isBase64', () => {
  it('should validate base64 strings with default options', () => {
    test({
      validator: 'isBase64',
      valid: [
        '',
        'Zg==',
        'Zm8=',
        'Zm9v',
        'Zm9vYg==',
        'Zm9vYmE=',
        'Zm9vYmFy',
        'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4=',
        'Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg==',
        'U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw==',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNw' +
        'UAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0Ye' +
        'rhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619' +
        'FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5Tkukhx' +
        'QmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZ' +
        'Fwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZ' +
        'HQIDAQAB',
      ],
      invalid: [
        '12345',
        'Vml2YW11cyBmZXJtZtesting123',
        'Zg=',
        'Z===',
        'Zm=8',
        '=m9vYg==',
        'Zm9vYmFy====',
      ],
    });

    test({
      validator: 'isBase64',
      args: [{ urlSafe: true }],
      valid: [
        '',
        'bGFkaWVzIGFuZCBnZW50bGVtZW4sIHdlIGFyZSBmbG9hdGluZyBpbiBzcGFjZQ',
        '1234',
        'bXVtLW5ldmVyLXByb3Vk',
        'PDw_Pz8-Pg',
        'VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw',
      ],
      invalid: [
        ' AA',
        '\tAA',
        '\rAA',
        '\nAA',
        'This+isa/bad+base64Url==',
        '0K3RgtC+INC30LDQutC+0LTQuNGA0L7QstCw0L3QvdCw0Y8g0YHRgtGA0L7QutCw',
      ],
      error: [
        null,
        undefined,
        {},
        [],
        42,
      ],
    });

    for (let i = 0, str = '', encoded; i < 1000; i++) {
      str += String.fromCharCode(Math.random() * 26 | 97); // eslint-disable-line no-bitwise
      encoded = Buffer.from(str).toString('base64');
      if (!validator.isBase64(encoded)) {
        let msg = format('validator.isBase64() failed with "%s"', encoded);
        throw new Error(msg);
      }
    }
  });

  it('should validate standard Base64 with padding', () => {
    test({
      validator: 'isBase64',
      args: [{ urlSafe: false, padding: true }],
      valid: [
        '',
        'TWFu',
        'TWE=',
        'TQ==',
        'SGVsbG8=',
        'U29mdHdhcmU=',
        'YW55IGNhcm5hbCBwbGVhc3VyZS4=',
      ],
      invalid: [
        'TWF',
        'TWE===',
        'SGVsbG8@',
        'SGVsbG8===',
        'SGVsb G8=',
        '====',
      ],
    });
  });

  it('should validate standard Base64 without padding', () => {
    test({
      validator: 'isBase64',
      args: [{ urlSafe: false, padding: false }],
      valid: [
        '',
        'TWFu',
        'TWE',
        'TQ',
        'SGVsbG8',
        'U29mdHdhcmU',
        'YW55IGNhcm5hbCBwbGVhc3VyZS4',
      ],
      invalid: [
        'TWE=',
        'TQ===',
        'SGVsbG8@',
        'SGVsbG8===',
        'SGVsb G8',
        '====',
      ],
    });
  });

  it('should validate Base64url with padding', () => {
    test({
      validator: 'isBase64',
      args: [{ urlSafe: true, padding: true }],
      valid: [
        '',
        'SGVsbG8=',
        'U29mdHdhcmU=',
        'YW55IGNhcm5hbCBwbGVhc3VyZS4=',
        'SGVsbG8-',
        'SGVsbG8_',
      ],
      invalid: [
        'SGVsbG8===',
        'SGVsbG8@',
        'SGVsb G8=',
        '====',
      ],
    });
  });

  it('should validate Base64url without padding', () => {
    test({
      validator: 'isBase64',
      args: [{ urlSafe: true, padding: false }],
      valid: [
        '',
        'SGVsbG8',
        'U29mdHdhcmU',
        'YW55IGNhcm5hbCBwbGVhc3VyZS4',
        'SGVsbG8-',
        'SGVsbG8_',
      ],
      invalid: [
        'SGVsbG8=',
        'SGVsbG8===',
        'SGVsbG8@',
        'SGVsb G8',
        '====',
      ],
    });
  });

  it('should handle mixed cases correctly', () => {
    test({
      validator: 'isBase64',
      args: [{ urlSafe: false, padding: true }],
      valid: [
        '',
        'TWFu',
        'TWE=',
        'TQ==',
      ],
      invalid: [
        'TWE',
        'TQ=',
        'TQ===',
      ],
    });

    test({
      validator: 'isBase64',
      args: [{ urlSafe: true, padding: false }],
      valid: [
        '',
        'SGVsbG8',
        'SGVsbG8-',
        'SGVsbG8_',
      ],
      invalid: [
        'SGVsbG8=',
        'SGVsbG8@',
        'SGVsb G8',
      ],
    });
  });
});
