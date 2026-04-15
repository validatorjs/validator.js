import test from '../testFunctions';

describe('toString', () => {
  it('should convert inputs to strings', () => {
    test({
      sanitizer: 'toString',
      expect: {
        foo: 'foo',
        '': '',
        123: '123',
        ' bar ': ' bar ',
      },
    });
  });
});
