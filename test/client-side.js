var assert = require('assert')
  , server = require('../')
  , client;

try {
    client = require('../dist/validator.min.js');
} catch (err) {
    throw new Error('Failed to load the client-side version. Try a `make min`');
}

describe('Client-side version', function () {

    it('should export the same things as the server-side version', function () {
        for (var key in server) {
            assert.equal(typeof server[key], typeof client[key],
                'Client did not export ' + key);
        }
        assert.equal(client.version, server.version, 'Client-side version mismatch');
    });

    it('should validate strings', function () {
        client.check('foo@bar.com').isEmail();
        var message;
        try {
            client.check('foo', 'Invalid email').isEmail();
        } catch (err) {
            assert(err instanceof client.ValidatorError);
            message = err.message;
        }
        assert.equal(message, 'Invalid email');
    });

    it('should filter strings', function () {
        assert.equal(client.sanitize('1').toBoolean(), true);
        assert.equal(client.sanitize('&amp;').entityDecode(), '&');
    });

});
