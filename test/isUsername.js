import assert from 'assert';
import isUsername from '../src/lib/isUsername';

describe('isUsername', () => {
  it('should return true for valid usernames', () => {
    assert.strictEqual(isUsername('roghana'), true);
    assert.strictEqual(isUsername('user123'), true);
  });

  it('should return false if username length is less than 3', () => {
    assert.strictEqual(isUsername('ab'), false);
  });

  it('should return false if username length is more than 15', () => {
    assert.strictEqual(isUsername('verylongusername123'), false);
  });

  it('should return false if username contains restricted special characters', () => {
    assert.strictEqual(isUsername('user@123'), false);
    assert.strictEqual(isUsername('hello#'), false);
    assert.strictEqual(isUsername('$money'), false);
  });
});
