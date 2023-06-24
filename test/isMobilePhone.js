import assert from 'assert';
import validator from '../validator';

describe('test isMobilePhone', () => {
  describe('test getMobileLocalPattern', () => {
    it('should test the Thailand number', () => {
      assert.equal(validator.isMobilePhone('+6624915095', 'th-TH'), false);
      assert.equal(validator.isMobilePhone('+66892001987', 'th-TH'), true);
    });
  });
});
