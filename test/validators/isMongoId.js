import { test } from './testUtils';

describe('isMongoId', () => {
  it('should validate hex-encoded MongoDB ObjectId', () => {
    test({
      validator: 'isMongoId',
      valid: [
        '507f1f77bcf86cd799439011',
      ],
      invalid: [
        '507f1f77bcf86cd7994390',
        '507f1f77bcf86cd79943901z',
        '',
        '507f1f77bcf86cd799439011 ',
      ],
    });
  });
});
