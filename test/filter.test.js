var node_validator = require('../lib'),
    Filter = new node_validator.Filter(),
    assert = require('assert');

module.exports = {
    'test #ifNull()': function () {

        //Make sure sanitize returns the new string
        assert.equal(5, Filter.sanitize('').ifNull(5));
        assert.equal('abc', Filter.sanitize().ifNull('abc'));

        //Modify Filter.modify() to automatically replace a var with the sanitized version
        var param = '';
        Filter.modify = function(str) {
            this.str = str;
            param = str;
        }
        Filter.sanitize(param).ifNull('foobar');
        assert.equal('foobar', param);
    },

    'test #toBoolean()': function () {
        assert.equal(true, Filter.sanitize('1').toBoolean());
        assert.equal(true, Filter.sanitize('true').toBoolean());
        assert.equal(true, Filter.sanitize('foobar').toBoolean());
        assert.equal(true, Filter.sanitize(5).toBoolean());
        assert.equal(true, Filter.sanitize('   ').toBoolean());

        assert.equal(false, Filter.sanitize('0').toBoolean());
        assert.equal(false, Filter.sanitize('false').toBoolean());
        assert.equal(false, Filter.sanitize('').toBoolean());
        assert.equal(false, Filter.sanitize('false').toBoolean());
    },

    'test #toBooleanStrict()': function () {
        assert.equal(true, Filter.sanitize('1').toBooleanStrict());
        assert.equal(true, Filter.sanitize('true').toBooleanStrict());

        assert.equal(false, Filter.sanitize('foobar').toBooleanStrict());
        assert.equal(false, Filter.sanitize(5).toBooleanStrict());
        assert.equal(false, Filter.sanitize('   ').toBooleanStrict());
        assert.equal(false, Filter.sanitize('0').toBooleanStrict());
        assert.equal(false, Filter.sanitize('false').toBooleanStrict());
        assert.equal(false, Filter.sanitize('').toBooleanStrict());
        assert.equal(false, Filter.sanitize('false').toBooleanStrict());
    },

    'test #trim()': function () {
        //Test trim() with spaces
        assert.equal('abc', Filter.sanitize('  abc').trim());
        assert.equal('abc', Filter.sanitize('abc  ').trim());
        assert.equal('abc', Filter.sanitize('   abc  ').trim());

        //Test trim() with \t
        assert.equal('abc', Filter.sanitize('	abc').trim());
        assert.equal('abc', Filter.sanitize('abc	').trim());
        assert.equal('abc', Filter.sanitize('	abc	').trim());

        //Test trim() with a mixture of \t, \s, \r and \n
        assert.equal('abc', Filter.sanitize('	\r\n  abc\r\n	  ').trim());

        //Test trim() with custom chars
        assert.equal('2', Filter.sanitize('000020000').trim('0'));
        assert.equal('202', Filter.sanitize('01000202100101').trim('01'));
    },

    'test #ltrim()': function () {
        //Test ltrim() with spaces
        assert.equal('abc', Filter.sanitize('  abc').ltrim());
        assert.equal('abc  ', Filter.sanitize('   abc  ').ltrim());

        //Test ltrim() with \t
        assert.equal('abc', Filter.sanitize('	abc').ltrim());
        assert.equal('abc	', Filter.sanitize(' abc	').ltrim());

        //Test ltrim() with a mixture of \t, \s, \r and \n
        assert.equal('abc\r\n', Filter.sanitize('	\r\n  abc\r\n').ltrim());

        //Test ltrim() with custom chars
        assert.equal('20', Filter.sanitize('000020').ltrim('0'));
        assert.equal('201', Filter.sanitize('010100201').ltrim('01'));
    },

    'test #rtrim()': function () {
        //Test rtrim() with spaces
        assert.equal('  abc', Filter.sanitize('  abc  ').rtrim());
        assert.equal('abc', Filter.sanitize('abc  ').rtrim());

        //Test rtrim() with \t
        assert.equal('	abc', Filter.sanitize('	abc').rtrim());
        assert.equal('abc', Filter.sanitize('abc	').rtrim());

        //Test rtrim() with a mixture of \t, \s, \r and \n
        assert.equal('	\r\n  abc', Filter.sanitize('	\r\n  abc\r\n	  ').rtrim());

        //Test rtrim() with custom chars
        assert.equal('02', Filter.sanitize('02000').rtrim('0'));
        assert.equal('012', Filter.sanitize('01201001').rtrim('01'));
    },

    'test #toInt()': function () {
        assert.ok(3 === Filter.sanitize('3').toInt());
        assert.ok(255 === Filter.sanitize('ff').toInt(16));
        assert.ok(3 === Filter.sanitize('   3   ').toInt());
    },

    'test #toFloat()': function () {
        assert.ok(3 === Filter.sanitize('3.').toFloat());
        assert.ok(3 === Filter.sanitize('   3   ').toFloat());
        assert.ok(0 === Filter.sanitize('.0').toFloat());
        assert.ok(13.13 === Filter.sanitize('13.13').toFloat());
    },

    'test #entityDecode()': function () {
        assert.equal('&', Filter.sanitize('&amp;').entityDecode());
        assert.equal('&&', Filter.sanitize('&amp;&amp;').entityDecode());
        assert.equal('""', Filter.sanitize('&quot;&quot;').entityDecode());
        assert.equal('€', Filter.sanitize('&euro;').entityDecode());
        assert.equal("'", Filter.sanitize("&#39;").entityDecode());
        assert.equal("'", Filter.sanitize("&apos;").entityDecode());
        assert.equal('œ', Filter.sanitize('&oelig;').entityDecode());
        assert.equal('½', Filter.sanitize('&frac12;').entityDecode());
    },

    'test #entityEncode()': function () {
        assert.equal('&amp;', Filter.sanitize('&').entityEncode());
        assert.equal('&amp;&amp;', Filter.sanitize('&&').entityEncode());
        assert.equal('&#39;', Filter.sanitize("'").entityEncode());
        assert.equal('&quot;&quot;', Filter.sanitize('""').entityEncode());
        assert.equal('&euro;', Filter.sanitize('€').entityEncode());
        assert.equal('&oelig;', Filter.sanitize('œ').entityEncode());
        assert.equal('&frac12;', Filter.sanitize('½').entityEncode());
    },

    'test #escape': function () {
        assert.equal('&amp;&lt;&quot;&gt;', Filter.sanitize('&<">').escape());
    }

}
