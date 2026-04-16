import test from '../testFunctions';

describe('rtrim', () => {
  it('should trim whitespace', () => {
    test({
      sanitizer: 'rtrim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': '  \r\n\tfoo',
        ' \r\n  \t': '',
      },
    });
  });

  it('should trim custom characters', () => {
    test({
      sanitizer: 'rtrim',
      args: ['01'],
      expect: { '010100201000': '0101002' },
    });

    test({
      sanitizer: 'rtrim',
      args: ['\\S'],
      expect: { '01010020100001\\S': '01010020100001' },
    });
  });
});
