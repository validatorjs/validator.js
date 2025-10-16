// Test the authentication URL fix
const validator = require('./validator');

console.log('Testing authentication URL fix:\n');

// Test case that was failing
const authTests = [
  { url: 'user:@example.com', expected: true, desc: 'Authentication with username only' },
  { url: 'user:pass@example.com', expected: true, desc: 'Authentication with username and password' },
  { url: 'http://user:pass@example.com', expected: true, desc: 'HTTP with authentication' },
];

// Security tests - should still fail
const securityTests = [
  { url: 'javascript:alert(1)', expected: false, desc: 'JavaScript URI' },
  { url: 'data:text/html,<script>alert(1)</script>', expected: false, desc: 'Data URI' },
  { url: 'vbscript:msgbox(1)', expected: false, desc: 'VBScript URI' },
];

let passed = 0;
let failed = 0;

console.log('=== Authentication URL Tests (should pass) ===');
authTests.forEach(test => {
  const result = validator.isURL(test.url, { disallow_auth: false });
  const status = result === test.expected ? '✓ PASS' : '✗ FAIL';
  if (result === test.expected) passed++;
  else failed++;
  console.log(`${status}: ${test.desc}`);
  console.log(`  URL: ${test.url}`);
  console.log(`  Expected: ${test.expected}, Got: ${result}\n`);
});

console.log('=== Security Tests (should fail) ===');
securityTests.forEach(test => {
  const result = validator.isURL(test.url);
  const status = result === test.expected ? '✓ PASS' : '✗ FAIL';
  if (result === test.expected) passed++;
  else failed++;
  console.log(`${status}: ${test.desc}`);
  console.log(`  URL: ${test.url}`);
  console.log(`  Expected: ${test.expected}, Got: ${result}\n`);
});

console.log('===========================================');
console.log(`Total: ${passed + failed} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('===========================================');

process.exit(failed > 0 ? 1 : 0);
