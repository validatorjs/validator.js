import test from '../testFunctions';

describe('isFQDN', () => {
  it('should validate FQDN', () => {
    test({
      validator: 'isFQDN',
      valid: [
        'domain.com',
        'dom.plato',
        'a.domain.co',
        'foo--bar.com',
        'xn--froschgrn-x9a.com',
        'rebecca.blackfriday',
        '1337.com',
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '_.com',
        '*.some.com',
        's!ome.com',
        'domain.com/',
        '/more.com',
        'domain.com�',
        'domain.co\u00A0m',
        'domain.co\u1680m',
        'domain.co\u2006m',
        'domain.co\u2028m',
        'domain.co\u2029m',
        'domain.co\u202Fm',
        'domain.co\u205Fm',
        'domain.co\u3000m',
        'domain.com\uDC00',
        'domain.co\uEFFFm',
        'domain.co\uFDDAm',
        'domain.co\uFFF4m',
        'domain.com©',
        'example.0',
        '192.168.0.9999',
        '192.168.0',
      ],
    });
  });

  it('should validate FQDN with trailing dot option', () => {
    test({
      validator: 'isFQDN',
      args: [{ allow_trailing_dot: true }],
      valid: ['example.com.'],
    });
  });

  it('should invalidate FQDN when not require_tld', () => {
    test({
      validator: 'isFQDN',
      args: [{ require_tld: false }],
      invalid: ['example.0', '192.168.0', '192.168.0.9999'],
    });
  });

  it('should validate FQDN when not require_tld but allow_numeric_tld', () => {
    test({
      validator: 'isFQDN',
      args: [{ allow_numeric_tld: true, require_tld: false }],
      valid: ['example.0', '192.168.0', '192.168.0.9999'],
    });
  });

  it('should validate FQDN with wildcard option', () => {
    test({
      validator: 'isFQDN',
      args: [{ allow_wildcard: true }],
      valid: ['*.example.com', '*.shop.example.com'],
    });
  });

  it('should validate FQDN with required allow_trailing_dot, allow_underscores and allow_numeric_tld options', () => {
    test({
      validator: 'isFQDN',
      args: [
        {
          allow_trailing_dot: true,
          allow_underscores: true,
          allow_numeric_tld: true,
        },
      ],
      valid: ['abc.efg.g1h.', 'as1s.sad3s.ssa2d.'],
    });
  });

  it('should validate domain names.', () => {
    test({
      validator: 'isFQDN',
      args: [],
      valid: ['google.com'],
      invalid: ['google.l33t'],
    });

    test({
      validator: 'isFQDN',
      args: [{ allow_numeric_tld: true }],
      valid: ['google.com', 'google.l33t'],
      invalid: [],
    });
  });
});
