import test from '../testFunctions';

describe('isWhitelisted', () => {
  it('should validate whitelisted characters', () => {
    test({
      validator: 'isWhitelisted',
      args: ['abcdefghijklmnopqrstuvwxyz-'],
      valid: ['foo', 'foobar', 'baz-foo'],
      invalid: ['foo bar', 'fo.bar', 'türkçe'],
    });
  });
});
