import { test } from './testUtils';

describe('contains', () => {
  it('should validate strings contain another string', () => {
    test({
      validator: 'contains',
      args: ['foo'],
      valid: ['foo', 'foobar', 'bazfoo'],
      invalid: ['bar', 'fobar'],
    });

    test({
      validator: 'contains',
      args: ['foo', {
        ignoreCase: true,
      }],
      valid: ['Foo', 'FOObar', 'BAZfoo'],
      invalid: ['bar', 'fobar', 'baxoof'],
    });

    test({
      validator: 'contains',
      args: ['foo', {
        minOccurrences: 2,
      }],
      valid: ['foofoofoo', '12foo124foo', 'fofooofoooofoooo', 'foo1foo'],
      invalid: ['foo', 'foobar', 'Fooofoo', 'foofo'],
    });
  });
});
