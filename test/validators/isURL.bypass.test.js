import test from '../testFunctions';

describe('isURL – protocol parsing bypass (regression)', () => {
  it('require_protocol cases', () => {
    test({
      validator: 'isURL',
      args: [{ require_protocol: true }],
      valid: [
        'https://example.com',
        'http://example.com/path?x=1#y',
      ],
      invalid: [
        'https:example.com',
        'http:example.com',
        'data:text/html,<b>x</b>',
        ['java', 'script:alert(1)'].join(''),
      ],
    });
  });

  it('protocol-relative cases', () => {
    test({
      validator: 'isURL',
      args: [{ allow_protocol_relative_urls: true }],
      valid: ['//example.com'],
      invalid: ['//user:pass@example.com'],
    });
  });
});
