var validator = require('../validator')
  , format = require('util').format
  , contextify = require('contextify')
  , assert = require('assert')
  , path = require('path')
  , fs = require('fs');

var validator_js = fs.readFileSync(path.join(__dirname, '../validator.js')).toString();

function test(options) {
    var args = options.args || [];
    args.unshift(null);
    if (options.valid) {
        options.valid.forEach(function (valid) {
            args[0] = valid;
            if (validator[options.validator].apply(validator, args) !== true) {
                var warning = format('validator.%s(%s) failed but should have passed',
                    options.validator, args.join(', '));
                throw new Error(warning);
            }
        });
    }
    if (options.invalid) {
        options.invalid.forEach(function (invalid) {
            args[0] = invalid;
            if (validator[options.validator].apply(validator, args) !== false) {
                var warning = format('validator.%s(%s) passed but should have failed',
                    options.validator, args.join(', '));
                throw new Error(warning);
            }
        });
    }
}

describe('Validators', function () {

    it('should validate email addresses', function () {
        test({
            validator: 'isEmail'
          , valid: [
                'foo@bar.com'
              , 'x@x.x'
              , 'foo@bar.com.au'
              , 'foo+bar@bar.com'
              , 'hans.m端ller@test.com'
              , 'hans@m端ller.com'
              , 'test|123@m端ller.com'
              , 'test+ext@gmail.com'
              , 'some.name.midd.leNa.me.+extension@GoogleMail.com'
            ]
          , invalid: [
                'invalidemail@'
              , 'invalid.com'
              , '@invalid.com'
              , 'foo@bar.com.'
              , 'foo@bar.co.uk.'
            ]
        });
    });

    it('should validate email addresses with display names', function () {
        test({
            validator: 'isEmail'
          , args: [{ allow_display_name: true }]
          , valid: [
                'foo@bar.com'
              , 'x@x.x'
              , 'foo@bar.com.au'
              , 'foo+bar@bar.com'
              , 'hans.m端ller@test.com'
              , 'hans@m端ller.com'
              , 'test|123@m端ller.com'
              , 'test+ext@gmail.com'
              , 'some.name.midd.leNa.me.+extension@GoogleMail.com'
              , 'Some Name <foo@bar.com>'
              , 'Some Name <x@x.x>'
              , 'Some Name <foo@bar.com.au>'
              , 'Some Name <foo+bar@bar.com>'
              , 'Some Name <hans.m端ller@test.com>'
              , 'Some Name <hans@m端ller.com>'
              , 'Some Name <test|123@m端ller.com>'
              , 'Some Name <test+ext@gmail.com>'
              , 'Some Name <some.name.midd.leNa.me.+extension@GoogleMail.com>'
              , 'Some Middle Name <some.name.midd.leNa.me.+extension@GoogleMail.com>'
              , 'Name <some.name.midd.leNa.me.+extension@GoogleMail.com>'
              , 'Name<some.name.midd.leNa.me.+extension@GoogleMail.com>'
            ]
          , invalid: [
                'invalidemail@'
              , 'invalid.com'
              , '@invalid.com'
              , 'foo@bar.com.'
              , 'foo@bar.co.uk.'
              , 'Some Name <invalidemail@>'
              , 'Some Name <invalid.com>'
              , 'Some Name <@invalid.com>'
              , 'Some Name <foo@bar.com.>'
              , 'Some Name <foo@bar.co.uk.>'
              , 'Some Name foo@bar.co.uk.>'
              , 'Some Name <foo@bar.co.uk.'
              , 'Some Name < foo@bar.co.uk >'
              , 'Name foo@bar.co.uk'
            ]
        });
    });

    it('should validate URLs', function () {
        test({
            validator: 'isURL'
          , valid: [
                'foobar.com'
              , 'www.foobar.com'
              , 'foobar.com/'
              , 'valid.au'
              , 'http://www.foobar.com/'
              , 'http://www.foobar.com:23/'
              , 'http://www.foobar.com:65535/'
              , 'http://www.foobar.com:5/'
              , 'https://www.foobar.com/'
              , 'ftp://www.foobar.com/'
              , 'http://www.foobar.com/~foobar'
              , 'http://user:pass@www.foobar.com/'
              , 'http://127.0.0.1/'
              , 'http://10.0.0.0/'
              , 'http://189.123.14.13/'
              , 'http://duckduckgo.com/?q=%2F'
              , 'http://foobar.com/t$-_.+!*\'(),'
              , 'http://localhost:3000/'
              , 'http://foobar.com/?foo=bar#baz=qux'
              , 'http://foobar.com?foo=bar'
              , 'http://foobar.com#baz=qux'
              , 'http://www.xn--froschgrn-x9a.net/'
              , 'http://xn--froschgrn-x9a.com/'
              , 'http://foo--bar.com'
              , 'http://høyfjellet.no'
              , 'http://xn--j1aac5a4g.xn--j1amh'
              , 'http://кулік.укр'
            ]
          , invalid: [
                'xyz://foobar.com'
              , 'invalid/'
              , 'invalid.x'
              , 'invalid.'
              , '.com'
              , 'http://com/'
              , 'http://300.0.0.1/'
              , 'mailto:foo@bar.com'
              , 'rtmp://foobar.com'
              , 'http://www.xn--.com/'
              , 'http://xn--.com/'
              , 'http://www.foobar.com:0/'
              , 'http://www.foobar.com:70000/'
              , 'http://www.foobar.com:99999/'
              , 'http://www.-foobar.com/'
              , 'http://www.foobar-.com/'
              , 'http://www.foo---bar.com/'
              , 'http://www.foo_bar.com/'
              , ''
              , 'http://foobar.com/' + new Array(2083).join('f')
              , 'http://*.foo.com'
              , '*.foo.com'
              , '!.foo.com'
              , 'http://example.com.'
              , 'http://localhost:61500this is an invalid url!!!!'
              , '////foobar.com'
              , 'http:////foobar.com'
            ]
        });
    });

    it('should validate URLs with custom protocols', function () {
        test({
            validator: 'isURL'
          , args: [{
                protocols: [ 'rtmp' ]
            }]
          , valid: [
                'rtmp://foobar.com'
            ]
          , invalid: [
                'http://foobar.com'
            ]
        });
    });

    it('should validate URLs with underscores', function () {
        test({
            validator: 'isURL'
          , args: [{
                allow_underscores: true
            }]
          , valid: [
                'http://foo_bar.com'
              , 'http://pr.example_com.294.example.com/'
            ]
          , invalid: [
                'http://foo__bar.com'
            ]
        });
    });

    it('should validate URLs that do not have a TLD', function () {
        test({
            validator: 'isURL'
          , args: [{
                require_tld: false
            }]
          , valid: [
                'http://foobar.com/'
              , 'http://foobar/'
              , 'foobar/'
              , 'foobar'
            ]
          , invalid: [
            ]
        });
    });

    it('should validate URLs with a trailing dot option', function () {
        test({
            validator: 'isURL'
          , args: [{
                allow_trailing_dot: true
              , require_tld: false
            }]
          , valid: [
                'http://example.com.'
              , 'foobar.'
            ]
        });
    });

    it('should validate protocol relative URLs', function () {
        test({
            validator: 'isURL'
            , args: [{
                allow_protocol_relative_urls: true
            }]
            , valid: [
                  '//foobar.com'
                , 'http://foobar.com'
                , 'foobar.com'
            ]
            , invalid: [
                  '://foobar.com'
                , '/foobar.com'
                , '////foobar.com'
                , 'http:////foobar.com'
            ]
        });
    });

    it('should not validate protocol relative URLs when require protocol is true', function () {
        test({
            validator: 'isURL'
            , args: [{
                allow_protocol_relative_urls: true,
                require_protocol: true
            }]
            , valid: [
                'http://foobar.com'
            ]
            , invalid: [
                  '//foobar.com'
                , '://foobar.com'
                , '/foobar.com'
                , 'foobar.com'
            ]
        });
    });

    it('should let users specify whether URLs require a protocol', function () {
        test({
            validator: 'isURL'
          , args: [{
                require_protocol: true
            }]
          , valid: [
                'http://foobar.com/'
              , 'http://localhost/'
            ]
          , invalid: [
                'foobar.com'
              , 'foobar'
            ]
        });
    });

    it('should let users specify a host whitelist', function () {
        test({
            validator: 'isURL'
          , args: [{
                host_whitelist: ['foo.com', 'bar.com']
            }]
          , valid: [
                'http://bar.com/'
              , 'http://foo.com/'
            ]
          , invalid: [
                'http://foobar.com'
              , 'http://foo.bar.com/'
              , 'http://qux.com'
            ]
        });
    });

    it('should let users specify a host blacklist', function () {
        test({
            validator: 'isURL'
          , args: [{
                host_blacklist: ['foo.com', 'bar.com']
            }]
          , valid: [
                'http://foobar.com'
              , 'http://foo.bar.com/'
              , 'http://qux.com'
            ]
          , invalid: [
                'http://bar.com/'
              , 'http://foo.com/'
            ]
        });
    });

    it('should validate IP addresses', function () {
        test({
            validator: 'isIP'
          , valid: [
                '127.0.0.1'
              , '0.0.0.0'
              , '255.255.255.255'
              , '1.2.3.4'
              , '::1'
              , '2001:db8:0000:1:1:1:1:1'
              , '2001:41d0:2:a141::1'
              , '::0000'
              , '0000::'
              , '1::'
              , '1111:1:1:1:1:1:1:1'
              , 'fe80::a6db:30ff:fe98:e946'
              , '::'
            ]
          , invalid: [
                'abc'
              , '256.0.0.0'
              , '0.0.0.256'
              , '26.0.0.256'
              , '::banana'
              , 'banana::'
              , '::1banana'
              , '::1::'
              , '1:'
              , ':1'
              , ':1:1:1::2'
              , '1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1'
              , '::11111'
              , '11111:1:1:1:1:1:1:1'
              , '2001:db8:0000:1:1:1:1::1'
            ]
        });
        test({
            validator: 'isIP'
          , args: [ 4 ]
          , valid: [
                '127.0.0.1'
              , '0.0.0.0'
              , '255.255.255.255'
              , '1.2.3.4'
            ]
          , invalid: [
                '::1'
              , '2001:db8:0000:1:1:1:1:1'
            ]
        });
        test({
            validator: 'isIP'
          , args: [ 6 ]
          , valid: [
                '::1'
              , '2001:db8:0000:1:1:1:1:1'
            ]
          , invalid: [
                '127.0.0.1'
              , '0.0.0.0'
              , '255.255.255.255'
              , '1.2.3.4'
            ]
        });
        test({
            validator: 'isIP'
          , args: [ 10 ]
          , valid: [
            ]
          , invalid: [
                '127.0.0.1'
              , '0.0.0.0'
              , '255.255.255.255'
              , '1.2.3.4'
              , '::1'
              , '2001:db8:0000:1:1:1:1:1'
            ]
        });
    });

    it('should validate FQDN', function () {
        test({
            validator: 'isFQDN'
          , valid: [
                'domain.com'
              , 'dom.plato'
              , 'a.domain.co'
              , 'foo--bar.com'
              , 'xn--froschgrn-x9a.com'
              , 'rebecca.blackfriday'
            ]
          , invalid: [
                'abc'
              , '256.0.0.0'
              , '_.com'
              , '*.some.com'
              , 's!ome.com'
              , 'domain.com/'
              , '/more.com'
            ]
        });
    });
    it('should validate FQDN with trailing dot option', function() {
        test({
            validator: 'isFQDN'
          , args: [
                {allow_trailing_dot:true}
            ]
          , valid: [
                'example.com.'
          ]
        });
    });

    it('should validate alpha strings', function () {
        test({
            validator: 'isAlpha'
          , valid: [
                'abc'
              , 'ABC'
              , 'FoObar'
            ]
          , invalid: [
                'abc1'
              , '  foo  '
              , ''
            ]
        });
    });

    it('should validate alphanumeric strings', function () {
        test({
            validator: 'isAlphanumeric'
          , valid: [
                'abc123'
              , 'ABC11'
            ]
          , invalid: [
                'abc '
              , 'foo!!'
            ]
        });
    });

    it('should validate numeric strings', function () {
        test({
            validator: 'isNumeric'
          , valid: [
                '123'
              , '00123'
              , '-00123'
              , '0'
              , '-0'
              , '+123'
            ]
          , invalid: [
                '123.123'
              , ' '
              , '.'
            ]
        });
    });

    it('should validate lowercase strings', function () {
        test({
            validator: 'isLowercase'
          , valid: [
                'abc'
              , 'abc123'
              , 'this is lowercase.'
              , 'tr竪s 端ber'
            ]
          , invalid: [
                'fooBar'
              , '123A'
            ]
        });
    });

    it('should validate uppercase strings', function () {
        test({
            validator: 'isUppercase'
          , valid: [
                'ABC'
              , 'ABC123'
              , 'ALL CAPS IS FUN.'
              , '   .'
            ]
          , invalid: [
                'fooBar'
              , '123abc'
            ]
        });
    });

    it('should validate integers', function () {
        test({
            validator: 'isInt'
          , valid: [
                '13'
              , '123'
              , '0'
              , '123'
              , '-0'
              , '+1'
            ]
          , invalid: [
                '01'
              , '-01'
              , '000'
              , '100e10'
              , '123.123'
              , '   '
              , ''
            ]
        });
    });

    it('should validate floats', function () {
        test({
            validator: 'isFloat'
          , valid: [
                '123'
              , '123.'
              , '123.123'
              , '-123.123'
              , '-0.123'
              , '+0.123'
              , '0.123'
              , '.0'
              , '01.123'
              , '-0.22250738585072011e-307'
            ]
          , invalid: [
                '-.123'
              , '  '
              , ''
              , 'foo'
            ]
        });
    });

    it('should validate hexadecimal strings', function () {
        test({
            validator: 'isHexadecimal'
          , valid: [
                'deadBEEF'
              , 'ff0044'
            ]
          , invalid: [
                'abcdefg'
              , ''
              , '..'
            ]
        });
    });

    it('should validate hexadecimal color strings', function () {
        test({
            validator: 'isHexColor'
          , valid: [
                '#ff0034'
              , '#CCCCCC'
              , 'fff'
              , '#f00'
            ]
          , invalid: [
                '#ff'
              , 'fff0'
              , '#ff12FG'
            ]
        });
    });

    it('should validate null strings', function () {
        test({
            validator: 'isNull'
          , valid: [
                ''
              , NaN
              , []
              , undefined
              , null
            ]
          , invalid: [
                ' '
              , 'foo'
            ]
        });
    });

    it('should validate strings against an expected value', function () {
        test({ validator: 'equals', args: ['abc'], valid: ['abc'], invalid: ['Abc', '123'] });
    });

    it('should validate strings contain another string', function () {
        test({ validator: 'contains', args: ['foo'], valid: ['foo', 'foobar', 'bazfoo'],
            invalid: ['bar', 'fobar'] });
    });

    it('should validate strings against a pattern', function () {
        test({ validator: 'matches', args: [/abc/], valid: ['abc', 'abcdef', '123abc'],
            invalid: ['acb', 'Abc'] });
        test({ validator: 'matches', args: ['abc'], valid: ['abc', 'abcdef', '123abc'],
            invalid: ['acb', 'Abc'] });
        test({ validator: 'matches', args: ['abc', 'i'], valid: ['abc', 'abcdef', '123abc', 'AbC'],
            invalid: ['acb'] });
    });

    it('should validate strings by length', function () {
        test({ validator: 'isLength', args: [2], valid: ['abc', 'de', 'abcd'], invalid: [ '', 'a' ] });
        test({ validator: 'isLength', args: [2, 3], valid: ['abc', 'de'], invalid: [ '', 'a', 'abcd' ] });
        test({ validator: 'isLength', args: [2, 3], valid: ['干𩸽', '𠮷野家'], invalid: [ '', '𠀋', '千竈通り' ] });
    });

    it('should validate strings by byte length', function () {
        test({ validator: 'isByteLength', args: [2], valid: ['abc', 'de', 'abcd'], invalid: [ '', 'a' ] });
        test({ validator: 'isByteLength', args: [2, 3], valid: ['abc', 'de'], invalid: [ '', 'a', 'abcd' ] });
    });

    it('should validate UUIDs', function () {
        test({
            validator: 'isUUID'
          , valid: [
                'A987FBC9-4BED-3078-CF07-9141BA07C9F3'
              , 'A987FBC9-4BED-4078-8F07-9141BA07C9F3'
              , 'A987FBC9-4BED-5078-AF07-9141BA07C9F3'
            ]
          , invalid: [
                ''
              , 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3'
              , 'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx'
              , 'A987FBC94BED3078CF079141BA07C9F3'
              , '934859'
              , '987FBC9-4BED-3078-CF07A-9141BA07C9F3'
              , 'AAAAAAAA-1111-1111-AAAG-111111111111'
            ]
        });
        test({
            validator: 'isUUID'
          , args: [ 3 ]
          , valid: [
                'A987FBC9-4BED-3078-CF07-9141BA07C9F3'
            ]
          , invalid: [
                ''
              , 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3'
              , '934859'
              , 'AAAAAAAA-1111-1111-AAAG-111111111111'
              , 'A987FBC9-4BED-4078-8F07-9141BA07C9F3'
              , 'A987FBC9-4BED-5078-AF07-9141BA07C9F3'
            ]
        });
        test({
            validator: 'isUUID'
          , args: [ 4 ]
          , valid: [
                '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1'
              , '625e63f3-58f5-40b7-83a1-a72ad31acffb'
              , '57b73598-8764-4ad0-a76a-679bb6640eb1'
              , '9c858901-8a57-4791-81fe-4c455b099bc9'
            ]
          , invalid: [
                ''
              , 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3'
              , '934859'
              , 'AAAAAAAA-1111-1111-AAAG-111111111111'
              , 'A987FBC9-4BED-5078-AF07-9141BA07C9F3'
              , 'A987FBC9-4BED-3078-CF07-9141BA07C9F3'
            ]
        });
        test({
            validator: 'isUUID'
          , args: [ 5 ]
          , valid: [
                '987FBC97-4BED-5078-AF07-9141BA07C9F3'
              , '987FBC97-4BED-5078-BF07-9141BA07C9F3'
              , '987FBC97-4BED-5078-8F07-9141BA07C9F3'
              , '987FBC97-4BED-5078-9F07-9141BA07C9F3'
            ]
          , invalid: [
                ''
              , 'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3'
              , '934859'
              , 'AAAAAAAA-1111-1111-AAAG-111111111111'
              , '9c858901-8a57-4791-81fe-4c455b099bc9'
              , 'A987FBC9-4BED-3078-CF07-9141BA07C9F3'
            ]
        });
    });

    it('should validate a string that is in another string or array', function () {
        test({ validator: 'isIn', args: ['foobar'], valid: ['foo', 'bar', 'foobar', ''],
            invalid: ['foobarbaz', 'barfoo'] });
        test({ validator: 'isIn', args: [['foo', 'bar']], valid: ['foo', 'bar'],
            invalid: ['foobar', 'barfoo', ''] });
        test({ validator: 'isIn', args: [[1, 2, 3]], valid: ['1', '2', '3'],
            invalid: ['4', ''] });
        test({ validator: 'isIn', invalid: ['foo', ''] });
    });

    it('should validate a string that is in another object', function () {
        test({ validator: 'isIn', args: [{'foo':1, 'bar':2, 'foobar':3}], valid: ['foo', 'bar', 'foobar'],
            invalid: ['foobarbaz', 'barfoo', ''] });
        test({ validator: 'isIn', args: [{1:3, 2:0, 3:1}], valid: ['1', '2', '3'],
            invalid: ['4', ''] });
    });

    it('should validate dates', function () {
        test({
            validator: 'isDate'
          , valid: [
                '2011-08-04'
              , '04. 08. 2011.'
              , '08/04/2011'
              , '2011.08.04'
              , '4. 8. 2011. GMT'
              , '2011-08-04 12:00'
            ]
          , invalid: [
                'foo'
              , '2011-foo-04'
              , 'GMT'
            ]
        });
    });

    it('should validate dates against a start date', function () {
        test({ validator: 'isAfter', args: ['2011-08-03'],
            valid: [ '2011-08-04', new Date(2011, 8, 10) ],
            invalid: [ '2010-07-02', '2011-08-03', new Date(0), 'foo'] });
        test({ validator: 'isAfter',
            valid: [ '2100-08-04', new Date(Date.now() + 86400000) ],
            invalid: [ '2010-07-02', new Date(0) ] });
    });

    it('should validate dates against an end date', function () {
        test({ validator: 'isBefore', args: ['08/04/2011'],
            valid: [ '2010-07-02', '2010-08-04', new Date(0) ],
            invalid: [ '08/04/2011', new Date(2011, 9, 10) ] });
        test({ validator: 'isBefore', args: [ new Date(2011, 7, 4) ],
            valid: [ '2010-07-02', '2010-08-04', new Date(0) ],
            invalid: [ '08/04/2011', new Date(2011, 9, 10) ] });
        test({ validator: 'isBefore',
            valid: [ '2000-08-04', new Date(0), new Date(Date.now() - 86400000) ],
            invalid: [ '2100-07-02', new Date(2017, 10, 10) ] });
    });

    it('should validate that integer strings are divisible by a number', function () {
        test({
            validator: 'isDivisibleBy'
          , args: [ 2 ]
          , valid: [ '2', '4', '100', '1000' ]
          , invalid: [
                '1'
              , '2.5'
              , '101'
              , 'foo'
              , ''
            ]
        });
    });

    it('should validate credit cards', function () {
        test({
            validator: 'isCreditCard'
          , valid: [
                '375556917985515'
              , '36050234196908'
              , '4716461583322103'
              , '4716-2210-5188-5662'
              , '4929 7226 5379 7141'
              , '5398228707871527'
            ]
          , invalid: [
                'foo'
              , 'foo'
              , '5398228707871528'
            ]
        });
    });
    
    it('should validate ISINs', function () {
        test({
            validator: 'isISIN'
          , valid: [
                'AU0000XVGZA3'
              , 'DE000BAY0017'
              , 'BE0003796134'
              , 'SG1G55870362'
              , 'GB0001411924'
              , 'DE000WCH8881'
              , 'PLLWBGD00016'
            ]
          , invalid: [
                'DE000BAY0018'
              , 'PLLWBGD00019'
              , 'foo'
              , '5398228707871528'
            ]
        });
    });

    it('should validate ISBNs', function () {
        test({
            validator: 'isISBN'
          , args: [ 10 ]
          , valid: [
                '3836221195', '3-8362-2119-5', '3 8362 2119 5'
              , '1617290858', '1-61729-085-8', '1 61729 085-8'
              , '0007269706', '0-00-726970-6', '0 00 726970 6'
              , '3423214120', '3-423-21412-0', '3 423 21412 0'
              , '340101319X', '3-401-01319-X', '3 401 01319 X'
            ]
          , invalid: [
                '3423214121', '3-423-21412-1', '3 423 21412 1'
              , '978-3836221191', '9783836221191'
              , '123456789a', 'foo', ''
            ]
        });
        test({
            validator: 'isISBN'
          , args: [ 13 ]
          , valid: [
                '9783836221191', '978-3-8362-2119-1', '978 3 8362 2119 1'
              , '9783401013190', '978-3401013190', '978 3401013190'
              , '9784873113685', '978-4-87311-368-5', '978 4 87311 368 5'
            ]
          , invalid: [
                '9783836221190', '978-3-8362-2119-0', '978 3 8362 2119 0'
              , '3836221195', '3-8362-2119-5', '3 8362 2119 5'
              , '01234567890ab', 'foo', ''
            ]
        });
        test({
            validator: 'isISBN'
          , valid: [
                '340101319X'
              , '9784873113685'
            ]
          , invalid: [
                '3423214121'
              , '9783836221190'
            ]
        });
        test({
            validator: 'isISBN'
          , args: [ 'foo' ]
          , invalid: [
                '340101319X'
              , '9784873113685'
            ]
        });
    });

    it('should validate JSON', function () {
        test({
            validator: 'isJSON'
          , valid: [
                '{ "key": "value" }'
            ]
          , invalid: [
                '{ key: "value" }'
              , { "key": "value" }
              , { key: 'value' }
              , '{ \'key\': \'value\' }'
            ]
        });
    });

    it('should validate multibyte strings', function () {
        test({
            validator: 'isMultibyte'
          , valid: [
                'ひらがな・カタカナ、．漢字'
              , 'あいうえお foobar'
              , 'test＠example.com'
              , '1234abcDEｘｙｚ'
              , 'ｶﾀｶﾅ'
              , '中文'
            ]
          , invalid: [
                'abc'
              , 'abc123'
              , '<>@" *.'
            ]
        });
    });

    it('should validate ascii strings', function () {
        test({
            validator: 'isAscii'
          , valid: [
                'foobar'
              , '0987654321'
              , 'test@example.com'
              , '1234abcDEF'
            ]
          , invalid: [
                'ｆｏｏbar'
              , 'ｘｙｚ０９８'
              , '１２３456'
              , 'ｶﾀｶﾅ'
            ]
        });
    });

    it('should validate full-width strings', function () {
        test({
            validator: 'isFullWidth'
          , valid: [
                'ひらがな・カタカナ、．漢字'
              , '３ー０　ａ＠ｃｏｍ'
              , 'Ｆｶﾀｶﾅﾞﾬ'
              , 'Good＝Parts'
            ]
          , invalid: [
                'abc'
              , 'abc123'
              , '!"#$%&()<>/+=-_? ~^|.,@`{}[]'
            ]
        });
    });

    it('should validate half-width strings', function () {
        test({
            validator: 'isHalfWidth'
          , valid: [
                '!"#$%&()<>/+=-_? ~^|.,@`{}[]'
              , 'l-btn_02--active'
              , 'abc123い'
              , 'ｶﾀｶﾅﾞﾬ￩'
            ]
          , invalid: [
                'あいうえお'
              , '００１１'
            ]
        });
    });

    it('should validate variable-width strings', function () {
        test({
            validator: 'isVariableWidth'
          , valid: [
                'ひらがなカタカナ漢字ABCDE'
              , '３ー０123'
              , 'Ｆｶﾀｶﾅﾞﾬ'
              , 'Good＝Parts'
            ]
          , invalid: [
                'abc'
              , 'abc123'
              , '!"#$%&()<>/+=-_? ~^|.,@`{}[]'
              , 'ひらがな・カタカナ、．漢字'
              , '１２３４５６'
              , 'ｶﾀｶﾅﾞﾬ'
            ]
        });
    });

    it('should validate surrogate pair strings', function () {
        test({
            validator: 'isSurrogatePair'
          , valid: [
                '𠮷野𠮷'
              , '𩸽'
              , 'ABC千𥧄1-2-3'
            ]
          , invalid: [
                '吉野竈'
              , '鮪'
              , 'ABC1-2-3'
            ]
        });
    });

    it('should validate base64 strings', function () {
        test({
            validator: 'isBase64'
          , valid: [
                'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4='
              , 'Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg=='
              , 'U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw=='
              , 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNw'+
                'UAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0Ye'+
                'rhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619'+
                'FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5Tkukhx'+
                'QmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZ'+
                'Fwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZ'+
                'HQIDAQAB'
            ]
          , invalid: [
                '12345'
              , ''
              , 'Vml2YW11cyBmZXJtZtesting123'
            ]
        });
        for (var i = 0, str = '', encoded; i < 1000; i++) {
            str += String.fromCharCode(Math.random() * 26 | 97);
            encoded = new Buffer(str).toString('base64');
            if (!validator.isBase64(encoded)) {
                var msg = format('validator.isBase64() failed with "%s"', encoded);
                throw new Error(msg);
            }
        }
    });

    it('should validate hex-encoded MongoDB ObjectId', function () {
        test({
            validator: 'isMongoId'
          , valid: [
                '507f1f77bcf86cd799439011'
            ]
          , invalid: [
                '507f1f77bcf86cd7994390'
              , '507f1f77bcf86cd79943901z'
              , ''
              , '507f1f77bcf86cd799439011 '
            ]
        });
    });

    it('should define the module using an AMD-compatible loader', function () {
        var window = {
            validator: null
          , define: function (module) {
                this.validator = module;
            }
        };
        window.define.amd = true;
        var sandbox = contextify(window);
        sandbox.run(validator_js);
        sandbox.dispose();
        assert.equal(window.validator.trim('  foobar '), 'foobar');
    });

    it('should bind validator to the window if no module loaders are available', function () {
        var window = {};
        var sandbox = contextify(window);
        sandbox.run(validator_js);
        sandbox.dispose();
        assert.equal(window.validator.trim('  foobar '), 'foobar');
    });

    it('should validate mobile phone number', function () {
      test({
        validator: 'isMobilePhone'
        , valid: [
            '15323456787'
          , '13523333233'
          , '13898728332'
          , '+086-13238234822'
          , '08613487234567'
          , '8617823492338'
          , '86-17823492338'
        ]
        , invalid: [
            '12345'
          , ''
          , 'Vml2YW11cyBmZXJtZtesting123'
          , '010-38238383'
        ],
        args: ['zh-CN']
      });

      test({
        validator: 'isMobilePhone'
        , invalid: [
            '15323456787'
          , '13523333233'
          , '13898728332'
          , '+086-13238234822'
          , '08613487234567'
          , '8617823492338'
          , '86-17823492338'
        ],
        args: ['en']
      });

      test({
        validator: 'isMobilePhone'
        , valid: [
            '0821231234'
          , '+27821231234'
          , '27821231234'
        ]
        , invalid: [
            '082123'
          , '08212312345'
          , '21821231234'
          , '+21821231234'
          , '+0821231234'
        ],
        args: ['en-ZA']
      });

      test({
        validator: 'isMobilePhone'
        , valid: [
            '61404111222'
          , '+61411222333'
          , '0417123456'
        ]
        , invalid: [
            '082123'
          , '08212312345'
          , '21821231234'
          , '+21821231234'
          , '+0821231234'
          , '04123456789'
        ],
        args: ['en-AU']
      });

      test({
        validator: 'isMobilePhone'
        , valid: [
            '91234567'
          , '9123-4567'
          , '61234567'
          , '51234567'
          , '+85291234567'
          , '+852-91234567'
          , '+852-9123-4567'
          , '852-91234567'
        ]
        , invalid: [
            '999'
          , '+852-912345678'
          , '123456789'
          , '+852-1234-56789'
        ],
        args: ['en-HK']
      });

      test({
        validator: 'isMobilePhone'
        , valid: [
            '0612457898'
          , '+33612457898'
          , '33612457898'
          , '0712457898'
          , '+33712457898'
          , '33712457898'
        ]
        , invalid: [
            '061245789'
          , '06124578980'
          , '0112457898'
          , '0212457898'
          , '0312457898'
          , '0412457898'
          , '0512457898'
          , '0812457898'
          , '0912457898'
          , '+34612457898'
          , '+336124578980'
          , '+3361245789'
        ]
        , args: ['fr-FR']
      });

      test({
        validator: 'isMobilePhone'
        , valid: [
            '2102323234'
          , '+302646041461'
          , '+306944848966'
          , '6944848966'
        ]
        , invalid: [
            '120000000'
          , '20000000000'
          , '68129485729'
          , '6589394827'
          , '298RI89572'
        ]
        , args: ['el-GR']
        });
    });

    it('should validate currency', function() {
      test({
          validator: 'isCurrency'
        , args: [
            {}
            , '-$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)'
        ]
        , valid: [
            '-$10,123.45'
          , '$10,123.45'
          , '$10123.45'
          , '10,123.45'
          , '10123.45'
          , '10,123'
          , '1,123,456'
          , '1123456'
          , '1.39'
          , '.03'
          , '0.10'
          , '$0.10'
          , '-$0.01'
          , '-$.99'
          , '$100,234,567.89'
          , '$10,123'
          , '10,123'
          , '-10123'
        ]
        , invalid: [
            '1.234'
          , '$1.1'
          , '$ 32.50'
          , '500$'
          , '.0001'
          , '$.001'
          , '$0.001'
          , '12,34.56'
          , '123456,123,123456'
          , '123,4'
          , ',123'
          , '$-,123'
          , '$'
          , '.'
          , ','
          , '00'
          , '$-'
          , '$-,.'
          , '-'
          , '-$'
          , ''
          , '- $'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                require_symbol: true
            }
          , '-$##,###.## with $ required (en-US, en-CA, en-AU, en-NZ, en-HK)'
        ]
        , valid: [
            '-$10,123.45'
          , '$10,123.45'
          , '$10123.45'
          , '$10,123.45'
          , '$10,123'
          , '$1,123,456'
          , '$1123456'
          , '$1.39'
          , '$.03'
          , '$0.10'
          , '$0.10'
          , '-$0.01'
          , '-$.99'
          , '$100,234,567.89'
          , '$10,123'
          , '-$10123'
        ]
        , invalid: [
            '1.234'
          , '$1.234'
          , '1.1'
          , '$1.1'
          , '$ 32.50'
          , ' 32.50'
          , '500'
          , '10,123,456'
          , '.0001'
          , '$.001'
          , '$0.001'
          , '1,234.56'
          , '123456,123,123456'
          , '$123456,123,123456'
          , '123.4'
          , '$123.4'
          , ',123'
          , '$,123'
          , '$-,123'
          , '$'
          , '.'
          , '$.'
          , ','
          , '$,'
          , '00'
          , '$00'
          , '$-'
          , '$-,.'
          , '-'
          , '-$'
          , ''
          , '$ '
          , '- $'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol:'¥'
              , negative_sign_before_digits:true
            }
          , '¥-##,###.## (zh-CN)'
        ]
        , valid: [
            '123,456.78'
          , '-123,456.78'
          , '¥6,954,231'
          , '¥-6,954,231'
          , '¥10.03'
          , '¥-10.03'
          , '10.03'
          , '1.39'
          , '.03'
          , '0.10'
          , '¥-10567.01'
          , '¥0.01'
          , '¥1,234,567.89'
          , '¥10,123'
          , '¥-10,123'
          , '¥-10,123.45'
          , '10,123'
          , '10123'
          , '¥-100'
        ]
        , invalid: [
            '1.234'
          , '¥1.1'
          , '5,00'
          , '.0001'
          , '¥.001'
          , '¥0.001'
          , '12,34.56'
          , '123456,123,123456'
          , '123 456'
          , ',123'
          , '¥-,123'
          , ''
          , ' '
          , '¥'
          , '¥-'
          , '¥-,.'
          , '-'
          , '- ¥'
          , '-¥'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol:'¥'
              , allow_negatives: false
            }
            , '¥##,###.## with no negatives (zh-CN)'
        ]
        , valid: [
            '123,456.78'
          , '¥6,954,231'
          , '¥10.03'
          , '10.03'
          , '1.39'
          , '.03'
          , '0.10'
          , '¥0.01'
          , '¥1,234,567.89'
          , '¥10,123'
          , '10,123'
          , '10123'
          , '¥100'
        ]
        , invalid: [
            '1.234'
          , '-123,456.78'
          , '¥-6,954,231'
          , '¥-10.03'
          , '¥-10567.01'
          , '¥1.1'
          , '¥-10,123'
          , '¥-10,123.45'
          , '5,00'
          , '¥-100'
          , '.0001'
          , '¥.001'
          , '¥-.001'
          , '¥0.001'
          , '12,34.56'
          , '123456,123,123456'
          , '123 456'
          , ',123'
          , '¥-,123'
          , ''
          , ' '
          , '¥'
          , '¥-'
          , '¥-,.'
          , '-'
          , '- ¥'
          , '-¥'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol: 'R'
              , negative_sign_before_digits: true
              , thousands_separator: ' '
              , decimal_separator: ','
              , allow_negative_sign_placeholder: true
            }
          , 'R ## ###,## and R-10 123,25 (el-ZA)'
        ]
        , valid: [
            '123 456,78'
          , '-10 123'
          , 'R-10 123'
          , 'R 6 954 231'
          , 'R10,03'
          , '10,03'
          , '1,39'
          , ',03'
          , '0,10'
          , 'R10567,01'
          , 'R0,01'
          , 'R1 234 567,89'
          , 'R10 123'
          , 'R 10 123'
          , 'R 10123'
          , 'R-10123'
          , '10 123'
          , '10123'
        ]
        , invalid: [
            '1,234'
          , 'R -10123'
          , 'R- 10123'
          , 'R,1'
          , ',0001'
          , 'R,001'
          , 'R0,001'
          , '12 34,56'
          , '123456 123 123456'
          , ' 123'
          , '- 123'
          , '123 '
          , ''
          , ' '
          , 'R'
          , 'R- .1'
          , 'R-'
          , '-'
          , '-R 10123'
          , 'R00'
          , 'R -'
          , '-R'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol: '€'
              , thousands_separator: '.'
              , decimal_separator: ','
              , allow_space_after_symbol: true
            }
          , '-€ ##.###,## (it-IT)'
        ]
        , valid: [
            '123.456,78'
          , '-123.456,78'
          , '€6.954.231'
          , '-€6.954.231'
          , '€ 896.954.231'
          , '-€ 896.954.231'
          , '16.954.231'
          , '-16.954.231'
          , '€10,03'
          , '-€10,03'
          , '10,03'
          , '-10,03'
          , '-1,39'
          , ',03'
          , '0,10'
          , '-€10567,01'
          , '-€ 10567,01'
          , '€ 0,01'
          , '€1.234.567,89'
          , '€10.123'
          , '10.123'
          , '-€10.123'
          , '€ 10.123'
          , '€10.123'
          , '€ 10123'
          , '10.123'
          , '-10123'
        ]
        , invalid: [
            '1,234'
          , '€ 1,1'
          , '50#,50'
          , '123,@€ '
          , '€€500'
          , ',0001'
          , '€ ,001'
          , '€0,001'
          , '12.34,56'
          , '123456.123.123456'
          , '€123€'
          , ''
          , ' '
          , '€'
          , ' €'
          , '€ '
          , '€€'
          , ' 123'
          , '- 123'
          , '.123'
          , '-€.123'
          , '123 '
          , '€-'
          , '- €'
          , '€ - '
          , '-'
          , '- '
          , '-€'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol: '€'
              , thousands_separator: '.'
              , symbol_after_digits: true
              , decimal_separator: ','
              , allow_space_after_digits: true
            }
          , '-##.###,## € (el-GR)'
        ]
        , valid: [
            '123.456,78'
          , '-123.456,78'
          , '6.954.231 €'
          , '-6.954.231 €'
          , '896.954.231'
          , '-896.954.231'
          , '16.954.231'
          , '-16.954.231'
          , '10,03€'
          , '-10,03€'
          , '10,03'
          , '-10,03'
          , '1,39'
          , ',03'
          , '-,03'
          , '-,03 €'
          , '-,03€'
          , '0,10'
          , '10567,01€'
          , '0,01 €'
          , '1.234.567,89€'
          , '10.123€'
          , '10.123'
          , '10.123€'
          , '10.123 €'
          , '10123 €'
          , '10.123'
          , '10123'
        ]
        , invalid: [
            '1,234'
          , '1,1 €'
          , ',0001'
          , ',001 €'
          , '0,001€'
          , '12.34,56'
          , '123456.123.123456'
          , '€123€'
          , ''
          , ' '
          , '€'
          , ' €'
          , '€ '
          , ' 123'
          , '- 123'
          , '.123'
          , '-.123€'
          , '-.123 €'
          , '123 '
          , '-€'
          , '- €'
          , '-'
          , '- '
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol: 'kr.'
              , negative_sign_before_digits: true
              , thousands_separator: '.'
              , decimal_separator: ','
              , allow_space_after_symbol: true
            }
          , 'kr. -##.###,## (da-DK)'
        ]
        , valid: [
            '123.456,78'
          , '-10.123'
          , 'kr. -10.123'
          , 'kr.-10.123'
          , 'kr. 6.954.231'
          , 'kr.10,03'
          , 'kr. -10,03'
          , '10,03'
          , '1,39'
          , ',03'
          , '0,10'
          , 'kr. 10567,01'
          , 'kr. 0,01'
          , 'kr. 1.234.567,89'
          , 'kr. -1.234.567,89'
          , '10.123'
          , 'kr. 10.123'
          , 'kr.10.123'
          , '10123'
          , '10.123'
          , 'kr.-10123'
        ]
        , invalid: [
            '1,234'
          , 'kr.  -10123'
          , 'kr.,1'
          , ',0001'
          , 'kr. ,001'
          , 'kr.0,001'
          , '12.34,56'
          , '123456.123.123456'
          , '.123'
          , 'kr.-.123'
          , 'kr. -.123'
          , '- 123'
          , '123 '
          , ''
          , ' '
          , 'kr.'
          , ' kr.'
          , 'kr. '
          , 'kr.-'
          , 'kr. -'
          , 'kr. - '
          , ' - '
          , '-'
          , '- kr.'
          , '-kr.'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                symbol: 'kr.'
              , allow_negatives: false
              , negative_sign_before_digits: true
              , thousands_separator: '.'
              , decimal_separator: ','
              , allow_space_after_symbol: true
            }
          , 'kr. ##.###,## with no negatives (da-DK)'
        ]
        , valid: [
            '123.456,78'
          , '10.123'
          , 'kr. 10.123'
          , 'kr.10.123'
          , 'kr. 6.954.231'
          , 'kr.10,03'
          , 'kr. 10,03'
          , '10,03'
          , '1,39'
          , ',03'
          , '0,10'
          , 'kr. 10567,01'
          , 'kr. 0,01'
          , 'kr. 1.234.567,89'
          , 'kr.1.234.567,89'
          , '10.123'
          , 'kr. 10.123'
          , 'kr.10.123'
          , '10123'
          , '10.123'
          , 'kr.10123'
        ]
        , invalid: [
            '1,234'
          , '-10.123'
          , 'kr. -10.123'
          , 'kr. -1.234.567,89'
          , 'kr.-10123'
          , 'kr.  -10123'
          , 'kr.-10.123'
          , 'kr. -10,03'
          , 'kr.,1'
          , ',0001'
          , 'kr. ,001'
          , 'kr.0,001'
          , '12.34,56'
          , '123456.123.123456'
          , '.123'
          , 'kr.-.123'
          , 'kr. -.123'
          , '- 123'
          , '123 '
          , ''
          , ' '
          , 'kr.'
          , ' kr.'
          , 'kr. '
          , 'kr.-'
          , 'kr. -'
          , 'kr. - '
          , ' - '
          , '-'
          , '- kr.'
          , '-kr.'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {
                parens_for_negatives: true
            }
          , '($##,###.##) (en-US, en-HK)'
        ]
        , valid: [
            '1,234'
          , '(1,234)'
          , '($6,954,231)'
          , '$10.03'
          , '(10.03)'
          , '($10.03)'
          , '1.39'
          , '.03'
          , '(.03)'
          , '($.03)'
          , '0.10'
          , '$10567.01'
          , '($0.01)'
          , '$1,234,567.89'
          , '$10,123'
          , '(10,123)'
          , '10123'
        ]
        , invalid: [
            '1.234'
          , '($1.1)'
          , '-$1.10'
          , '$ 32.50'
          , '500$'
          , '.0001'
          , '$.001'
          , '($0.001)'
          , '12,34.56'
          , '123456,123,123456'
          , '( 123)'
          , ',123'
          , '$-,123'
          , ''
          , ' '
          , '  '
          , '   '
          , '$'
          , '$ '
          , ' $'
          , ' 123'
          , '(123) '
          , '.'
          , ','
          , '00'
          , '$-'
          , '$ - '
          , '$- '
          , ' - '
          , '-'
          , '- $'
          , '-$'
          , '()'
          , '( )'
          , '(  -)'
          , '(  - )'
          , '(  -  )'
          , '(-)'
          , '(-$)'
        ]
      });

      test({
          validator: 'isCurrency'
        , args: [
            {allow_negatives: false}
          , '$##,###.## with no negatives (en-US, en-CA, en-AU, en-HK)'
        ]
        , valid: [
            '$10,123.45'
          , '$10123.45'
          , '10,123.45'
          , '10123.45'
          , '10,123'
          , '1,123,456'
          , '1123456'
          , '1.39'
          , '.03'
          , '0.10'
          , '$0.10'
          , '$100,234,567.89'
          , '$10,123'
          , '10,123'
        ]
        , invalid: [
            '1.234'
          , '-1.234'
          , '-10123'
          , '-$0.01'
          , '-$.99'
          , '$1.1'
          , '-$1.1'
          , '$ 32.50'
          , '500$'
          , '.0001'
          , '$.001'
          , '$0.001'
          , '12,34.56'
          , '123456,123,123456'
          , '-123456,123,123456'
          , '123,4'
          , ',123'
          , '$-,123'
          , '$'
          , '.'
          , ','
          , '00'
          , '$-'
          , '$-,.'
          , '-'
          , '-$'
          , ''
          , '- $'
          , '-$10,123.45'
        ]
      });
    });
});

