import test from '../testFunctions';

describe('isLength', () => {
  it('should return false for a string with length greater than the max', () => {
    test({
      validator: 'isLength',
      args: [{ max: 3 }],
      invalid: ['test'],
    });
  });

  it('should return true for a string with length equal to the max', () => {
    test({
      validator: 'isLength',
      args: [{ max: 4 }],
      valid: ['test'],
    });
  });

  it('should correctly calculate the length of a string with presentation sequences', () => {
    test({
      validator: 'isLength',
      args: [{ max: 4 }],
      valid: ['test\uFE0F'],
    });

    test({
      validator: 'isLength',
      args: [{ min: 5, max: 5 }],
      valid: ['test\uFE0F\uFE0F'],
    });

    test({
      validator: 'isLength',
      args: [{ min: 5, max: 5 }],
      valid: ['\uFE0Ftest'],
    });

    test({
      validator: 'isLength',
      args: [{ min: 9, max: 9 }],
      valid: ['test\uFE0F\uFE0F\uFE0F\uFE0F\uFE0F\uFE0F'],
    });
  });

  it('should validate strings by length (deprecated api)', () => {
    test({
      validator: 'isLength',
      args: [2],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd'],
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['干𩸽', '𠮷野家'],
      invalid: ['', '𠀋', '千竈通り'],
    });
    test({
      validator: 'isLength',
      args: [0, 0],
      valid: [''],
      invalid: ['a', 'ab'],
    });
  });

  it('should validate strings by length', () => {
    test({
      validator: 'isLength',
      args: [{ min: 2 }],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 3 }],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 3 }],
      valid: ['干𩸽', '𠮷野家'],
      invalid: ['', '𠀋', '千竈通り'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 3 }],
      valid: ['abc', 'de', 'a', ''],
      invalid: ['abcd'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 6, discreteLengths: 5 }],
      valid: ['abcd', 'vfd', 'ff', '', 'k'],
      invalid: ['abcdefgh', 'hfjdksks'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 6, discreteLengths: 5 }],
      valid: ['bsa', 'vfvd', 'ff'],
      invalid: ['', ' ', 'hfskdunvc'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 1, discreteLengths: 2 }],
      valid: [' ', 'hello', 'bsa'],
      invalid: [''],
    });
    test({
      validator: 'isLength',
      args: [{ max: 0 }],
      valid: [''],
      invalid: ['a', 'ab'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 5, max: 10, discreteLengths: [2, 6, 8, 9] }],
      valid: ['helloguy', 'shopping', 'validator', 'length'],
      invalid: ['abcde', 'abcdefg'],
    });
    test({
      validator: 'isLength',
      args: [{ discreteLengths: '9' }],
      valid: ['a', 'abcd', 'abcdefghijkl'],
      invalid: [],
    });
    test({
      validator: 'isLength',
      valid: ['a', '', 'asds'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 8 }],
      valid: ['👩🦰👩👩👦👦🏳️🌈', '⏩︎⏩︎⏪︎⏪︎⏭︎⏭︎⏮︎⏮︎'],
    });
  });

  it('should return true if string exactly match min/max bounds', () => {
    test({
      validator: 'isLength',
      args: [{ min: 3, max: 3 }],
      valid: ['abc', 'def'],
      invalid: ['abcd', 'efgh'],
    });
  });

  it('should count emojis as single character', () => {
    test({
      validator: 'isLength',
      args: [{ min: 1, max: 1 }],
      valid: ['🚀', '🍕', 'A'],
      invalid: ['🚀🚀', ''],
    });
  });

  it('should only allow strings with specific lengths from a list', () => {
    test({
      validator: 'isLength',
      args: [{ discreteLengths: [2, 5] }],
      valid: ['to', 'hello'],
      invalid: ['a', 'cat', 'lengthy'],
    });
  });
});
