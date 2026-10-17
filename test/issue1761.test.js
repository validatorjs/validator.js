import assert from 'assert';
import isMobilePhone, { locales } from '../src/lib/isMobilePhone';

describe('Issue1761 Tokelau mobile phone validation', () => {
  it('accepts all assigned prefixes and national length boundaries', () => {
    ['72', '73', '74'].forEach((prefix) => {
      ['00', '000', '0000', '00000'].forEach((suffix) => {
        ['', '690', '+690'].forEach((country) => {
          const value = country + prefix + suffix;
          assert.strictEqual(isMobilePhone(value, 'en-TK'), true, value);
        });
      });
    });
  });

  it('rejects incorrect lengths, unassigned prefixes and formatting', () => {
    ['+690720', '+69072000000', '720', '72000000', '+6907100', '+6907500',
      '+6903101', '+6917200', '+69072ab', '+690 7200', '07200', '7200\n'].forEach((value) => {
      assert.strictEqual(isMobilePhone(value, 'en-TK'), false, JSON.stringify(value));
    });
  });

  it('supports strictMode, locale arrays, any and the locale list', () => {
    assert.strictEqual(isMobilePhone('+6907200', 'en-TK', { strictMode: true }), true);
    assert.strictEqual(isMobilePhone('6907200', 'en-TK', { strictMode: true }), false);
    assert.strictEqual(isMobilePhone('7200', 'en-TK', { strictMode: true }), false);
    assert.strictEqual(isMobilePhone('+6907400000', ['en-US', 'en-TK']), true);
    assert.strictEqual(isMobilePhone('+6907300', 'any'), true);
    assert.strictEqual(isMobilePhone('+6907300'), true);
    assert.strictEqual(locales.includes('en-TK'), true);
  });
});
