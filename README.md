# validator.js

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Downloads][downloads-image]][npm-url]

A library of string validators and sanitizers.

### Server-side usage

Install the library with `npm install validator`

```javascript
var validator = require('validator');

validator.isEmail('foo@bar.com'); //=> true
```

### Client-side usage

The library can be loaded either as a standalone script, or through an [AMD][amd]-compatible loader

```html
<script type="text/javascript" src="validator.min.js"></script>
<script type="text/javascript">
  validator.isEmail('foo@bar.com'); //=> true
</script>
```

The library can also be installed through [bower][bower]

```bash
$ bower install validator-js
```

### Strings only

This library validates and sanitizes strings only.

**Repeat: this library validates and sanitizes strings only**.

Passing input that isn't a string will be an error in an upcoming release.
If you're not sure if your input is a string, coerce it using `input + ''`.

### Validators

- **contains(str, seed)** - check if the string contains the seed.
- **equals(str, comparison)** - check if the string matches the comparison.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isAlpha(str [, locale])** - check if the string contains only letters (a-zA-Z). Locale is one of `['en-US', 'de-DE', 'es-ES', 'fr-FR', 'nl-NL', 'pt-PT', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-ZA', 'en-ZM']`) and defaults to `en-US`.
- **isAlphanumeric(str [, locale])** - check if the string contains only letters and numbers. Locale is one of `['en-US', 'de-DE', 'es-ES', 'fr-FR', 'nl-NL', 'pt-PT', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-ZA', 'en-ZM']`) and defaults to `en-US`.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isBase64(str)** - check if a string is base64 encoded.
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isBoolean(str)** - check if a string is a boolean.
- **isByteLength(str, options)** - check if the string's length (in bytes) falls in a range.`options` is an object which defaults to `{min:0, max: undefined}`.
- **isCreditCard(str)** - check if the string is a credit card.
- **isCurrency(str, options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.
- **isDate(str)** - check if the string is a date.
- **isDecimal(str)** - check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isEmail(str [, options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true, require_tld: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part. If `require_tld` is set to false, e-mail addresses without having TLD in their domain will also be matched.
- **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isFloat(str [, options])** - check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`).
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isISIN(str)** - check if the string is an [ISIN][ISIN] (stock/security identifier).
- **isISO8601(str)** - check if the string is a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isInt(str [, options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isLength(str, options)** - check if the string's length falls in a range. `options` is an object which defaults to `{min:0, max: undefined}`. Note: this function takes into account surrogate pairs.
- **isLowercase(str)** - check if the string is lowercase.
- **isMACAddress(str)** - check if the string is a MAC address.
- **isMobilePhone(str, locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ', 'en-IN', 'es-ES', 'de-DE', 'fi-FI']`).
- **isMongoId(str)** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isNull(str)** - check if the string is null.
- **isNumeric(str)** - check if the string contains only numbers.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, require_valid_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isUppercase(str)** - check if the string is uppercase.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **isWhitelisted(str, chars)** - checks characters if they appear in the whitelist.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.

### Sanitizers

- **blacklist(input, chars)** - remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to escape some chars, e.g. `blacklist(input, '\\[\\]')`.
- **escape(input)** - replace `<`, `>`, `&`, `'`, `"` and `/` with HTML entities.
- **ltrim(input [, chars])** - trim characters from the left-side of the input.
- **normalizeEmail(email [, options])** - canonicalize an email address. `options` is an object which defaults to `{ lowercase: true, remove_dots: true, remove_extension: true }`. With `lowercase` set to `true`, the local part of the email address is lowercased for all domains; the hostname is always lowercased and the local part of the email address is always lowercased for hosts that are known to be case-insensitive (currently only GMail). Normalization follows special rules for known providers: currently, GMail addresses have dots removed in the local part and are stripped of extensions (e.g. `some.one+extension@gmail.com` becomes `someone@gmail.com`) and all `@googlemail.com` addresses are normalized to `@gmail.com`.
- **rtrim(input [, chars])** - trim characters from the right-side of the input.
- **stripLow(input [, keep_new_lines])** - remove characters with a numerical value < 32 and 127, mostly control characters. If `keep_new_lines` is `true`, newline characters are preserved (`\n` and `\r`, hex `0xA` and `0xD`). Unicode-safe in JavaScript.
- **toBoolean(input [, strict])** - convert the input string to a boolean. Everything except for `'0'`, `'false'` and `''` returns `true`. In strict mode only `'1'` and `'true'` return `true`.
- **toDate(input)** - convert the input string to a date, or `null` if the input is not a date.
- **toFloat(input)** - convert the input string to a float, or `NaN` if the input is not a float.
- **toInt(input [, radix])** - convert the input string to an integer, or `NaN` if the input is not an integer.
- **trim(input [, chars])** - trim characters (whitespace by default) from both sides of the input.
- **whitelist(input, chars)** - remove characters that do not appear in the whitelist. The characters are used in a RegExp and so you will need to escape some chars, e.g. `whitelist(input, '\\[\\]')`.

### XSS Sanitization

XSS sanitization was removed from the library in [2d5d6999](https://github.com/chriso/validator.js/commit/2d5d6999541add350fb396ef02dc42ca3215049e).

For an alternative, look at Yahoo's [xss-filters library](https://github.com/yahoo/xss-filters).

### Extensions

You can add your own validators using `validator.extend(name, fn)`

```javascript
validator.extend('isWhitespace', function (str) {
    return /^\s+$/.test(str);
});
```

Note that the first argument will be automatically coerced to a string.

```javascript
validator.isWhitespace('    \t\r\n');
// => true

validator.isWhitespace('foo bar');
// => false
```

### Tests

Tests require node v4.0+.

- `make test` - run the test suite.
- `make test V=1` - run the test suite with added verbosity.
- `make test TEST=pattern` - run tests that match a pattern.
- `make coverage` - run a coverage analysis tool.
- `make lint` - run a lint tool.

### License (MIT)

```
Copyright (c) 2016 Chris O'Hara <cohara87@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

[downloads-image]: http://img.shields.io/npm/dm/validator.svg

[npm-url]: https://npmjs.org/package/validator
[npm-image]: http://img.shields.io/npm/v/validator.svg

[travis-url]: https://travis-ci.org/chriso/validator.js
[travis-image]: http://img.shields.io/travis/chriso/validator.js.svg

[coveralls-url]: https://coveralls.io/r/chriso/validator.js
[coveralls-image]: http://img.shields.io/coveralls/chriso/validator.js/master.svg

[amd]: http://requirejs.org/docs/whyamd.html
[bower]: http://bower.io/

[mongoid]: http://docs.mongodb.org/manual/reference/object-id/
[ISIN]: https://en.wikipedia.org/wiki/International_Securities_Identification_Number
