import test from '../testFunctions';

describe('isURL', () => {
  it('should validate URLs', () => {
    test({
      validator: 'isURL',
      valid: [
        'foobar.com',
        'www.foobar.com',
        'foobar.com/',
        'valid.au',
        'http://www.foobar.com/',
        'HTTP://WWW.FOOBAR.COM/',
        'https://www.foobar.com/',
        'HTTPS://WWW.FOOBAR.COM/',
        'http://www.foobar.com:23/',
        'http://www.foobar.com:65535/',
        'http://www.foobar.com:5/',
        'https://www.foobar.com/',
        'ftp://www.foobar.com/',
        'http://www.foobar.com/~foobar',
        'http://user:pass@www.foobar.com/',
        'http://user:@www.foobar.com/',
        'http://:pass@www.foobar.com/',
        'http://user@www.foobar.com',
        'http://127.0.0.1/',
        'http://10.0.0.0/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
        'http://foobar.com/t$-_.+!*\'(),',
        'http://foobar.com/?foo=bar#baz=qux',
        'http://foobar.com?foo=bar',
        'http://foobar.com#baz=qux',
        'http://www.xn--froschgrn-x9a.net/',
        'http://xn--froschgrn-x9a.com/',
        'http://foo--bar.com',
        'http://høyfjellet.no',
        'http://xn--j1aac5a4g.xn--j1amh',
        'http://xn------eddceddeftq7bvv7c4ke4c.xn--p1ai',
        'http://кулік.укр',
        'test.com?ref=http://test2.com',
        'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html',
        'http://[1080:0:0:0:8:800:200C:417A]/index.html',
        'http://[3ffe:2a00:100:7031::1]',
        'http://[1080::8:800:200C:417A]/foo',
        'http://[::192.9.5.5]/ipng',
        'http://[::FFFF:129.144.52.38]:80/index.html',
        'http://[2010:836B:4179::836B:4179]',
        'http://example.com/example.json#/foo/bar',
        'http://1337.com',
        // TODO: those probably should not be marked as valid URLs; CVE-2025-56200
        /* eslint-disable no-script-url */
        'http://evil-site.com@example.com/',
        'ｊａｖａｓｃｒｉｐｔ:alert(1)@example.com',
        /* eslint-enable no-script-url */
      ],
      invalid: [
        'http://localhost:3000/',
        '//foobar.com',
        'xyz://foobar.com',
        'invalid/',
        'invalid.x',
        'invalid.',
        '.com',
        'http://com/',
        'http://300.0.0.1/',
        'mailto:foo@bar.com',
        'rtmp://foobar.com',
        'http://www.xn--.com/',
        'http://xn--.com/',
        'http://www.foobar.com:0/',
        'http://www.foobar.com:70000/',
        'http://www.foobar.com:99999/',
        'http://www.-foobar.com/',
        'http://www.foobar-.com/',
        'http://foobar/# lol',
        'http://foobar/? lol',
        'http://foobar/ lol/',
        'http://lol @foobar.com/',
        'http://lol:lol @foobar.com/',
        'http://lol:lol:lol@foobar.com/',
        'http://lol: @foobar.com/',
        'http://www.foo_bar.com/',
        'http://www.foobar.com/\t',
        'http://@foobar.com',
        'http://:@foobar.com',
        'http://\n@www.foobar.com/',
        '',
        `http://foobar.com/${new Array(2083).join('f')}`,
        'http://*.foo.com',
        '*.foo.com',
        '!.foo.com',
        'http://example.com.',
        'http://localhost:61500this is an invalid url!!!!',
        '////foobar.com',
        'http:////foobar.com',
        'https://example.com/foo/<script>alert(\'XSS\')</script>/',
        // the following tests are because of CVE-2025-56200
        /* eslint-disable no-script-url */
        "javascript:alert(1);a=';@example.com/alert(1)'",
        'JaVaScRiPt:alert(1)@example.com',
        'javascript:/* comment */alert(1)@example.com',
        'javascript:var a=1; alert(a);@example.com',
        'javascript:alert(1)@user@example.com',
        'javascript:alert(1)@example.com?q=safe',
        'javascript:%61%6c%65%72%74%28%31%29@example.com',
        'javascript:%22@a.com#";alert(origin)//',
        'data:text/html,<script>alert(1)</script>@example.com',
        'vbscript:msgbox("XSS")@example.com',
        '//evil-site.com/path@example.com',
        /* eslint-enable no-script-url */
      ],
    });
  });

  it('should validate URLs without protocol', () => {
    test({
      validator: 'isURL',
      args: [{
        require_tld: false,
        require_valid_protocol: false,
      }],
      valid: [
        'localhost',
        'localhost:3000',
        'service-name:8080',
        'https://localhost',
        'http://localhost:3000',
        'http://service-name:8080',
        'user:password@localhost',
        'user:pass@service-name:8080',
      ],
      invalid: [],
    });

    // Test with require_protocol: true - should reject hostnames with ports but no protocol
    test({
      validator: 'isURL',
      args: [{
        require_tld: false,
        require_protocol: true,
        require_valid_protocol: false,
      }],
      valid: [
        'http://localhost:3000',
        'https://service-name:8080',
        'custom://localhost',
      ],
      invalid: [
        'localhost:3000',
        'service-name:8080',
        'user:password@localhost',
      ],
    });

    // Test non-numeric patterns after colon (should be treated as protocols)
    test({
      validator: 'isURL',
      args: [{
        require_tld: false,
        require_valid_protocol: false,
        protocols: ['custom', 'myscheme'],
      }],
      valid: [
        'custom:something',
        'myscheme:data',
      ],
      invalid: [],
    });
  });

  it('should validate URLs with custom protocols', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['rtmp'],
      }],
      valid: [
        'rtmp://foobar.com',
        'rtmp:foobar.com',
      ],
      invalid: [
        'http://foobar.com',
        'tel:+15551234567',
      ],
    });
  });

  it('should validate file URLs without a host', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['file'],
        require_host: false,
        require_tld: false,
      }],
      valid: [
        'file://localhost/foo.txt',
        'file:///foo.txt',
        'file:///',
      ],
      invalid: [
        'http://foobar.com',
        'file://',
      ],
    });
  });

  it('should validate postgres URLs without a host', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['postgres'],
        require_host: false,
      }],
      valid: [
        'postgres://user:pw@/test',
      ],
      invalid: [
        'http://foobar.com',
        'postgres://',
      ],
    });
  });


  it('should validate URLs with any protocol', () => {
    test({
      validator: 'isURL',
      args: [{
        require_valid_protocol: false,
      }],
      valid: [
        'rtmp://foobar.com',
        'http://foobar.com',
        'test://foobar.com',
        // Dangerous! This allows to mark malicious URLs as a valid URL (CVE-2025-56200)
        // eslint-disable-next-line no-script-url
        'javascript:alert(1);@example.com',
      ],
      invalid: [
        'mailto:test@example.com',
      ],
    });
  });

  it('should validate URLs with underscores', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_underscores: true,
      }],
      valid: [
        'http://foo_bar.com',
        'http://pr.example_com.294.example.com/',
        'http://foo__bar.com',
        'http://_.example.com',
      ],
      invalid: [],
    });
  });

  it('should validate URLs that do not have a TLD', () => {
    test({
      validator: 'isURL',
      args: [{
        require_tld: false,
      }],
      valid: [
        'http://foobar.com/',
        'http://foobar/',
        'http://localhost/',
        'foobar/',
        'foobar',
      ],
      invalid: [],
    });
  });

  it('should validate URLs with a trailing dot option', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_trailing_dot: true,
        require_tld: false,
      }],
      valid: [
        'http://example.com.',
        'foobar.',
      ],
    });
  });

  it('should validate URLs with column and no port', () => {
    test({
      validator: 'isURL',
      valid: [
        'http://example.com:',
        'ftp://example.com:',
      ],
      invalid: [
        'https://example.com:abc',
      ],
    });
  });

  it('should validate sftp protocol URL containing column and no port', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['sftp'],
      }],
      valid: [
        'sftp://user:pass@terminal.aws.test.nl:/incoming/things.csv',
      ],
    });
  });

  it('should validate protocol relative URLs', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_protocol_relative_urls: true,
      }],
      valid: [
        '//foobar.com',
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        '://foobar.com',
        '/foobar.com',
        '////foobar.com',
        'http:////foobar.com',
      ],
    });
  });

  it('should not validate URLs with fragments when allow fragments is false', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_fragments: false,
      }],
      valid: [
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        'http://foobar.com#part',
        'foobar.com#part',
      ],
    });
  });

  it('should not validate URLs with query components when allow query components is false', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_query_components: false,
      }],
      valid: [
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        'http://foobar.com?foo=bar',
        'http://foobar.com?foo=bar&bar=foo',
        'foobar.com?foo=bar',
        'foobar.com?foo=bar&bar=foo',
      ],
    });
  });

  it('should not validate protocol relative URLs when require protocol is true', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_protocol_relative_urls: true,
        require_protocol: true,
      }],
      valid: [
        'http://foobar.com',
      ],
      invalid: [
        '//foobar.com',
        '://foobar.com',
        '/foobar.com',
        'foobar.com',
      ],
    });
  });

  it('should let users specify whether URLs require a protocol', () => {
    test({
      validator: 'isURL',
      args: [{
        require_protocol: true,
      }],
      valid: [
        'http://foobar.com/',
      ],
      invalid: [
        'http://localhost/',
        'foobar.com',
        'foobar',
      ],
    });
  });

  it('should validate authentication strings if a protocol is not required', () => {
    test({
      validator: 'isURL',
      args: [{
        require_protocol: false,
      }],
      valid: [
        'user:pw@foobar.com/',
      ],
      invalid: [
        'user:pw,@foobar.com/',
      ],
    });
  });

  it('should reject authentication strings if a protocol is required', () => {
    test({
      validator: 'isURL',
      args: [{
        require_protocol: true,
      }],
      valid: [
        'http://user:pw@foobar.com/',
        'https://user:password@example.com',
        'ftp://admin:pass@ftp.example.com/',
      ],
      invalid: [
        'user:pw@foobar.com/',
        'user:password@example.com',
        'admin:pass@ftp.example.com/',
      ],
    });
  });

  it('should reject invalid protocols when require_valid_protocol is enabled', () => {
    test({
      validator: 'isURL',
      args: [{
        require_valid_protocol: true,
        protocols: ['http', 'https', 'ftp'],
      }],
      valid: [
        'http://example.com',
        'https://example.com',
        'ftp://example.com',
      ],
      invalid: [
        // eslint-disable-next-line no-script-url
        'javascript:alert(1);@example.com',
        'data:text/html,<script>alert(1)</script>@example.com',
        'file:///etc/passwd@example.com',
      ],
    });
  });

  it('should let users specify a host whitelist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_whitelist: ['foo.com', 'bar.com'],
      }],
      valid: [
        'http://bar.com/',
        'http://foo.com/',
      ],
      invalid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
    });
  });

  it('should allow regular expressions in the host whitelist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_whitelist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'http://bar.com/',
        'http://foo.com/',
        'http://images.foo.com/',
        'http://cdn.foo.com/',
        'http://a.b.c.foo.com/',
      ],
      invalid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
    });
  });

  it('should let users specify a host blacklist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_blacklist: ['foo.com', 'bar.com'],
      }],
      valid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
      invalid: [
        'http://bar.com/',
        'http://foo.com/',
      ],
    });
  });

  it('should allow regular expressions in the host blacklist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_blacklist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
      invalid: [
        'http://bar.com/',
        'http://foo.com/',
        'http://images.foo.com/',
        'http://cdn.foo.com/',
        'http://a.b.c.foo.com/',
      ],
    });
  });

  it('GHSA-9965-vmph-33xx vulnerability - protocol delimiter parsing difference', () => {
    const DOMAIN_WHITELIST = ['example.com'];

    test({
      validator: 'isURL',
      args: [{
        protocols: ['https'],
        host_whitelist: DOMAIN_WHITELIST,
        require_host: false,
      }],
      valid: [],
      invalid: [
        // eslint-disable-next-line no-script-url
        "javascript:alert(1);a=';@example.com/alert(1)",
      ],
    });
  });

  it('should allow rejecting urls containing authentication information', () => {
    test({
      validator: 'isURL',
      args: [{ disallow_auth: true }],
      valid: [
        'doe.com',
      ],
      invalid: [
        'john@doe.com',
        'john:john@doe.com',
      ],
    });
  });

  it('should accept urls containing authentication information', () => {
    test({
      validator: 'isURL',
      args: [{ disallow_auth: false }],
      valid: [
        'user@example.com',
        'user:@example.com',
        'user:password@example.com',
      ],
      invalid: [
        'user:user:password@example.com',
        '@example.com',
        ':@example.com',
        ':example.com',
      ],
    });
  });

  it('should allow user to skip URL length validation', () => {
    test({
      validator: 'isURL',
      args: [{ validate_length: false }],
      valid: [
        'http://foobar.com/f',
        `http://foobar.com/${new Array(2083).join('f')}`,
      ],
      invalid: [],
    });
  });

  it('should allow user to configure the maximum URL length', () => {
    test({
      validator: 'isURL',
      args: [{ max_allowed_length: 20 }],
      valid: [
        'http://foobar.com/12', // 20 characters
        'http://foobar.com/',
      ],
      invalid: [
        'http://foobar.com/123', // 21 characters
        'http://foobar.com/1234567890',
      ],
    });
  });

  it('should validate URLs with port present', () => {
    test({
      validator: 'isURL',
      args: [{ require_port: true }],
      valid: [
        'http://user:pass@www.foobar.com:1',
        'http://user:@www.foobar.com:65535',
        'http://127.0.0.1:23',
        'http://10.0.0.0:256',
        'http://189.123.14.13:256',
        'http://duckduckgo.com:65535?q=%2F',
      ],
      invalid: [
        'http://user:pass@www.foobar.com/',
        'http://user:@www.foobar.com/',
        'http://127.0.0.1/',
        'http://10.0.0.0/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
      ],
    });
  });
});
