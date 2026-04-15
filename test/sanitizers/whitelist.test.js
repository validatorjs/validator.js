import test from '../testFunctions';

describe('whitelist', () => {
  it('should sanitize a string based on a whitelist', () => {
    test({
      sanitizer: 'whitelist',
      args: ['abc'],
      expect: {
        abcdef: 'abc',
        aaaaaaaaaabbbbbbbbbb: 'aaaaaaaaaabbbbbbbbbb',
        a1b2c3: 'abc',
        '   ': '',
      },
    });
  });
});
