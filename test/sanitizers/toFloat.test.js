import test from '../testFunctions';

describe('toFloat', () => {
  it('should convert strings to floats', () => {
    test({
      sanitizer: 'toFloat',
      expect: {
        2: 2.0,
        '2.': 2.0,
        '-2.5': -2.5,
        '.5': 0.5,
        '2020-01-06T14:31:00.135Z': NaN,
        foo: NaN,
      },
    });
  });
});
