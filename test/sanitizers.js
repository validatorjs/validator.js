import { format } from 'util';
import validator from '../index';

function test(options) {
  let args = options.args || [];

  args.unshift(null);

  Object.keys(options.expect).forEach((input) => {
    args[0] = input;
    let result = validator[options.sanitizer](...args);
    let expected = options.expect[input];
    if (isNaN(result) && !result.length && isNaN(expected)) {
      return;
    }

    if (result !== expected) {
      let warning = format(
        'validator.%s(%s) returned "%s" but should have returned "%s"',
        options.sanitizer, args.join(', '), result, expected
      );

      throw new Error(warning);
    }
  });
}

describe('Sanitizers', () => {
  it('should sanitize boolean strings', () => {
    test({
      sanitizer: 'toBoolean',
      expect: {
        0: false,
        '': false,
        1: true,
        true: true,
        foobar: true,
        '   ': true,
      },
    });
    test({
      sanitizer: 'toBoolean',
      args: [true], // strict
      expect: {
        0: false,
        '': false,
        1: true,
        true: true,
        foobar: false,
        '   ': false,
      },
    });
  });

  it('should trim whitespace', () => {
    test({
      sanitizer: 'trim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': 'foo',
        '      \r': '',
      },
    });

    test({
      sanitizer: 'ltrim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': 'foo  \r\n\t   ',
        '   \t  \n': '',
      },
    });

    test({
      sanitizer: 'rtrim',
      expect: {
        '  \r\n\tfoo  \r\n\t   ': '  \r\n\tfoo',
        ' \r\n  \t': '',
      },
    });
  });

  it('should trim custom characters', () => {
    test({
      sanitizer: 'trim',
      args: ['01'],
      expect: { '010100201000': '2' },
    });

    test({
      sanitizer: 'ltrim',
      args: ['01'],
      expect: { '010100201000': '201000' },
    });

    test({
      sanitizer: 'rtrim',
      args: ['01'],
      expect: { '010100201000': '0101002' },
    });
  });

  it('should convert strings to integers', () => {
    test({
      sanitizer: 'toInt',
      expect: {
        3: 3,
        ' 3 ': 3,
        2.4: 2,
        foo: NaN,
      },
    });

    test({
      sanitizer: 'toInt',
      args: [16],
      expect: { ff: 255 },
    });
  });

  it('should convert strings to floats', () => {
    test({
      sanitizer: 'toFloat',
      expect: {
        2: 2.0,
        '2.': 2.0,
        '-2.5': -2.5,
        '.5': 0.5,
        foo: NaN,
      },
    });
  });

  it('should escape HTML', () => {
    test({
      sanitizer: 'escape',
      expect: {
        '<script> alert("xss&fun"); </script>':
            '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;',

        "<script> alert('xss&fun'); </script>":
            '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;',

        'Backtick: `':
            'Backtick: &#96;',

        'Backslash: \\':
            'Backslash: &#x5C;',
      },
    });
  });

  it('should unescape HTML', () => {
    test({
      sanitizer: 'unescape',
      expect: {
        '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;':
             '<script> alert("xss&fun"); </script>',

        '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;':
            "<script> alert('xss&fun'); </script>",

        'Backtick: &#96;':
            'Backtick: `',
      },
    });
  });

  it('should remove control characters (<32 and 127)', () => {
    // Check basic functionality
    test({
      sanitizer: 'stripLow',
      expect: {
        'foo\x00': 'foo',
        '\x7Ffoo\x02': 'foo',
        '\x01\x09': '',
        'foo\x0A\x0D': 'foo',
      },
    });
    // Unicode safety
    test({
      sanitizer: 'stripLow',
      expect: {
        perché: 'perch\u00e9',
        '\u20ac': '\u20ac',
        '\u2206\x0A': '\u2206',
        '\ud83d\ude04': '\ud83d\ude04',
      },
    });
    // Preserve newlines
    test({
      sanitizer: 'stripLow',
      args: [true], // keep_new_lines
      expect: {
        'foo\x0A\x0D': 'foo\x0A\x0D',
        '\x03foo\x0A\x0D': 'foo\x0A\x0D',
      },
    });
  });

  it('should sanitize a string based on a whitelist', () => {
    test({
      sanitizer: 'whitelist',
      args: ['abc'],
      expect: {
        abcdef: 'abc',
        aaaaaaaaaabbbbbbbbbb: 'aaaaaaaaaabbbbbbbbbb',
        a1b2c3: 'abc',
        '   ': '',
      },
    });
  });

  it('should sanitize a string based on a blacklist', () => {
    test({
      sanitizer: 'blacklist',
      args: ['abc'],
      expect: {
        abcdef: 'def',
        aaaaaaaaaabbbbbbbbbb: '',
        a1b2c3: '123',
        '   ': '   ',
      },
    });
  });

  it('should normalize an email based on domain', () => {
    test({
      sanitizer: 'normalizeEmail',
      expect: {
        'test@me.com': 'test@me.com',
        'some.name@gmail.com': 'somename@gmail.com',
        'some.name@googleMail.com': 'somename@gmail.com',
        'some.name+extension@gmail.com': 'somename@gmail.com',
        'some.Name+extension@GoogleMail.com': 'somename@gmail.com',
        'some.name.middleName+extension@gmail.com': 'somenamemiddlename@gmail.com',
        'some.name.middleName+extension@GoogleMail.com': 'somenamemiddlename@gmail.com',
        'some.name.midd.leNa.me.+extension@gmail.com': 'somenamemiddlename@gmail.com',
        'some.name.midd.leNa.me.+extension@GoogleMail.com': 'somenamemiddlename@gmail.com',
        'some.name+extension@unknown.com': 'some.name+extension@unknown.com',
        'hans@m端ller.com': 'hans@m端ller.com',
        'some.name.midd..leNa...me...+extension@GoogleMail.com': 'somenamemidd..lena...me...@gmail.com',
        'matthew..example@gmail.com': 'matthew..example@gmail.com',
        '"foo@bar"@baz.com': '"foo@bar"@baz.com',
        'test@ya.ru': 'test@yandex.ru',
        'test@yandex.kz': 'test@yandex.ru',
        'test@yandex.ru': 'test@yandex.ru',
        'test@yandex.ua': 'test@yandex.ru',
        'test@yandex.com': 'test@yandex.ru',
        'test@yandex.by': 'test@yandex.ru',
      },
    });

    // Testing all_lowercase switch, should apply to domains not known to be case-insensitive
    test({
      sanitizer: 'normalizeEmail',
      args: [{ all_lowercase: false }],
      expect: {
        'test@foo.com': 'test@foo.com',
        'hans@m端ller.com': 'hans@m端ller.com',
        'test@FOO.COM': 'test@foo.com', // Hostname is always lowercased
        'blAH@x.com': 'blAH@x.com',
        // In case of domains that are known to be case-insensitive, there's a separate switch
        'TEST@me.com': 'test@me.com',
        'TEST@ME.COM': 'test@me.com',
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name.middleName+extension@GoogleMail.com': 'somenamemiddlename@gmail.com',
        'SOME.name.midd.leNa.me.+extension@gmail.com': 'somenamemiddlename@gmail.com',
        'SOME.name@gmail.com': 'somename@gmail.com',
        'SOME.name@yahoo.ca': 'some.name@yahoo.ca',
        'SOME.name@outlook.ie': 'some.name@outlook.ie',
        'SOME.name@me.com': 'some.name@me.com',
      },
    });

    // Testing *_lowercase
    test({
      sanitizer: 'normalizeEmail',
      args: [{
        all_lowercase: false,
        gmail_lowercase: false,
        icloud_lowercase: false,
        outlookdotcom_lowercase: false,
        yahoo_lowercase: false,
      }],
      expect: {
        'TEST@FOO.COM': 'TEST@foo.com', // all_lowercase
        'ME@gMAil.com': 'ME@gmail.com', // gmail_lowercase
        'ME@me.COM': 'ME@me.com', // icloud_lowercase
        'ME@icloud.COM': 'ME@icloud.com', // icloud_lowercase
        'ME@outlook.COM': 'ME@outlook.com', // outlookdotcom_lowercase
        'JOHN@live.CA': 'JOHN@live.ca', // outlookdotcom_lowercase
        'ME@ymail.COM': 'ME@ymail.com', // yahoo_lowercase
      },
    });

    // Testing all_lowercase
    // Should overwrite all the *_lowercase options
    test({
      sanitizer: 'normalizeEmail',
      args: [{
        all_lowercase: true,
        gmail_lowercase: false, // Overruled
        icloud_lowercase: false, // Overruled
        outlookdotcom_lowercase: false, // Overruled
        yahoo_lowercase: false, // Overruled
      }],
      expect: {
        'TEST@FOO.COM': 'test@foo.com', // all_lowercase
        'ME@gMAil.com': 'me@gmail.com', // gmail_lowercase
        'ME@me.COM': 'me@me.com', // icloud_lowercase
        'ME@icloud.COM': 'me@icloud.com', // icloud_lowercase
        'ME@outlook.COM': 'me@outlook.com', // outlookdotcom_lowercase
        'JOHN@live.CA': 'john@live.ca', // outlookdotcom_lowercase
        'ME@ymail.COM': 'me@ymail.com', // yahoo_lowercase
      },
    });

    // Testing *_remove_dots
    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_remove_dots: false,
      }],
      expect: {
        'SOME.name@GMAIL.com': 'some.name@gmail.com',
        'SOME.name+me@GMAIL.com': 'some.name@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_remove_dots: true,
      }],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'some.name..multiple@gmail.com': 'somename..multiple@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    // Testing *_remove_subaddress
    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_remove_subaddress: false,
        icloud_remove_subaddress: false,
        outlookdotcom_remove_subaddress: false,
        yahoo_remove_subaddress: false, // Note Yahoo uses "-"
      }],
      expect: {
        'foo+bar@unknown.com': 'foo+bar@unknown.com',
        'foo+bar@gmail.com': 'foo+bar@gmail.com', // gmail_remove_subaddress
        'foo+bar@me.com': 'foo+bar@me.com', // icloud_remove_subaddress
        'foo+bar@icloud.com': 'foo+bar@icloud.com', // icloud_remove_subaddress
        'foo+bar@live.fr': 'foo+bar@live.fr', // outlookdotcom_remove_subaddress
        'foo+bar@hotmail.co.uk': 'foo+bar@hotmail.co.uk', // outlookdotcom_remove_subaddress
        'foo-bar@yahoo.com': 'foo-bar@yahoo.com', // yahoo_remove_subaddress
        'foo+bar@yahoo.com': 'foo+bar@yahoo.com', // yahoo_remove_subaddress
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_remove_subaddress: true,
        icloud_remove_subaddress: true,
        outlookdotcom_remove_subaddress: true,
        yahoo_remove_subaddress: true, // Note Yahoo uses "-"
      }],
      expect: {
        'foo+bar@unknown.com': 'foo+bar@unknown.com',
        'foo+bar@gmail.com': 'foo@gmail.com', // gmail_remove_subaddress
        'foo+bar@me.com': 'foo@me.com', // icloud_remove_subaddress
        'foo+bar@icloud.com': 'foo@icloud.com', // icloud_remove_subaddress
        'foo+bar@live.fr': 'foo@live.fr', // outlookdotcom_remove_subaddress
        'foo+bar@hotmail.co.uk': 'foo@hotmail.co.uk', // outlookdotcom_remove_subaddress
        'foo-bar@yahoo.com': 'foo@yahoo.com', // yahoo_remove_subaddress
        'foo+bar@yahoo.com': 'foo+bar@yahoo.com', // yahoo_remove_subaddress
      },
    });

    // Testing gmail_convert_googlemaildotcom
    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_convert_googlemaildotcom: false,
      }],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.com': 'somename@googlemail.com',
        'SOME.name+me@googlemail.COM': 'somename@googlemail.com',
        'SOME.name+me@googlEmail.com': 'somename@googlemail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [{
        gmail_convert_googlemaildotcom: true,
      }],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.COM': 'somename@gmail.com',
        'SOME.name+me@googlEmail.com': 'somename@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });
  });
});
