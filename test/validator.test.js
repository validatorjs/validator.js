var node_validator = require('../lib'),
    util = require('util')
    Validator = new node_validator.Validator(),
    ValidatorError = node_validator.ValidatorError,
    assert = require('assert');

function dateFixture() {
    return {
        tomorrow: new Date(Date.now() + 86400000)
      , yesterday: new Date(Date.now() - 86400000)
    };
}

var FakeError = function(msg) {
    Error.captureStackTrace(this, this);
    this.name = 'FakeError';
    this.message = msg;
};
util.inherits(FakeError, Error);


module.exports = {
    'test #isEmail()': function () {
        //Try some invalid emails
        var invalid = [
            'invalidemail@',
            'invalid.com',
            '@invalid.com'
        ];
        invalid.forEach(function(email) {
            try {
                Validator.check(email, 'Invalid').isEmail();
                assert.ok(false, 'Invalid email ('+email+') passed validation');
            } catch(e) {
                assert.equal('Invalid', e.message);
            }
        });

        //Now try some valid ones
        var valid = [
            'foo@bar.com',
            'x@x.x',
            'foo@bar.com.au',
            'foo+bar@bar.com'
        ];
        try {
            valid.forEach(function(email) {
                Validator.check(email).isEmail();
            });
        } catch(e) {
            assert.ok(false, 'A valid email did not pass validation');
        }
    },

    'test #isUrl()': function () {
        //Try some invalid URLs
        var invalid = [
            'xyz://foobar.com', //Only http, https and ftp are valid
            'invalid/',
            'invalid.x',
            'invalid.',
            '.com',
            'http://com/',
            'http://300.0.0.1/',
            'mailto:foo@bar.com'
        ];
        invalid.forEach(function(url) {
            try {
                Validator.check(url, 'Invalid').isUrl();
                assert.ok(false, 'Invalid url ('+url+') passed validation');
            } catch(e) {
                assert.equal('Invalid', e.message);
            }
        });

        //Now try some valid ones
        var valid = [
            'foobar.com',
            'www.foobar.com',
            'foobar.com/',
            'valid.au',
            'http://www.foobar.com/',
            'https://www.foobar.com/',
            'ftp://www.foobar.com/',
            'http://www.foobar.com/~foobar',
            'http://user:pass@www.foobar.com/',
            'http://127.0.0.1/',
            'http://10.0.0.0/',
            'http://189.123.14.13/',
            'http://duckduckgo.com/?q=%2F',
            'http://foobar.com/t$-_.+!*\'(),',
            'http://localhost:3000/'
        ];
        try {
            valid.forEach(function(url) {
                Validator.check(url).isUrl();
            });
        } catch(e) {
            assert.ok(false, 'A valid url did not pass validation');
        }
    },

    'test #isIP()': function () {
        //Try some invalid IPs
        var invalid = [
            'abc',
            '256.0.0.0',
            '0.0.0.256'
        ];
        invalid.forEach(function(ip) {
            try {
                Validator.check(ip, 'Invalid').isIP();
                assert.ok(false, 'Invalid IP ('+ip+') passed validation');
            } catch(e) {
                assert.equal('Invalid', e.message);
            }
        });

        //Now try some valid ones
        var valid = [
            '127.0.0.1',
            '0.0.0.0',
            '255.255.255.255',
            '1.2.3.4'
        ];
        try {
            valid.forEach(function(ip) {
                Validator.check(ip).isIP();
            });
        } catch(e) {
            assert.ok(false, 'A valid IP did not pass validation');
        }
    },

    'test #isAlpha()': function () {
        assert.ok(Validator.check('abc').isAlpha());
        assert.ok(Validator.check('ABC').isAlpha());
        assert.ok(Validator.check('FoObAr').isAlpha());

        ['123',123,'abc123','  ',''].forEach(function(str) {
            try {
                Validator.check(str).isAlpha();
                assert.ok(false, 'isAlpha failed');
            } catch (e) {}
        });
    },

    'test #isAlphanumeric()': function () {
        assert.ok(Validator.check('abc13').isAlphanumeric());
        assert.ok(Validator.check('123').isAlphanumeric());
        assert.ok(Validator.check('F1oO3bAr').isAlphanumeric());

        ['(*&ASD','  ','.',''].forEach(function(str) {
            try {
                Validator.check(str).isAlphanumeric();
                assert.ok(false, 'isAlphanumeric failed');
            } catch (e) {}
        });
    },

    'test #isNumeric()': function () {
        assert.ok(Validator.check('123').isNumeric());
        assert.ok(Validator.check('00123').isNumeric());
        assert.ok(Validator.check('-00123').isNumeric());
        assert.ok(Validator.check('0').isNumeric());
        assert.ok(Validator.check('-0').isNumeric());

        ['123.123','  ','.',''].forEach(function(str) {
            try {
                Validator.check(str).isNumeric();
                assert.ok(false, 'isNumeric failed');
            } catch (e) {}
        });
    },

    'test #isLowercase()': function () {
        assert.ok(Validator.check('abc').isLowercase());
        assert.ok(Validator.check('foobar').isLowercase());
        assert.ok(Validator.check('a').isLowercase());
        assert.ok(Validator.check('123').isLowercase());
        assert.ok(Validator.check('abc123').isLowercase());
        assert.ok(Validator.check('this is lowercase.').isLowercase());
        assert.ok(Validator.check('très über').isLowercase());

        ['123A','ABC','.',''].forEach(function(str) {
            try {
                Validator.check(str).isLowercase();
                assert.ok(false, 'isLowercase failed');
            } catch (e) {}
        });
    },

    'test #isUppercase()': function () {
        assert.ok(Validator.check('FOOBAR').isUppercase());
        assert.ok(Validator.check('A').isUppercase());
        assert.ok(Validator.check('123').isUppercase());
        assert.ok(Validator.check('ABC123').isUppercase());

        ['abc','123aBC','.',''].forEach(function(str) {
            try {
                Validator.check(str).isUppercase();
                assert.ok(false, 'isUpper failed');
            } catch (e) {}
        });
    },

    'test #isInt()': function () {
        assert.ok(Validator.check('13').isInt());
        assert.ok(Validator.check('123').isInt());
        assert.ok(Validator.check('0').isInt());
        assert.ok(Validator.check(0).isInt());
        assert.ok(Validator.check(123).isInt());
        assert.ok(Validator.check('-0').isInt());

        ['01', '-01', '000', '100e10', '123.123', '  ', ''].forEach(function(str) {
            try {
                Validator.check(str).isInt();
                assert.ok(false, 'falsepositive');
            } catch (e) {
              if (e.message == 'falsepositive') {
                e.message = 'isInt had a false positive: ' + str;
                throw e;
              }
            }
        });
    },

    'test #isDecimal()': function () {
        assert.ok(Validator.check('123').isDecimal());
        assert.ok(Validator.check('123.').isDecimal());
        assert.ok(Validator.check('123.123').isDecimal());
        assert.ok(Validator.check('-123.123').isDecimal());
        assert.ok(Validator.check('0.123').isDecimal());
        assert.ok(Validator.check('.123').isDecimal());
        assert.ok(Validator.check('.0').isDecimal());
        assert.ok(Validator.check('0').isDecimal());
        assert.ok(Validator.check('-0').isDecimal());
        assert.ok(Validator.check('01.123').isDecimal());

        assert.ok(Validator.check('2.2250738585072011e-308').isDecimal());
        assert.ok(Validator.check('-0.22250738585072011e-307').isDecimal());
        assert.ok(Validator.check('-0.22250738585072011E-307').isDecimal());

        ['-.123','  ',''].forEach(function(str) {
            try {
                Validator.check(str).isDecimal();
                assert.ok(false, 'falsepositive');
            } catch (e) {
              if (e.message == 'falsepositive') {
                e.message = 'isDecimal had a false positive: ' + str;
                throw e;
              }
            }
        });
    },

    //Alias for isDecimal()
    'test #isFloat()': function () {
        assert.ok(Validator.check('0.5').isFloat());
    },

    'test #isNull()': function () {
        assert.ok(Validator.check('').isNull());
        assert.ok(Validator.check().isNull());

        ['  ','123','abc'].forEach(function(str) {
            try {
                Validator.check(str).isNull();
                assert.ok(false, 'isNull failed');
            } catch (e) {}
        });
    },

    'test #notNull()': function () {
        assert.ok(Validator.check('abc').notNull());
        assert.ok(Validator.check('123').notNull());
        assert.ok(Validator.check('   ').notNull());

        [false,''].forEach(function(str) {
            try {
                Validator.check(str).notNull();
                assert.ok(false, 'notNull failed');
            } catch (e) {}
        });
    },

    'test #notEmpty()': function () {
        assert.ok(Validator.check('abc').notEmpty());
        assert.ok(Validator.check('123').notEmpty());
        assert.ok(Validator.check('   123   ').notEmpty());
        assert.ok(Validator.check([1,2]).notEmpty());

        [false,'  ','\r\n','  ','', NaN, []].forEach(function(str) {
            try {
                Validator.check(str).notEmpty();
                assert.ok(false, 'notEmpty failed');
            } catch (e) {}
        });
    },

    'test #equals()': function () {
        assert.ok(Validator.check('abc').equals('abc'));
        assert.ok(Validator.check('123').equals(123));
        assert.ok(Validator.check('   ').equals('   '));
        assert.ok(Validator.check().equals(''));

        try {
            Validator.check(123).equals('abc');
            assert.ok(false, 'equals failed');
        } catch (e) {}

        try {
            Validator.check('').equals('   ');
            assert.ok(false, 'equals failed');
        } catch (e) {}
    },

    'test #contains()': function () {
        assert.ok(Validator.check('abc').contains('abc'));
        assert.ok(Validator.check('foobar').contains('oo'));
        assert.ok(Validator.check('abc').contains('a'));
        assert.ok(Validator.check('  ').contains(' '));

        try {
            Validator.check('abc').contains('');
            assert.ok(false, 'contains failed');
        } catch (e) {}

        try {
            Validator.check(123).contains('abc');
            assert.ok(false, 'contains failed');
        } catch (e) {}

        try {
            Validator.check('\t').contains('\t\t');
            assert.ok(false, 'contains failed');
        } catch (e) {}
    },

    'test #notContains()': function () {
        assert.ok(Validator.check('abc').notContains('a '));
        assert.ok(Validator.check('foobar').notContains('foobars'));
        assert.ok(Validator.check('abc').notContains('123'));

        try {
            Validator.check(123).notContains(1);
            assert.ok(false, 'notContains failed');
        } catch (e) {}

        try {
            Validator.check(' ').contains('');
            assert.ok(false, 'notContains failed');
        } catch (e) {}
    },

    'test #regex()': function () {
        assert.ok(Validator.check('abc').regex(/a/));
        assert.ok(Validator.check('abc').regex(/^abc$/));
        assert.ok(Validator.check('abc').regex('abc'));
        assert.ok(Validator.check('ABC').regex(/^abc$/i));
        assert.ok(Validator.check('ABC').regex('abc', 'i'));
        assert.ok(Validator.check(12390947686129).regex(/^[0-9]+$/));

        //Check the is() alias
        assert.ok(Validator.check(12390947686129).is(/^[0-9]+$/));

        try {
            Validator.check(123).regex(/^1234$/);
            assert.ok(false, 'regex failed');
        } catch (e) {}
    },

    'test #notRegex()': function () {
        assert.ok(Validator.check('foobar').notRegex(/e/));
        assert.ok(Validator.check('ABC').notRegex('abc'));
        assert.ok(Validator.check(12390947686129).notRegex(/a/));

        //Check the not() alias
        assert.ok(Validator.check(12390947686129).not(/^[a-z]+$/));

        try {
            Validator.check(123).notRegex(/123/);
            assert.ok(false, 'regex failed');
        } catch (e) {}
    },

    'test #len()': function () {
        assert.ok(Validator.check('a').len(1));
        assert.ok(Validator.check(123).len(2));
        assert.ok(Validator.check(123).len(2, 4));
        assert.ok(Validator.check(12).len(2,2));

        try {
            Validator.check('abc').len(4);
            assert.ok(false, 'len failed');
        } catch (e) {}
        try {
            Validator.check('abcd').len(1, 3);
            assert.ok(false, 'len failed');
        } catch (e) {}
    },

    'test #isUUID()': function () {
        ////xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

        assert.ok(Validator.check('A987FBC9-4BED-3078-CF07-9141BA07C9F3').isUUID());
        assert.ok(Validator.check('A987FBC9-4BED-3078-CF07-9141BA07C9F3').isUUID(1));
        assert.ok(Validator.check('A987FBC9-4BED-3078-CF07-9141BA07C9F3').isUUID(2));
        assert.ok(Validator.check('A987FBC9-4BED-3078-CF07-9141BA07C9F3').isUUID(3));
        assert.ok(Validator.check('A987FBC9-4BED-4078-8F07-9141BA07C9F3').isUUID(4));
        assert.ok(Validator.check('A987FBC9-4BED-5078-AF07-9141BA07C9F3').isUUID(5));

        var badUuids = [
            "",
            null,
            "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
            "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx",
            "A987FBC94BED3078CF079141BA07C9F3",
            "934859",
            "987FBC9-4BED-3078-CF07A-9141BA07C9F3",
            "AAAAAAAA-1111-1111-AAAG-111111111111"
        ]

        badUuids.forEach(function (item) {
            assert.throws(function() { Validator.check(item).isUUID() },  /not a uuid/i);
            assert.throws(function() { Validator.check(item).isUUID(1) }, /not a uuid/i);
            assert.throws(function() { Validator.check(item).isUUID(2) }, /not a uuid/i);
            assert.throws(function() { Validator.check(item).isUUID(3) }, /not a uuid/i);
            assert.throws(function() { Validator.check(item).isUUID(4) }, /not a uuid/i);
            assert.throws(function() { Validator.check(item).isUUID(5) }, /not a uuid/i);
        });

        try {
            Validator.check('A987FBC9-4BED-5078-0F07-9141BA07C9F3').isUUID(5);
            assert.ok(false, 'isUUID failed');
        } catch (e) {}

        try {
            Validator.check('A987FBC9-4BED-4078-0F07-9141BA07C9F3').isUUID(4);
            assert.ok(false, 'isUUID failed');
        } catch (e) {}

        try {
            Validator.check('abc').isUUID();
            assert.ok(false, 'isUUID failed');
        } catch (e) {}

        try {
            Validator.check('A987FBC932-4BED-3078-CF07-9141BA07C9').isUUID();
            assert.ok(false, 'isUUID failed');
        } catch (e) {}

        try {
            Validator.check('A987FBG9-4BED-3078-CF07-9141BA07C9DE').isUUID();
            assert.ok(false, 'isUUID failed');
        } catch (e) {}

    },

    'test #isUUIDv3()': function () {
      ////xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit and y is one of 8, 9, A, or B

      var goodUuidV3s = [
        "987FBC97-4BED-3078-AF07-9141BA07C9F3"
      ]

      goodUuidV3s.forEach(function (item) {
        assert.ok(Validator.check(item).isUUIDv3());
      });

      var badUuidV3s = [
        "",
        null,
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx",
        "A987FBC94BED3078CF079141BA07C9F3",
        "934859",
        "987FBC9-4BED-3078-CF07A-9141BA07C9F3",
        "AAAAAAAA-1111-1111-AAAG-111111111111"
      ]

      badUuidV3s.forEach(function (item) {
        assert.throws(function() { Validator.check(item).isUUIDv3() },  /not a uuid v3/i);
      });
    },

    'test #isUUIDv4()': function () {
      ////xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit and y is one of 8, 9, A, or B

      var goodUuidV4s = [
        "713ae7e3-cb32-45f9-adcb-7c4fa86b90c1",
        "625e63f3-58f5-40b7-83a1-a72ad31acffb",
        "57b73598-8764-4ad0-a76a-679bb6640eb1",
        "9c858901-8a57-4791-81fe-4c455b099bc9"
      ]

      goodUuidV4s.forEach(function (item) {
        assert.ok(Validator.check(item).isUUIDv4());
      });

      var badUuidV4s = [
        "",
        null,
        "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3",
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx",
        "A987FBC94BED3078CF079141BA07C9F3",
        "934859",
        "987FBC9-4BED-3078-CF07A-9141BA07C9F3",
        "AAAAAAAA-1111-1111-AAAG-111111111111",
        "9a47c6fa-e388-1f4f-8c67-77ef5f476ff6"
      ]

      badUuidV4s.forEach(function (item) {
        assert.throws(function() { Validator.check(item).isUUIDv4() },  /not a uuid v4/i);
      });
    },

    'test #isUUIDv5()': function () {
        ////xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit and y is one of 8, 9, A, or B

        var goodUuidV5s = [
          "987FBC97-4BED-5078-AF07-9141BA07C9F3",
          "987FBC97-4BED-5078-BF07-9141BA07C9F3",
          "987FBC97-4BED-5078-8F07-9141BA07C9F3",
          "987FBC97-4BED-5078-9F07-9141BA07C9F3"
        ];

        goodUuidV5s.forEach(function (item) {
          assert.ok(Validator.check(item).isUUIDv5());
        });

        var badUuidV5s = [
          "",
          null,
          "xxxA987FBC9-4BED-5078-CF07-9141BA07C9F3",
          "A987FBC9-4BED-5078-CF07-9141BA07C9F3xxx",
          "A987FBC94BED5078CF079141BA07C9F3",
          "934859",
          "987FBC9-4BED-5078-CF07A-9141BA07C9F3",
          "AAAAAAAA-1111-1111-AAAG-111111111111"
        ];

        badUuidV5s.forEach(function (item) {
          assert.throws(function() { Validator.check(item).isUUIDv5(); },  /not a uuid v5/i);
        });
      },

    'test #isIn(options)': function () {

        assert.ok(Validator.check('foo').isIn('foobar'));
        assert.ok(Validator.check('foo').isIn('I love football'));

        assert.ok(Validator.check('foo').isIn(['foo', 'bar', 'baz']));

        assert.ok(Validator.check('1').isIn([1, 2, 3]));

        assert.throws(function() {
            Validator.check('foo').isIn(['bar', 'baz']);
          }, /unexpected/i
        );

        assert.throws(function() {
            Validator.check('foo').isIn('bar, baz');
          }, /unexpected/i
        );

        assert.throws(function() {
            Validator.check('foo').isIn(1234567);
          }, /invalid/i
        );

        assert.throws(function() {
            Validator.check('foo').isIn({foo:"foo",bar:"bar"});
          }, /invalid/i
        );
    },

    'test #notIn(options)': function () {

        assert.ok(Validator.check('foo').notIn('bar'));
        assert.ok(Validator.check('foo').notIn('awesome'));

        assert.ok(Validator.check('foo').notIn(['foobar', 'bar', 'baz']));

        assert.throws(function() {
            Validator.check('foo').notIn(['foo', 'bar', 'baz']);
          }, /unexpected/i
        );

        assert.throws(function() {
            Validator.check('foo').notIn('foobar');
          }, /unexpected/i
        );

        assert.throws(function() {
            Validator.check('1').notIn([1, 2, 3]);
        }, /unexpected/i);

        assert.throws(function() {
            Validator.check('foo').notIn(1234567);
          }, /invalid/i
        );

        assert.throws(function() {
            Validator.check('foo').notIn({foo:"foo",bar:"bar"});
          }, /invalid/i
        );
    },

    'test #isDate()': function() {
        assert.ok(Validator.check('2011-08-04').isDate());
        assert.ok(Validator.check('04. 08. 2011.').isDate());
        assert.ok(Validator.check('08/04/2011').isDate());
        assert.ok(Validator.check('2011.08.04').isDate());
        assert.ok(Validator.check('4. 8. 2011. GMT').isDate());
        assert.ok(Validator.check('2011-08-04 12:00').isDate());

        assert.throws(Validator.check('foo').isDate);
        assert.throws(Validator.check('2011-foo-04').isDate);
        assert.throws(Validator.check('GMT').isDate);
    },

    'test #min()': function() {
        assert.ok(Validator.check('4').min(2));
        assert.ok(Validator.check('5').min(5));
        assert.ok(Validator.check('3.2').min(3));
        assert.ok(Validator.check('4.2').min(4.2));

        assert.throws(function() {
            Validator.check('5').min(10);
        });
        assert.throws(function() {
            Validator.check('5.1').min(5.11);
        });
    },

    'test #max()': function() {
        assert.ok(Validator.check('4').max(5));
        assert.ok(Validator.check('7').max(7));
        assert.ok(Validator.check('6.3').max(7));
        assert.ok(Validator.check('2.9').max(2.9));

        assert.throws(function() {
            Validator.check('5').max(2);
        });
        assert.throws(function() {
            Validator.check('4.9').max(4.2);
        });
    },

    'test #isDate()': function() {
        assert.ok(Validator.check('2011-08-04').isDate());
        assert.ok(Validator.check('04. 08. 2011.').isDate());
        assert.ok(Validator.check('08/04/2011').isDate());
        assert.ok(Validator.check('2011.08.04').isDate());
        assert.ok(Validator.check('4. 8. 2011. GMT').isDate());
        assert.ok(Validator.check('2011-08-04 12:00').isDate());

        assert.throws(Validator.check('foo').isDate);
        assert.throws(Validator.check('2011-foo-04').isDate);
        assert.throws(Validator.check('GMT').isDate);
    },

    'test #isAfter()': function() {
        var f = dateFixture();

        assert.ok(Validator.check('2011-08-04').isAfter('2011-08-03'));
        assert.ok(Validator.check(f.tomorrow).isAfter());

        assert.throws(function() {
            Validator.check('08/04/2011').isAfter('2011-09-01');
        });
        assert.throws(function() {
            Validator.check(f.yesterday).isAfter();
        });
        assert.throws(function() {
            Validator.check('2011-09-01').isAfter('2011-09-01');
        });
    },

    'test #isBefore()': function() {
        var f = dateFixture();

        assert.ok(Validator.check('2011-08-04').isBefore('2011-08-06'));
        assert.ok(Validator.check(f.yesterday).isBefore());

        assert.throws(function() {
            Validator.check('08/04/2011').isBefore('2011-07-01');
        });
        assert.throws(function() {
            Validator.check(f.tomorrow).isBefore();
        });
        assert.throws(function() {
            Validator.check('2011-09-01').isBefore('2011-09-01');
        });
    },

    'test #isDivisibleBy()': function() {
        assert.ok(Validator.check('10').isDivisibleBy(2));
        assert.ok(Validator.check('6').isDivisibleBy(3));

        assert.throws(function() {
            Validator.check('10').isDivisibleBy('alpha');
        });

        assert.throws(function() {
            Validator.check('alpha').isDivisibleBy(2);
        });

        assert.throws(function() {
            Validator.check('alpha').isDivisibleBy('alpha');
        });

        assert.throws(function() {
            Validator.check('5').isDivisibleBy(2);
        });

        assert.throws(function() {
            Validator.check('6.7').isDivisibleBy(3);
        });
    },

    'test error is instanceof ValidatorError': function() {
        try {
            Validator.check('not_an_email', 'Invalid').isEmail();
        } catch(e) {
            assert.strictEqual(true, e instanceof ValidatorError);
            assert.strictEqual(true, e instanceof Error);
            assert.notStrictEqual(true, e instanceof FakeError);
        }
    },

    'test false as error message': function() {
        var v = new node_validator.Validator()
          , error = null;
        v.error = function (msg) {
            error = msg;
        };
        v.check('not_an_email', false).isEmail();
        assert.strictEqual(error, false);
    }
}
