import test from '../testFunctions';

describe('toBoolean', () => {
  it('should sanitize boolean strings', () => {
    test({
      sanitizer: 'toBoolean',
      expect: {
        0: false,
        '': false,
        1: true,
        true: true,
        True: true,
        TRUE: true,
        foobar: true,
        '   ': true,
        false: false,
        False: false,
        FALSE: false,
      },
    });
    test({
      sanitizer: 'toBoolean',
      args: [true], // strict
      expect: {
        0: false,
        '': false,
        1: true,
        true: true,
        True: true,
        TRUE: true,
        foobar: false,
        '   ': false,
        false: false,
        False: false,
        FALSE: false,
      },
    });
  });
});
