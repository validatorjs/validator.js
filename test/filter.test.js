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

    'test #xss()': function () {
        //Need more tests!
        assert.equal('[removed] foobar', Filter.sanitize('javascript  : foobar').xss());
        assert.equal('[removed] foobar', Filter.sanitize('j a vasc ri pt: foobar').xss());
        assert.equal('<a >some text</a>', Filter.sanitize('<a href="javascript:alert(\'xss\')">some text</a>').xss());

        assert.equal('<s <> <s >This is a test</s>', Filter.sanitize('<s <onmouseover="alert(1)"> <s onmouseover="alert(1)">This is a test</s>').xss());
        assert.equal('<a >">test</a>', Filter.sanitize('<a href="javascriptJ a V a S c R iPt::alert(1)" "<s>">test</a>').xss());
        assert.equal('<div ><h1>You have won</h1>Please click the link and enter your login details: <a href="http://example.com/">http://good.com</a></div>', Filter.sanitize('<div style="z-index: 9999999; background-color: green; width: 100%; height: 100%"><h1>You have won</h1>Please click the link and enter your login details: <a href="http://example.com/">http://good.com</a></div>').xss());
        assert.equal('<scrRedirec[removed]t 302ipt type="text/javascript">prompt(1);</scrRedirec[removed]t 302ipt>', Filter.sanitize('<scrRedirecRedirect 302t 302ipt type="text/javascript">prompt(1);</scrRedirecRedirect 302t 302ipt>').xss());
        assert.equal('<img src="a" ', Filter.sanitize('<img src="a" onerror=\'eval(atob("cHJvbXB0KDEpOw=="))\'').xss());


        // Source: http://blog.kotowicz.net/2012/07/codeigniter-210-xssclean-cross-site.html
        assert.equal('<img src=">" >', Filter.sanitize('<img/src=">" onerror=alert(1)>').xss());
        assert.equal('<button a=">" autofocus ></button>', Filter.sanitize('<button/a=">" autofocus onfocus=alert&#40;1&#40;></button>').xss());
        assert.equal('<button a=">" autofocus >', Filter.sanitize('<button a=">" autofocus onfocus=alert&#40;1&#40;>').xss());
        assert.equal('<a target="_blank">clickme in firefox</a>', Filter.sanitize('<a target="_blank" href="data:text/html;BASE64youdummy,PHNjcmlwdD5hbGVydCh3aW5kb3cub3BlbmVyLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwpPC9zY3JpcHQ+">clickme in firefox</a>').xss());
        assert.equal('<a/\'\'\' target="_blank" href=[removed]PHNjcmlwdD5hbGVydChvcGVuZXIuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwpPC9zY3JpcHQ+>firefox11</a>', Filter.sanitize('<a/\'\'\' target="_blank" href=data:text/html;;base64,PHNjcmlwdD5hbGVydChvcGVuZXIuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwpPC9zY3JpcHQ+>firefox11</a>').xss());

        var url = 'http://www.example.com/test.php?a=b&b=c&c=d';
        assert.equal(url, Filter.sanitize(url).xss());
    },

    'test chaining': function () {
        assert.equal('&amp;amp;amp;', Filter.sanitize('&').chain().entityEncode().entityEncode().entityEncode().value());

        //Return the default behaviour
        Filter.wrap = function (str) {
            return str;
        }
    },

    'test #escape': function () {
        assert.equal('&amp;&lt;&quot;&gt;', Filter.sanitize('&<">').escape());
    }

}
