var assert = require('assert')
  , format = require('util').format
  , Validator = require('../').Validator
  , ValidatorError = require('../').ValidatorError;

var validator = new Validator()
  , check = validator.check.bind(validator);

function test(options) {
    if (options.valid) {
        options.valid.forEach(function (valid) {
            try {
                check(valid)[options.validator].apply(validator, options.args || []);
            } catch (err) {
                var warning = format('%s(%s%s) failed but should have passed', options.validator,
                    valid, options.args ? ', ' + options.args.join(', ') : '');
                throw new Error(warning);
            }
        });
    }
    if (options.invalid) {
        options.invalid.forEach(function (invalid) {
            try {
                check(invalid)[options.validator].apply(validator, options.args || []);
            } catch (err) {
                return;
            }
            var warning = format('%s(%s%s) passed but should have failed', options.validator,
                invalid, options.args ? ', ' + options.args.join(', ') : '');
            throw new Error(warning);
        });
    }
}

describe('Validators', function () {

    it('should throw errors that are instances of ValidatorError', function () {
        try {
            check('foo', 'Not a valid email').isEmail();
            assert(false, 'Expected an error');
        } catch (err) {
            assert(err instanceof ValidatorError);
            assert(err instanceof Error);
            assert.equal(err.name, 'ValidatorError');
            assert.equal(err.message, 'Not a valid email');
        }
    });

    it('should validate email addresses', function () {
        test({
            validator: 'isEmail'
          , valid: [
                'foo@bar.com'
              , 'x@x.x'
              , 'foo@bar.com.au'
              , 'foo+bar@bar.com'
            ]
          , invalid: [
                'invalidemail@'
              , 'invalid.com'
              , '@invalid.com'
            ]
        });
    });

    it('should validate URLs', function () {
        test({
            validator: 'isUrl'
          , valid: [
                'foobar.com'
              , 'www.foobar.com'
              , 'foobar.com/'
              , 'valid.au'
              , 'http://www.foobar.com/'
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
            ]
          , invalid: [
                'abc'
              , '256.0.0.0'
              , '0.0.0.256'
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
              , 'très über'
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
              , ' '
              , 'foo'
            ]
        });
    });

    it('should invalidate null strings', function () {
        test({
            validator: 'notNull'
          , valid: [
                '123'
              , '  '
              , 'foo'
            ]
          , invalid: [
                ''
              , NaN
              , []
              , undefined
              , null
            ]
        });
    });

    it('should invalidate strings that are null or whitespace', function () {
        test({
            validator: 'notEmpty'
          , valid: [
                'foo'
              , '  bar'
            ]
          , invalid: [
                ''
              , '  \r\n     '
              , NaN
              , []
              , undefined
              , null
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

    it('should invalidate strings that contain another string', function () {
        test({ validator: 'notContains', args: ['foo'], valid: ['bar', 'fobar'],
            invalid: ['foo', 'foobar', 'bazfoo'] });
    });

    it('should validate strings against a regex', function () {
        test({ validator: 'regex', args: [/abc/], valid: ['abc', 'abcdef', '123abc'],
            invalid: ['acb', 'Abc'] });
        test({ validator: 'regex', args: ['abc'], valid: ['abc', 'abcdef', '123abc'],
            invalid: ['acb', 'Abc'] });
        test({ validator: 'regex', args: ['abc', 'i'], valid: ['abc', 'abcdef', '123abc', 'AbC'],
            invalid: ['acb'] });
    });

    it('should invalidate strings against a regex', function () {
        test({ validator: 'notRegex', args: [/abc/], valid: ['acb', 'Abc'],
            invalid: ['abc', 'abcdef', '123abc'] });
        test({ validator: 'notRegex', args: ['abc'], valid: ['acb', 'Abc'],
            invalid: ['abc', 'abcdef', '123abc'] });
        test({ validator: 'notRegex', args: ['abc', 'i'], valid: ['acb'],
            invalid: ['abc', 'abcdef', '123abc', 'AbC'] });
    });

    it('should validate strings by length', function () {
        test({ validator: 'len', args: [2], valid: ['abc', 'de', 'abcd'], invalid: [ '', 'a' ] });
        test({ validator: 'len', args: [2, 3], valid: ['abc', 'de'], invalid: [ '', 'a', 'abcd' ] });
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
            validator: 'isUUIDv3'
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
            validator: 'isUUIDv4'
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
            validator: 'isUUIDv5'
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

    it('should invalidate a string that is in another string or array', function () {
        test({ validator: 'notIn', args: ['foobar'], valid: ['foobarbaz', 'barfoo'],
            invalid: ['foo', 'bar', 'foobar', ''] });
        test({ validator: 'notIn', args: [['foo', 'bar']], valid: ['foobar', 'barfoo', ''],
            invalid: ['foo', 'bar'] });
        test({ validator: 'notIn', args: [[1, 2, 3]], valid: ['4', ''],
            invalid: ['1', '2', '3'] });
        test({ validator: 'notIn', invalid: ['foo', ''] });
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

    it('should validate numbers against a min or max', function () {
        test({ validator: 'min', args: [ 2 ], valid: [ '4', '2', '2.1', '100' ],
            invalid: [ '0', '-1' ] });
        test({ validator: 'max', args: [ 2 ], valid: [ '1', '2', '-2.1', '0' ],
            invalid: [ '10', '2.1' ] });
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
            invalid: [ '2011-08-04', new Date(2011, 9, 10) ] });
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

    it('should allow for false as a sentinel error message', function () {
        var validator = new Validator()
          , error;
        validator.error = function (msg) {
            error = msg;
        };
        validator.check('not_an_email', false).isEmail();
        assert.strictEqual(error, false);
    });

    it('should allow for an error message per validator', function () {
        var validator = new Validator()
          , errors = [];
        validator.error = function (err) {
            errors.push(err);
            return this;
        };
        validator.check('foo', {
            isNumeric: 'the string is not numeric'
          , contains: 'the string does not contain bar'
        }).isNumeric().contains('bar');
        assert.deepEqual(errors, [
            'the string is not numeric'
          , 'the string does not contain bar'
        ]);
    });

    it('should allow for an error message per validator but use defaults if necessary', function () {
        var validator = new Validator()
          , errors = [];
        validator.error = function (err) {
            errors.push(err);
            return this;
        };
        validator.check('foo', {
            isNumeric: 'the string is not numeric'
        }).isNumeric().contains('bar');
        assert.deepEqual(errors, [
            'the string is not numeric'
          , 'Invalid characters'
        ]);
    });

    it('should let users reference validator arguments in the messages', function () {
        var message;
        try {
            check('foo', 'the string "%0" does not contain "%1"').contains('bar');
        } catch (err) {
            message = err.message;
        }
        assert.equal(message, 'the string "foo" does not contain "bar"');
    });

    it('should let users specify a custom message builder', function () {
        var validator = new Validator({
            messageBuilder: function (msg, args) {
                return format('%s (%s)', msg, args.join(', '));
            }
        });
        var message;
        try {
            validator.check('foo', 'Validator failed').contains('bar');
        } catch (err) {
            message = err.message;
        }
        assert.equal(message, 'Validator failed (foo, bar)');
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

});
