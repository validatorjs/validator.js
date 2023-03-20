import test from '../testFunctions';

describe('isUrlResolvable', () => {
  it('should validate resolvable URLs', () => {
    test({
      validator: 'isUrlResolvable',
      valid: [
        'https://www.google.com/',
        'https://www.facebook.com/',
        'https://www.youtube.com/',
        'https://www.reddit.com/',
        'https://www.instagram.com/',
        'https://www.wikipedia.org/',
        'https://www.linkedin.com/',
      ],
      invalid: [
        'http://localhost/test.html',
        'example.com',
        'http://localhost',
        'ftp://localhost/test.html',
        'https://madeupdomain3456.com',
        'https://foo.bar.baz',
        'https://..com/',
      ],
    });
  });

  it('should let users specify whether URLs require a protocol', () => {
    test({
      validator: 'isUrlResolvable',
      args: [{
        require_protocol: true,
      }],
      valid: [
        'http://www.example.com/',
        'https://www.example.com/',
      ],
      invalid: [
        'www.example.com',
        'example.com',
      ],
    });
  });

  it('should let users specify whether subdomains are allowed', () => {
    test({
      validator: 'isUrlResolvable',
      args: [{
        allow_subdomains: true,
      }],
      valid: [
        'http://www.example.com/',
        'http://subdomain.example.com/',
      ],
      invalid: [
        'http://example.com/',
      ],
    });
  });
});
