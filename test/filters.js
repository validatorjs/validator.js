var assert = require('assert')
  , validator = require('../');

var filter = new validator.Filter()
  , sanitize = filter.sanitize.bind(filter);

describe('Filters', function () {

    it('should sanitize null values', function () {
        assert.equal(sanitize('').ifNull('foo'), 'foo');
        assert.equal(sanitize().ifNull('bar'), 'bar');
        assert.equal(sanitize('baz').ifNull('qux'), 'baz');
    });

    it('should sanitize boolean values', function () {
        assert.equal(sanitize('0').toBoolean(), false);
        assert.equal(sanitize('').toBoolean(), false);
        assert.equal(sanitize('false').toBoolean(), false);
        assert.equal(sanitize('1').toBoolean(), true);
        assert.equal(sanitize('true').toBoolean(), true);
        assert.equal(sanitize('   ').toBoolean(), true);
        assert.equal(sanitize('True').toBoolean(), true);
        assert.equal(sanitize('FOOBAR').toBoolean(), true);
        assert.equal(sanitize('0').toBooleanStrict(), false);
        assert.equal(sanitize('').toBooleanStrict(), false);
        assert.equal(sanitize('false').toBooleanStrict(), false);
        assert.equal(sanitize('1').toBooleanStrict(), true);
        assert.equal(sanitize('true').toBooleanStrict(), true);
        assert.equal(sanitize('   ').toBooleanStrict(), false);
        assert.equal(sanitize('True').toBooleanStrict(), false);
        assert.equal(sanitize('FOOBAR').toBooleanStrict(), false);
    });

    it('should trim whitespace', function () {
        assert.equal(sanitize('  \r\n abc \r\n   ').trim(), 'abc');
        assert.equal(sanitize('  \r\n abc \r\n   ').trim(' '), '\r\n abc \r\n');
        assert.equal(sanitize('  \r\n abc \r\n   ').ltrim(), 'abc \r\n   ');
        assert.equal(sanitize('  \r\n abc \r\n   ').ltrim(' \n\r'), 'abc \r\n   ');
        assert.equal(sanitize('  \r\n abc \r\n   ').rtrim(), '  \r\n abc');
        assert.equal(sanitize('  \r\n abc \r\n   ').rtrim(' \r\n'), '  \r\n abc');
        assert.equal(sanitize('001000102020101011').trim('01'), '202');
    });

    it('should convert strings to integers', function () {
        assert.equal(sanitize('3').toInt(), 3);
        assert.equal(sanitize('ff').toInt(16), 255);
        assert.equal(sanitize('   3   ').toInt(), 3);
    });

    it('should convert strings to floats', function () {
        assert.equal(sanitize('2').toFloat(), 2);
        assert.equal(sanitize('2.').toFloat(), 2);
        assert.equal(sanitize('2.5').toFloat(), 2.5);
        assert.equal(sanitize('.5').toFloat(), 0.5);
    });

    it('should encode and decode entities', function () {
        assert.equal(sanitize('&amp;&unknown;&amp&#39;&#x27;&apos;&oelig;&frac12;').entityDecode(),
            '&&unknown;&amp\'\'\'œ½');
        assert.equal(sanitize('\'"€½').entityEncode(), '&#39;&quot;&euro;&frac12;');
        assert.equal(sanitize('foobar').entityDecode(), 'foobar');
    });

    it('should escape HTML', function () {
        assert.equal(sanitize('&<">').escape(), '&amp;&lt;&quot;&gt;');
    });

    it('should let the user chain filters', function () {
        assert.equal(sanitize('   ').chain().trim().ifNull('foobar').value(), 'foobar');
    });

});
