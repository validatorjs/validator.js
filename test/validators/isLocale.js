import { test } from './testUtils';

describe('isLocale', () => {
  it('should validate isLocale codes', () => {
    test({
      validator: 'isLocale',
      valid: [
        'uz_Latn_UZ',
        'en',
        'gsw',
        'es_ES',
        'sw_KE',
        'am_ET',
        'ca_ES_VALENCIA',
        'en_US_POSIX',
      ],
      invalid: [
        'lo_POP',
        '12',
        '12_DD',
      ],
    });
  });
});
