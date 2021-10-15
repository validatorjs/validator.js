import { test } from './testUtils';

describe('matches', () => {
  it('should validate strings against a pattern', () => {
    test({
      validator: 'matches',
      args: [/abc/],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc'],
    });
    test({
      validator: 'matches',
      args: ['abc'],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc'],
    });
    test({
      validator: 'matches',
      args: ['abc', 'i'],
      valid: ['abc', 'abcdef', '123abc', 'AbC'],
      invalid: ['acb'],
    });
  });
});
