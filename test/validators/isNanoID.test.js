import test from '../testFunctions';

describe('isNanoID', () => {
  it('default options', () => {
    test({
      validator: 'isNanoID',
      valid: ['Aiugiu645654sdf', 'D87D', '_-jj', 'A_B-C'],
      invalid: ['+999', 'RGRY$', ' ', '*abc'],
    });
  });

  it('custom alphabets', () => {
    test({
      validator: 'isNanoID',
      args: [{ alphabets: 'ABCDEF123' }],
      valid: ['ACABE', '123123', 'A1_C', 'F-1'],
      invalid: [
        '+999',
        'RGRY$',
        ' ',
        'Aiugiu645654sdf',
        'D87D',
        'aoihdof',
        '_-jj',
        'G12',
      ],
    });
  });

  it('hyphen disabled', () => {
    test({
      validator: 'isNanoID',
      args: [{ hyphen: false }],
      valid: ['ACABE', '123123', '_jj', 'Aiugiu645654sdf', 'D87D'],
      invalid: ['-999', 'A-B', 'RGRY$', ' '],
    });
  });

  it('underscore disabled', () => {
    test({
      validator: 'isNanoID',
      args: [{ underscore: false }],
      valid: ['ACABE', '123123', '-jj', 'Aiugiu645654sdf', 'D87D'],
      invalid: ['_123', 'A_B', 'RGRY$', ' '],
    });
  });

  it('fixed length', () => {
    test({
      validator: 'isNanoID',
      args: [{ length: 6 }],
      valid: ['ABC123', 'a1B_9-'],
      invalid: ['ABC12', 'ABC1234', 'ABC+12'],
    });
  });
});
