import test from '../testFunctions';

describe('trim', () => {
  it('should trim whitespace', () => {
    test({
      sanitizer: 'trim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': 'foo',
        '      \r': '',
      },
    });
  });

  it('should trim custom characters', () => {
    test({
      sanitizer: 'trim',
      args: ['01'],
      expect: { '010100201000': '2' },
    });
  });
});
