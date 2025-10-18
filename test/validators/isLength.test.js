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
});
