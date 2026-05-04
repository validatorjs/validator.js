import isPAN from '../src/lib/isPAN';

describe('isPAN', () => {
  it('valid PAN', () => {
    if (!isPAN('ABCDE1234F')) throw new Error();
  });

  it('invalid length', () => {
    if (isPAN('ABCDE123F')) throw new Error();
  });

  it('lowercase should fail', () => {
    if (isPAN('abcde1234f')) throw new Error();
  });

  it('wrong format', () => {
    if (isPAN('1234ABCDE1')) throw new Error();
  });

  it('empty string', () => {
    if (isPAN('')) throw new Error();
  });
});
