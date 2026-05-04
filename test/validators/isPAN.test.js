import validator from '../../src/index';

describe('isPAN', () => {
  it('valid PAN', () => {
    validator.isPAN('ABCDE1234F').should.equal(true);
  });

  it('invalid length', () => {
    validator.isPAN('ABCDE123F').should.equal(false);
  });

  it('lowercase should fail', () => {
    validator.isPAN('abcde1234f').should.equal(false);
  });

  it('wrong format', () => {
    validator.isPAN('1234ABCDE1').should.equal(false);
  });

  it('empty string', () => {
    validator.isPAN('').should.equal(false);
  });
});