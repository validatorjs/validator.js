var validator = require('../validator')
  , format = require('util').format;

function test(options) {
    var args = options.args || [];
    args.unshift(null);
    Object.keys(options.expect).forEach(function (input) {
        args[0] = input;
        var result = validator[options.sanitizer].apply(validator, args)
          , expected = options.expect[input];
        if (isNaN(result) && !result.length && isNaN(expected)) {
            return;
        }
        if (result !== expected) {
            var warning = format('validator.%s(%s) returned "%s" but should have returned "%s"',
                options.sanitizer, args.join(', '), result, expected);
            throw new Error(warning);
        }
    });
}

describe('Sanitizers', function () {

    it('should sanitize boolean strings', function () {
        test({
            sanitizer: 'toBoolean'
          , expect: {
                '0': false
              , '': false
              , '1': true
              , 'true': true
              , 'foobar': true
              , '   ': true
            }
        });
        test({
            sanitizer: 'toBoolean'
          , args: [ true ] //strict
          , expect: {
                '0': false
              , '': false
              , '1': true
              , 'true': true
              , 'foobar': false
              , '   ': false
            }
        });
    });

    it('should trim whitespace', function () {
        test({
            sanitizer: 'trim'
          , expect: { '  \r\n\tfoo  \r\n\t   ': 'foo' }
        });
        test({
            sanitizer: 'ltrim'
          , expect: { '  \r\n\tfoo  \r\n\t   ': 'foo  \r\n\t   ' }
        });
        test({
            sanitizer: 'rtrim'
          , expect: { '  \r\n\tfoo  \r\n\t   ': '  \r\n\tfoo' }
        });
    });

    it('should trim custom characters', function () {
        test({
            sanitizer: 'trim'
          , args: [ '01' ]
          , expect: { '010100201000': '2' }
        });
        test({
            sanitizer: 'ltrim'
          , args: [ '01' ]
          , expect: { '010100201000': '201000' }
        });
        test({
            sanitizer: 'rtrim'
          , args: [ '01' ]
          , expect: { '010100201000': '0101002' }
        });
    });

    it('should convert strings to integers', function () {
        test({
            sanitizer: 'toInt'
          , expect: {
                '3': 3
              , ' 3 ': 3
              , '2.4': 2
              , 'foo': NaN
            }
        });
        test({
            sanitizer: 'toInt'
          , args: [ 16 ]
          , expect: { 'ff': 255 }
        });
    });

    it('should convert strings to floats', function () {
        test({
            sanitizer: 'toFloat'
          , expect: {
                '2': 2.0
              , '2.': 2.0
              , '-2.5': -2.5
              , '.5': 0.5
              , 'foo': NaN
            }
        });
    });

    it('should escape HTML', function () {
        test({
            sanitizer: 'escape'
          , expect: {
                '<script> alert("xss&fun"); </script>': '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;'
              , "<script> alert('xss&fun'); </script>": '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;'
            }
        });
    });

    it('should remove control characters (<32 and 127)', function () {
        // Check basic functionality
        test({
            sanitizer: 'stripLow'
          , expect: {
                "foo\x00": "foo"
              , "\x7Ffoo\x02": "foo"
              , "\x01\x09": ""
              , "foo\x0A\x0D": "foo"
            }
        });
        // Unicode safety
        test({
            sanitizer: 'stripLow'
          , expect: {
                "perch\u00e9": "perch\u00e9"
              , "\u20ac": "\u20ac"
              , "\u2206\x0A": "\u2206"
              , "\ud83d\ude04": "\ud83d\ude04"
            }
        });
        // Preserve newlines
        test({
            sanitizer: 'stripLow'
          , args: [ true ] //keep_new_lines
          , expect: {
                "foo\x0A\x0D": "foo\x0A\x0D"
              , "\x03foo\x0A\x0D": "foo\x0A\x0D"
            }
        });
    });


    it('should sanitize a string based on a whitelist', function () {
        test({
            sanitizer: 'whitelist'
          , args: [ 'abc' ]
          , expect: {
                'abcdef': 'abc'
              , 'aaaaaaaaaabbbbbbbbbb': 'aaaaaaaaaabbbbbbbbbb'
              , 'a1b2c3': 'abc'
              , '   ': ''
            }
        });
    });

    it('should sanitize a string based on a blacklist', function () {
        test({
            sanitizer: 'blacklist'
          , args: [ 'abc' ]
          , expect: {
                'abcdef': 'def'
              , 'aaaaaaaaaabbbbbbbbbb': ''
              , 'a1b2c3': '123'
              , '   ': '   '
            }
        });
    });

    it('should normalize an email based on domain', function () {
        test({
            sanitizer: 'normalizeEmail'
          , expect: {
                'test@me.com': 'test@me.com'
              , 'some.name@gmail.com': 'somename@gmail.com'
              , 'some.name@googleMail.com': 'somename@gmail.com'
              , 'some.name+extension@gmail.com': 'somename@gmail.com'
              , 'some.Name+extension@GoogleMail.com': 'somename@gmail.com'
              , 'some.name.middleName+extension@gmail.com': 'somenamemiddlename@gmail.com'
              , 'some.name.middleName+extension@GoogleMail.com': 'somenamemiddlename@gmail.com'
              , 'some.name.midd.leNa.me.+extension@gmail.com': 'somenamemiddlename@gmail.com'
              , 'some.name.midd.leNa.me.+extension@GoogleMail.com': 'somenamemiddlename@gmail.com'
              , 'some.name+extension@unknown.com': 'some.name+extension@unknown.com'
              , 'hans@m端ller.com': 'hans@m端ller.com'
              , 'an invalid email address': false
              , '': false
              // some.name.midd..leNa...me...+extension@GoogleMail.com was removed from test cases because of a bug with validator.isEmail. See issue #258
            }
        });
        test({
            sanitizer: 'normalizeEmail'
          , args: [{lowercase: false}]
          , expect: {
                'test@me.com': 'test@me.com'
              , 'hans@m端ller.com': 'hans@m端ller.com'
              , 'test@ME.COM': 'test@me.com' // Hostname is always lowercased
              , 'TEST@me.com': 'TEST@me.com'
              , 'TEST@ME.COM': 'TEST@me.com'
              , 'blAH@x.com': 'blAH@x.com'
                
                // Domains that are known for being case-insensitive are always lowercased
              , 'SOME.name@GMAIL.com': 'somename@gmail.com'
              , 'SOME.name.middleName+extension@GoogleMail.com': 'somenamemiddlename@gmail.com'
              , 'SOME.name.midd.leNa.me.+extension@gmail.com': 'somenamemiddlename@gmail.com'
            }
        });
    });

});
