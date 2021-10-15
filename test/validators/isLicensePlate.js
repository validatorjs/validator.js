import { test } from './testUtils';

describe('isLicensePlate', () => {
  it('should be valid license plate', () => {
    test({
      validator: 'isLicensePlate',
      args: ['pt-PT'],
      valid: [
        'AA-12-34',
        '12·34·AB',
        '12·AB·34',
        'AB 12 CD',
        'AB12CD',
      ],
      invalid: [
        '',
        'notalicenseplate',
        'A1-B2-C3',
        'ABC-1-EF',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['de-LI'],
      valid: [
        'FL 1',
        'FL 99999',
        'FL 1337',
      ],
      invalid: [
        '',
        'FL 999999',
        'AB 12345',
        'FL -1',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['de-DE'],
      valid: [
        'M A 1',
        'M A 12',
        'M A 123',
        'M A 1234',
        'M AB 1',
        'M AB 12',
        'M AB 123',
        'M AB 1234',
        'FS A 1',
        'FS A 12',
        'FS A 123',
        'FS A 1234',
        'FS AB 1',
        'FS AB 12',
        'FS AB 123',
        'FS AB 1234',
        'FSAB1234',
        'FS-AB-1234',
        'FS AB 1234 H',
        'FS AB 1234 E',
        'FSAB1234E',
        'FS-AB-1234-E',
      ],
      invalid: [
        'YY AB 123',
        'PAF AB 1234',
        'M ABC 123',
        'M AB 12345',
        'FS AB 1234 A',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['sq-AL'],
      valid: [
        'AA 000 AA',
        'ZZ 999 ZZ',
      ],
      invalid: [
        '',
        'AA 0 A',
        'AAA 00 AAA',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['cs-CZ'],
      valid: [
        'ALA4011',
        '4A23000',
        'DICTAT0R',
        'VETERAN',
        'AZKVIZ8',
        '2A45876',
        'DIC-TAT0R',
      ],
      invalid: [
        '',
        'invalidlicenseplate',
        'LN5758898',
        'X-|$|-X',
        'AE0F-OP4',
        'GO0MER',
        '2AAAAAAAA',
        'FS AB 1234 E',
        'GB999 9999 00',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['fi-FI'],
      valid: [
        'ABC-123',
        'ABC 123',
        'ABC123',
        'A100',
        'A 100',
        'A-100',
        'C10001',
        'C 10001',
        'C-10001',
        '123-ABC',
        '123 ABC',
        '123ABC',
        '123-A',
        '123 A',
        '123A',
        '199AA',
        '199 AA',
        '199-AA',
      ],
      invalid: [
        ' ',
        'A-1',
        'A1A-100',
        '1-A-2',
        'C1234567',
        'A B C 1 2 3',
        'abc-123',
      ],
    });

    test({
      validator: 'isLicensePlate',
      args: ['pt-BR'],
      valid: [
        'ABC1234',
        'ABC 1234',
        'ABC-1234',
        'ABC1D23',
        'ABC1K23',
        'ABC1Z23',
        'ABC 1D23',
        'ABC-1D23',
      ],
      invalid: [
        '',
        'AA 0 A',
        'AAA 00 AAA',
        'ABCD123',
        'AB12345',
        'AB123DC',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['any'],
      valid: [
        'FL 1',
        'FS AB 123',
      ],
      invalid: [
        '',
        'FL 999999',
        'FS AB 1234 A',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['asdfasdf'],
      error: [
        'FL 1',
        'FS AB 123',
        'FL 999999',
        'FS AB 1234 A',
      ],
    });
  });
});
