import { format } from 'util';
import validator from '../src/index';

export default function test(options) {
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
        True: true,
        TRUE: true,
        foobar: true,
        '   ': true,
        false: false,
        False: false,
        FALSE: false,
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
        True: true,
        TRUE: true,
        foobar: false,
        '   ': false,
        false: false,
        False: false,
        FALSE: false,
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
      sanitizer: 'ltrim',
      args: ['\\S'],
      expect: { '\\S01010020100001': '01010020100001' },
    });


    test({
      sanitizer: 'rtrim',
      args: ['01'],
      expect: { '010100201000': '0101002' },
    });

    test({
      sanitizer: 'rtrim',
      args: ['\\S'],
      expect: { '01010020100001\\S': '01010020100001' },
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
        '2020-01-06T14:31:00.135Z': NaN,
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

        'Escaped string: &amp;lt;':
            'Escaped string: &lt;',
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

  it('should score passwords', () => {
    test({
      sanitizer: 'isStrongPassword',
      args: [{
        returnScore: true,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      }],
      expect: {
        abc: 13,
        abcc: 13.5,
        aBc: 23,
        'Abc123!': 47,
        '!@#$%^&*()': 20,
      },
    });
  });

  it('should score passwords with default options', () => {
    test({
      sanitizer: 'isStrongPassword',
      expect: {
        abc: false,
        abcc: false,
        aBc: false,
        'Abc123!': false,
        '!@#$%^&*()': false,
        'abc123!@f#rA': true,
      },
    });
  });
});
