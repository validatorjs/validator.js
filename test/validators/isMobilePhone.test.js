import test from '../testFunctions';

describe('isMobilePhone', () => {
  describe('is Qatar phone number', () => {
    it('should validate Qatar phone numbers', () => {
      test({
        validator: 'isMobilePhone',
        args: ['ar-QA'],
        valid: [
          '+97435551234',
          '+97455551234',
          '+97465551234',
          '+97475551234',
          '35551234',
          '55551234',
          '65551234',
          '75551234',

        ],
        invalid: [
          '+97445551234',
          '45551234',
          '035551234',
          '+97405551234',
          '25551234',
          '95551234',
          '+9745555123',
          '+974555512345',
          '+9745555abcd',
          '+97355551234',
          '',
          '+974',
        ],
      });
    });

    it('should validate Qatar phone numbers in strict mode', () => {
      test({
        validator: 'isMobilePhone',
        args: ['ar-QA', { strictMode: true }],
        valid: [
          '+97435551234',
          '+97455551234',
          '+97465551234',
          '+97475551234',
          '+974 55551234',
        ],
        invalid: [
          '+97445551234',
          '35551234',
          '55551234',
          '035551234',
          '+97405551234',
          '+9745555123',
          '+974555512345',
          '+97355551234',
        ],
      });
    });

    it('should validate when using multiple locales including Qatar', () => {
      test({
        validator: 'isMobilePhone',
        args: ['ar-QA'],
        valid: [
          '+97435551234',
          '+97455551234',
          '35551234',
          '55551234',
        ],
        invalid: [
          '+97445551234',
          '+9125551234',
          '25551234',
          '+13005551234',
          '+9745555123',
          '',
        ],
      });
    });

    it('should validate when using any locale', () => {
      test({
        validator: 'isMobilePhone',
        args: [],
        valid: [
          '+97455551234',
          '+13055551234',
          '+447123456789',
          '+61412345678',
        ],
        invalid: [
          '12345',
          'abc',
          '',
          '+9745555123',
          '+97445551234',
        ],
      });
    });
  });
});
