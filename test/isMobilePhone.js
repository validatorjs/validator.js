import assert from 'assert';
import validator from '../validator';

describe('test isMobilePhone', () => {
  describe('test getMobileLocalPattern', () => {
    it('should test the Thailand number', () => {
      assert.equal(validator.getMobileLocalPattern('th-TH').test('+6624915095'), false);
      assert.equal(validator.getMobileLocalPattern('th-TH').test('+66892001987'), true);
    });
  });
});
