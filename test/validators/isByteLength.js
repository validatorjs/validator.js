import { test } from './testUtils';

describe('isByteLength', () => {
  it('should validate strings by byte length (deprecated api)', () => {
    test({
      validator: 'isByteLength',
      args: [2],
      valid: ['abc', 'de', 'abcd', 'ｇｍａｉｌ'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isByteLength',
      args: [2, 3],
      valid: ['abc', 'de', 'ｇ'],
      invalid: ['', 'a', 'abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [0, 0],
      valid: [''],
      invalid: ['ｇ', 'a'],
    });
  });

  it('should validate strings by byte length', () => {
    test({
      validator: 'isByteLength',
      args: [{ min: 2 }],
      valid: ['abc', 'de', 'abcd', 'ｇｍａｉｌ'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isByteLength',
      args: [{ min: 2, max: 3 }],
      valid: ['abc', 'de', 'ｇ'],
      invalid: ['', 'a', 'abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [{ max: 3 }],
      valid: ['abc', 'de', 'ｇ', 'a', ''],
      invalid: ['abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [{ max: 0 }],
      valid: [''],
      invalid: ['ｇ', 'a'],
    });
  });
});
