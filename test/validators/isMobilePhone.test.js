import test from '../testFunctions';

const fixtures = [
  { locale: 'ar-PS', valid: '0591234567', invalid: ['05|1234567', '+9705|1234567'] },
  { locale: 'es-HN', valid: '91234567', invalid: ['|1234567', '+504|1234567'] },
  { locale: 'es-ES', valid: '612345678', invalid: ['|12345678', '+34|12345678'] },
  { locale: 'es-GT', valid: '71234567', invalid: ['|1234567', '+502|1234567'] },
  { locale: 'id-ID', valid: '0812 34567', invalid: ['0812|34567', '0812?34567', '+62812|34567', '+62812?34567'] },
];

describe('isMobilePhone', () => {
  fixtures.forEach((fixture) => {
    it(`should reject literal regex punctuation in ${fixture.locale} numbers`, () => {
      test({
        validator: 'isMobilePhone',
        args: [fixture.locale],
        valid: [fixture.valid],
        invalid: fixture.invalid,
      });
    });
  });
});
