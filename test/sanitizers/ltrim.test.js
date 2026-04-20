import test from '../testFunctions';

describe('ltrim', () => {
  it('should trim whitespace', () => {
    test({
      sanitizer: 'ltrim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': 'foo  \r\n\t   ',
        '   \t  \n': '',
      },
    });
  });

  it('should trim custom characters', () => {
    test({
      sanitizer: 'ltrim',
      args: ['01'],
      expect: { '010100201000': '201000' },
    });

    test({
      sanitizer: 'ltrim',
      args: ['\\S'],
      expect: { '\\S01010020100001': '01010020100001' },
    });
  });
});
