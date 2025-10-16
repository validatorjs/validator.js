// Additional test cases to improve coverage of authentication detection logic
const assert = require('assert');
const validator = require('./validator');

console.log('Testing edge cases for 100% coverage:\n');

const tests = [
  // Edge case: protocol-like pattern with @ but with //
  { url: 'custom://user:pass@example.com', opts: { require_valid_protocol: false }, expected: true, desc: 'Protocol with auth and //' },

  // Edge case: authentication pattern variations
  { url: 'user:pass123@subdomain.example.com', opts: { disallow_auth: false }, expected: true, desc: 'Auth with subdomain' },
  { url: 'a:@example.com', opts: { disallow_auth: false }, expected: true, desc: 'Single char username with :@' },
  { url: 'test:password@domain.co.uk', opts: { disallow_auth: false }, expected: true, desc: 'Auth with multi-level TLD' },

  // Edge case: Make sure dangerous protocols still fail even with @ in remainder
  { url: 'javascript:alert@domain.com', opts: {}, expected: false, desc: 'JavaScript with @ in code (not auth)' },
  { url: 'data:@example.com', opts: {}, expected: false, desc: 'Data URI with @ pattern' },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = validator.isURL(test.url, test.opts);
  const status = result === test.expected ? '✓' : '✗';

  if (result === test.expected) {
    passed++;
    console.log(`${status} PASS: ${test.desc}`);
  } else {
    failed++;
    console.log(`${status} FAIL: ${test.desc}`);
    console.log(`  URL: ${test.url}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}`);
  }
});

console.log(`\n${passed}/${tests.length} tests passed`);
process.exit(failed > 0 ? 1 : 0);
