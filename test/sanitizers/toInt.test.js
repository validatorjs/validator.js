import test from '../testFunctions';

describe('toInt', () => {
  it('should convert strings to integers', () => {
    test({
      sanitizer: 'toInt',
      expect: {
        3: 3,
        ' 3 ': 3,
        2.4: 2,
        foo: NaN,
      },
    });

    test({
      sanitizer: 'toInt',
      args: [16],
      expect: { ff: 255 },
    });
  });
});
