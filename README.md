# validator.js

[![NPM version][npm-image]][npm-url]
[![CI][ci-image]][ci-url]
[![Coverage][codecov-image]][codecov-url]
[![Downloads][downloads-image]][npm-url]
[![Backers on Open Collective](https://opencollective.com/validatorjs/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/validatorjs/sponsors/badge.svg)](#sponsors)
[![Gitter](https://badges.gitter.im/validatorjs/community.svg)](https://gitter.im/validatorjs/community)

A library of string validators and sanitizers.

## Strings only

**This library validates and sanitizes strings only.**

If you're not sure if your input is a string, coerce it using `input + ''`.
Passing anything other than a string will result in an error.

## Installation and Usage

### Server-side usage

Install the library with `npm install validator`

#### No ES6

```javascript
var validator = require('validator');

validator.isEmail('foo@bar.com'); //=> true
```

#### ES6

```javascript
import validator from 'validator';
```

Or, import only a subset of the library:

```javascript
import isEmail from 'validator/lib/isEmail';
```

#### Tree-shakeable ES imports

```javascript
import isEmail from 'validator/es/lib/isEmail';
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

## Contributors

[Become a backer](https://opencollective.com/validatorjs#backer)

[Become a sponsor](https://opencollective.com/validatorjs#sponsor)

Thank you to the people who have already contributed:

<a href="https://github.com/validatorjs/validator.js/graphs/contributors"><img src="https://opencollective.com/validatorjs/contributors.svg?width=890" /></a>

## Validators

Here is a list of the validators currently available.

Validator                               | Description
--------------------------------------- | --------------------------------------
**contains(str, seed [, options ])**    | check if the string contains the seed.<br/><br/>`options` is an object that defaults to `{ ignoreCase: false}`.<br/>`ignoreCase` specified whether the case of the substring be same or not.
**equals(str, comparison)**             | check if the string matches the comparison.
**isAfter(str [, date])**               | check if the string is a date that's after the specified date (defaults to now).
**isAlpha(str [, locale, options])**    | check if the string contains only letters (a-zA-Z).<br/><br/>Locale is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fa-IR', 'fr-CA', 'fr-FR', 'he', 'hu-HU', 'it-IT', 'ku-IQ', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`) and defaults to `en-US`. Locale list is `validator.isAlphaLocales`. options is an optional object that can be supplied with the following key(s): ignore which can either be a String or RegExp of characters to be ignored e.g. " -" will ignore spaces and -'s.
**isAlphanumeric(str [, locale, options])**      | check if the string contains only letters and numbers (a-zA-Z0-9).<br/><br/>Locale is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fa-IR', 'fr-CA', 'fr-FR', 'he', 'hu-HU', 'it-IT', 'ku-IQ', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`) and defaults to `en-US`. Locale list is `validator.isAlphanumericLocales`. options is an optional object that can be supplied with the following key(s): ignore which can either be a String or RegExp of characters to be ignored e.g. " -" will ignore spaces and -'s.
**isAscii(str)**                        | check if the string contains ASCII chars only.
**isBase32(str)**                       | check if a string is base32 encoded.
**isBase58(str)**                       | check if a string is base58 encoded.
**isBase64(str [, options])**          | check if a string is base64 encoded. options is optional and defaults to `{urlSafe: false}`<br/> when `urlSafe` is true it tests the given base64 encoded string is [url safe](https://base64.guru/standards/base64url)
**isBefore(str [, date])**              | check if the string is a date that's before the specified date.
**isBIC(str)**                          | check if a string is a BIC (Bank Identification Code) or SWIFT code.
**isBoolean(str)**                      | check if a string is a boolean.
**isBtcAddress(str)**            | check if the string is a valid BTC address.
**isByteLength(str [, options])**          | check if the string's length (in UTF-8 bytes) falls in a range.<br/><br/>`options` is an object which defaults to `{min:0, max: undefined}`.
**isCreditCard(str)**                   | check if the string is a credit card.
**isCurrency(str [, options])**            | check if the string is a valid currency amount.<br/><br/>`options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_decimal: true, require_decimal: false, digits_after_decimal: [2], allow_space_after_digits: false}`.<br/>**Note:** The array `digits_after_decimal` is filled with the exact number of digits allowed not a range, for example a range 1 to 3 will be given as [1, 2, 3].
**isDataURI(str)**                      | check if the string is a [data uri format](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
**isDate(input [, options])**          | Check if the input is a valid date. e.g. [`2002-07-15`, new Date()].<br/><br/> `options` is an object which can contain the keys `format`, `strictMode` and/or `delimiters`<br/><br/>`format` is a string and defaults to `YYYY/MM/DD`.<br/><br/>`strictMode` is a boolean and defaults to `false`. If `strictMode` is set to true, the validator will reject inputs different from `format`.<br/><br/> `delimiters` is an array of allowed date delimiters and defaults to `['/', '-']`.
**isDecimal(str [, options])**             | check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.<br/><br/>`options` is an object which defaults to `{force_decimal: false, decimal_digits: '1,', locale: 'en-US'}`<br/><br/>`locale` determine the decimal separator and is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fa', 'fa-AF', 'fa-IR', 'fr-FR', 'fr-CA', 'hu-HU', 'id-ID', 'it-IT', 'ku-IQ', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pl-Pl', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA', 'vi-VN']`.<br/>**Note:** `decimal_digits` is given as a range like '1,3', a specific value like '3' or min like '1,'.
**isDivisibleBy(str, number)**          | check if the string is a number that's divisible by another.
**isEAN(str)**                          | check if the string is an EAN (European Article Number).
**isEmail(str [, options])**            | check if the string is an email.<br/><br/>`options` is an object which defaults to `{ allow_display_name: false, require_display_name: false, allow_utf8_local_part: true, require_tld: true, allow_ip_domain: false, domain_specific_validation: false, blacklisted_chars: '' }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `require_display_name` is set to true, the validator will reject strings without the format `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part. If `require_tld` is set to false, e-mail addresses without having TLD in their domain will also be matched. If `ignore_max_length` is set to true, the validator will not check for the standard max length of an email. If `allow_ip_domain` is set to true, the validator will allow IP addresses in the host part. If `domain_specific_validation` is true, some additional validation will be enabled, e.g. disallowing certain syntactically valid email addresses that are rejected by GMail. If `blacklisted_chars` receives a string, then the validator will reject emails that include any of the characters in the string, in the name part.
**isEmpty(str [, options])**            | check if the string has a length of zero.<br/><br/>`options` is an object which defaults to `{ ignore_whitespace:false }`.
**isEthereumAddress(str)**              | check if the string is an [Ethereum](https://ethereum.org/) address using basic regex. Does not validate address checksums.
**isFloat(str [, options])**            | check if the string is a float.<br/><br/>`options` is an object which can contain the keys `min`, `max`, `gt`, and/or `lt` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`) it also has `locale` as an option.<br/><br/>`min` and `max` are equivalent to 'greater or equal' and 'less or equal', respectively while `gt` and `lt` are their strict counterparts.<br/><br/>`locale` determine the decimal separator and is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-CA', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`. Locale list is `validator.isFloatLocales`.
**isFQDN(str [, options])**             | check if the string is a fully qualified domain name (e.g. domain.com).<br/><br/>`options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false , allow_numeric_tld: false }`.
**isFullWidth(str)**                    | check if the string contains any full-width chars.
**isHalfWidth(str)**                    | check if the string contains any half-width chars.
**isHash(str, algorithm)**              | check if the string is a hash of type algorithm.<br/><br/>Algorithm is one of `['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b']`
**isHexadecimal(str)**                  | check if the string is a hexadecimal number.
**isHexColor(str)**                     | check if the string is a hexadecimal color.
**isHSL(str)**                          | check if the string is an HSL (hue, saturation, lightness, optional alpha) color based on [CSS Colors Level 4 specification](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).<br/><br/>Comma-separated format supported. Space-separated format supported with the exception of a few edge cases (ex: `hsl(200grad+.1%62%/1)`).
**isIBAN(str)**                         | check if a string is a IBAN (International Bank Account Number).
**isIdentityCard(str [, locale])**      | check if the string is a valid identity card code.<br/><br/>`locale` is one of `['ES', 'IN', 'IT', 'IR', 'MZ', 'NO', 'zh-TW', 'he-IL', 'ar-LY', 'ar-TN', 'zh-CN']` OR `'any'`. If 'any' is used, function will check if any of the locals match.<br/><br/>Defaults to 'any'.
**isIMEI(str [, options]))**                         | check if the string is a valid IMEI number. Imei should be of format `###############` or `##-######-######-#`.<br/><br/>`options` is an object which can contain the keys `allow_hyphens`. Defaults to first format . If allow_hyphens is set to true, the validator will validate the second format.
**isIn(str, values)**                   | check if the string is in a array of allowed values.
**isInt(str [, options])**              | check if the string is an integer.<br/><br/>`options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`). `options` can also contain the key `allow_leading_zeroes`, which when set to false will disallow integer values with leading zeroes (e.g. `{ allow_leading_zeroes: false }`). Finally, `options` can contain the keys `gt` and/or `lt` which will enforce integers being greater than or less than, respectively, the value provided (e.g. `{gt: 1, lt: 4}` for a number between 1 and 4).
**isIP(str [, version])**               | check if the string is an IP (version 4 or 6).
**isIPRange(str [, version])**          | check if the string is an IP Range (version 4 or 6).
**isISBN(str [, version])**             | check if the string is an ISBN (version 10 or 13).
**isISIN(str)**                         | check if the string is an [ISIN][ISIN] (stock/security identifier).
**isISO8601(str)**                      | check if the string is a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date. <br/>`options` is an object which defaults to `{ strict: false, strictSeparator: false }`. If `strict` is true, date strings with invalid dates like `2009-02-29` will be invalid. If `strictSeparator` is true, date strings with date and time separated by anything other than a T will be invalid.
**isISO31661Alpha2(str)**               | check if the string is a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned country code.
**isISO31661Alpha3(str)**               | check if the string is a valid [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) officially assigned country code.
**isISRC(str)**                         | check if the string is a [ISRC](https://en.wikipedia.org/wiki/International_Standard_Recording_Code).
**isISSN(str [, options])**             | check if the string is an [ISSN](https://en.wikipedia.org/wiki/International_Standard_Serial_Number).<br/><br/>`options` is an object which defaults to `{ case_sensitive: false, require_hyphen: false }`. If `case_sensitive` is true, ISSNs with a lowercase `'x'` as the check digit are rejected.
**isJSON(str [, options])**             | check if the string is valid JSON (note: uses JSON.parse).<br/><br/>`options` is an object which defaults to `{ allow_primitives: false }`. If `allow_primitives` is true, the primitives 'true', 'false' and 'null' are accepted as valid JSON values.
**isJWT(str)**                         | check if the string is valid JWT token.
**isLatLong(str [, options])**                      | check if the string is a valid latitude-longitude coordinate in the format `lat,long` or `lat, long`.<br/><br/>`options` is an object that defaults to `{ checkDMS: false }`. Pass `checkDMS` as `true` to validate DMS(degrees, minutes, and seconds) latitude-longitude format.
**isLength(str [, options])**              | check if the string's length falls in a range.<br/><br/>`options` is an object which defaults to `{min:0, max: undefined}`. Note: this function takes into account surrogate pairs.
**isLicensePlate(str [, locale])**     | check if string matches the format of a country's license plate.<br/><br/>(locale is one of `['de-DE', 'de-LI', 'pt-PT', 'sq-AL', 'pt-BR'']` or `any`).
**isLocale(str)**                       | check if the string is a locale
**isLowercase(str)**                    | check if the string is lowercase.
**isMACAddress(str)**                   | check if the string is a MAC address.<br/><br/>`options` is an object which defaults to `{no_separators: false}`. If `no_separators` is true, the validator will allow MAC addresses without separators. Also, it allows the use of hyphens, spaces or dots e.g  '01 02 03 04 05 ab', '01-02-03-04-05-ab' or '0102.0304.05ab'.
**isMagnetURI(str)**                      | check if the string is a [magnet uri format](https://en.wikipedia.org/wiki/Magnet_URI_scheme).
**isMD5(str)**                          | check if the string is a MD5 hash.<br/><br/>Please note that you can also use the `isHash(str, 'md5')` function. Keep in mind that MD5 has some collision weaknesses compared to other algorithms (e.g., SHA).
**isMimeType(str)**                     | check if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format
**isMobilePhone(str [, locale [, options]])**          | check if the string is a mobile phone number,<br/><br/>(locale is either an array of locales (e.g `['sk-SK', 'sr-RS']`) OR one of `['am-Am', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', ar-JO', 'ar-KW', 'ar-SA', 'ar-SY', 'ar-TN', 'az-AZ', 'az-LY', 'az-LB', 'bs-BA', 'be-BY', 'bg-BG', 'bn-BD', 'ca-AD', 'cs-CZ', 'da-DK', 'de-DE', 'de-AT', 'de-CH', 'de-LU', 'el-GR', 'en-AU', 'en-CA', 'en-GB', 'en-GG', 'en-GH', 'en-HK', 'en-MO', 'en-IE', 'en-IN', 'en-KE', 'en-MT', 'en-MU', 'en-NG', 'en-NZ', 'en-PK', 'en-PH', 'en-RW', 'en-SG', 'en-SL', 'en-UG', 'en-US', 'en-TZ', 'en-ZA', 'en-ZM', 'en-ZW', 'es-AR', 'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-DO', 'es-HN', 'es-PE', 'es-EC', 'es-ES', 'es-MX', 'es-PA', 'es-PY', 'es-UY', 'et-EE', 'fa-IR', 'fi-FI', 'fj-FJ', 'fo-FO', 'fr-BE', 'fr-FR', 'fr-GF', 'fr-GP', 'fr-MQ', 'fr-RE', 'ga-IE', 'he-IL', 'hu-HU', 'id-ID', 'it-IT', 'it-SM', 'ja-JP', 'ka-GE', 'kk-KZ', 'kl-GL', 'ko-KR', 'lt-LT', 'ms-MY', ''mz-MZ', nb-NO', 'ne-NP', 'nl-BE', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'pt-AO', 'ro-RO', 'ru-RU', 'si-LK' 'sl-SI', 'sk-SK', 'sq-AL', 'sr-RS', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA', 'uz-UZ', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-MO', 'zh-TW']` OR defaults to 'any'. If 'any' or a falsey value is used, function will check if any of the locales match).<br/><br/>`options` is an optional object that can be supplied with the following keys: `strictMode`, if this is set to `true`, the mobile phone number must be supplied with the country code and therefore must start with `+`. Locale list is `validator.isMobilePhoneLocales`.
**isMongoId(str)**                      | check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
**isMultibyte(str)**                    | check if the string contains one or more multibyte chars.
**isNumeric(str [, options])**                      | check if the string contains only numbers.<br/><br/>`options` is an object which defaults to `{no_symbols: false}` it also has locale as an option. If `no_symbols` is true, the validator will reject numeric strings that feature a symbol (e.g. `+`, `-`, or `.`).<br/><br/>`locale` determine the decimal separator and is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'fr-CA', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sl-SI', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`.
**isOctal(str)**                        | check if the string is a valid octal number.
**isPassportNumber(str, countryCode)**    | check if the string is a valid passport number.<br/><br/>(countryCode is one of `[ 'AM', 'AR', 'AT', 'AU', 'BE', 'BG', 'BY', 'BR', 'CA', 'CH', 'CN', 'CY', 'CZ', 'DE', 'DK', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE' 'IN', 'IR', 'IS', 'IT', 'JP', 'KR', 'LT', 'LU', 'LV', 'LY', 'MT', 'MY', 'MZ', 'NL', 'PO', 'PT', 'RO', 'RU', 'SE', 'SL', 'SK', 'TR', 'UA', 'US' ]`.
**isPort(str)**                         | check if the string is a valid port number.
**isPostalCode(str, locale)**           | check if the string is a postal code,<br/><br/>(locale is one of `[ 'AD', 'AT', 'AU', 'AZ', 'BE', 'BG', 'BR', 'BY', 'CA', 'CH', 'CN', 'CZ', 'DE', 'DK', 'DO', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HT', 'HU', 'ID', 'IE' 'IL', 'IN', 'IR', 'IS', 'IT', 'JP', 'KE', 'KR', 'LI', 'LT', 'LU', 'LV', 'MT', 'MX', 'MY', 'NL', 'NO', 'NP', 'NZ', 'PL', 'PR', 'PT', 'RO', 'RU', 'SA', 'SE', 'SG', 'SI', 'TH', 'TN', 'TW', 'UA', 'US', 'ZA', 'ZM' ]` OR 'any'. If 'any' is used, function will check if any of the locals match. Locale list is `validator.isPostalCodeLocales`.).
**isRFC3339(str)**                      | check if the string is a valid [RFC 3339](https://tools.ietf.org/html/rfc3339) date.
**isRgbColor(str [, includePercentValues])**                     | check if the string is a rgb or rgba color.<br/><br/>`includePercentValues` defaults to `true`. If you don't want to allow to set `rgb` or `rgba` values with percents, like `rgb(5%,5%,5%)`, or `rgba(90%,90%,90%,.3)`, then set it to false.
**isSemVer(str)**                       | check if the string is a Semantic Versioning Specification (SemVer).
**isSurrogatePair(str)**                | check if the string contains any surrogate pairs chars.
**isUppercase(str)**                    | check if the string is uppercase.
**isSlug**                              | Check if the string is of type slug. `Options` allow a single hyphen between string. e.g. [`cn-cn`, `cn-c-c`]
**isStrongPassword(str [, options])**   | Check if a password is strong or not. Allows for custom requirements or scoring rules. If `returnScore` is true, then the function returns an integer score for the password rather than a boolean.<br/>Default options: <br/>`{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }`
**isTaxID(str, locale)**                | Check if the given value is a valid Tax Identification    Number. Default locale is `en-US`.<br/><br/>More info about exact TIN support can be found in `src/lib/isTaxID.js`<br/><br/>Supported locales: `[ 'bg-BG', 'cs-CZ', 'de-AT', 'de-DE', 'dk-DK', 'el-CY', 'el-GR', 'en-GB', 'en-IE', 'en-US', 'es-ES', 'et-EE', 'fi-FI', 'fr-BE', 'fr-FR', 'fr-LU', 'hr-HR', 'hu-HU', 'it-IT', 'lb-LU', 'lt-LT', 'lv-LV' 'mt-MT', 'nl-BE', 'nl-NL', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'sk-SK', 'sl-SI', 'sv-SE' ]`
**isURL(str [, options])**              | check if the string is an URL.<br/><br/>`options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, require_host: true, require_port: false, require_valid_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false, disallow_auth: false, validate_length: true }`.<br/><br/>require_protocol - if set as true isURL will return false if protocol is not present in the URL.<br/>require_valid_protocol - isURL will check if the URL's protocol is present in the protocols option.<br/>protocols - valid protocols can be modified with this option.<br/>require_host - if set as false isURL will not check if host is present in the URL.<br/>require_port - if set as true isURL will check if port is present in the URL.<br/>allow_protocol_relative_urls - if set as true protocol relative URLs will be allowed.<br/>validate_length - if set as false isURL will skip string length validation (2083 characters is IE max URL length).
**isUUID(str [, version])**             | check if the string is a UUID (version 3, 4 or 5).
**isVariableWidth(str)**                | check if the string contains a mixture of full and half-width chars.
**isVAT(str, countryCode)**                | checks that the string is a [valid VAT number](https://en.wikipedia.org/wiki/VAT_identification_number) if validation is available for the given country code matching [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). <br/><br/>Available country codes: `[ 'GB', 'IT' ]`.
**isWhitelisted(str, chars)**           | checks characters if they appear in the whitelist.
**matches(str, pattern [, modifiers])** | check if string matches the pattern.<br/><br/>Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.

## Sanitizers

Here is a list of the sanitizers currently available.

Sanitizer                              | Description
-------------------------------------- | -------------------------------
**blacklist(input, chars)**            | remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to escape some chars, e.g. `blacklist(input, '\\[\\]')`.
**escape(input)**                      | replace `<`, `>`, `&`, `'`, `"` and `/` with HTML entities.
**ltrim(input [, chars])**             | trim characters from the left-side of the input.
**normalizeEmail(email [, options])**  | canonicalizes an email address. (This doesn't validate that the input is an email, if you want to validate the email use isEmail beforehand)<br/><br/>`options` is an object with the following keys and default values:<br/><ul><li>*all_lowercase: true* - Transforms the local part (before the @ symbol) of all email addresses to lowercase. Please note that this may violate RFC 5321, which gives providers the possibility to treat the local part of email addresses in a case sensitive way (although in practice most - yet not all - providers don't). The domain part of the email address is always lowercased, as it's case insensitive per RFC 1035.</li><li>*gmail_lowercase: true* - GMail addresses are known to be case-insensitive, so this switch allows lowercasing them even when *all_lowercase* is set to false. Please note that when *all_lowercase* is true, GMail addresses are lowercased regardless of the value of this setting.</li><li>*gmail_remove_dots: true*: Removes dots from the local part of the email address, as GMail ignores them (e.g. "john.doe" and "johndoe" are considered equal).</li><li>*gmail_remove_subaddress: true*: Normalizes addresses by removing "sub-addresses", which is the part following a "+" sign (e.g. "foo+bar@gmail.com" becomes "foo@gmail.com").</li><li>*gmail_convert_googlemaildotcom: true*: Converts addresses with domain @googlemail.com to @gmail.com, as they're equivalent.</li><li>*outlookdotcom_lowercase: true* - Outlook.com addresses (including Windows Live and Hotmail) are known to be case-insensitive, so this switch allows lowercasing them even when *all_lowercase* is set to false. Please note that when *all_lowercase* is true, Outlook.com addresses are lowercased regardless of the value of this setting.</li><li>*outlookdotcom_remove_subaddress: true*: Normalizes addresses by removing "sub-addresses", which is the part following a "+" sign (e.g. "foo+bar@outlook.com" becomes "foo@outlook.com").</li><li>*yahoo_lowercase: true* - Yahoo Mail addresses are known to be case-insensitive, so this switch allows lowercasing them even when *all_lowercase* is set to false. Please note that when *all_lowercase* is true, Yahoo Mail addresses are lowercased regardless of the value of this setting.</li><li>*yahoo_remove_subaddress: true*: Normalizes addresses by removing "sub-addresses", which is the part following a "-" sign (e.g. "foo-bar@yahoo.com" becomes "foo@yahoo.com").</li><li>*icloud_lowercase: true* - iCloud addresses (including MobileMe) are known to be case-insensitive, so this switch allows lowercasing them even when *all_lowercase* is set to false. Please note that when *all_lowercase* is true, iCloud addresses are lowercased regardless of the value of this setting.</li><li>*icloud_remove_subaddress: true*: Normalizes addresses by removing "sub-addresses", which is the part following a "+" sign (e.g. "foo+bar@icloud.com" becomes "foo@icloud.com").</li></ul>
**rtrim(input [, chars])**             | trim characters from the right-side of the input.
**stripLow(input [, keep_new_lines])** | remove characters with a numerical value < 32 and 127, mostly control characters. If `keep_new_lines` is `true`, newline characters are preserved (`\n` and `\r`, hex `0xA` and `0xD`). Unicode-safe in JavaScript.
**toBoolean(input [, strict])**        | convert the input string to a boolean. Everything except for `'0'`, `'false'` and `''` returns `true`. In strict mode only `'1'` and `'true'` return `true`.
**toDate(input)**                      | convert the input string to a date, or `null` if the input is not a date.
**toFloat(input)**                     | convert the input string to a float, or `NaN` if the input is not a float.
**toInt(input [, radix])**             | convert the input string to an integer, or `NaN` if the input is not an integer.
**trim(input [, chars])**              | trim characters (whitespace by default) from both sides of the input.
**unescape(input)**                    | replaces HTML encoded entities with `<`, `>`, `&`, `'`, `"` and `/`.
**whitelist(input, chars)**            | remove characters that do not appear in the whitelist. The characters are used in a RegExp and so you will need to escape some chars, e.g. `whitelist(input, '\\[\\]')`.

### XSS Sanitization

XSS sanitization was removed from the library in [2d5d6999](https://github.com/validatorjs/validator.js/commit/2d5d6999541add350fb396ef02dc42ca3215049e).

For an alternative, have a look at Yahoo's [xss-filters library](https://github.com/yahoo/xss-filters) or at [DOMPurify](https://github.com/cure53/DOMPurify).

## Contributing

In general, we follow the "fork-and-pull" Git workflow.

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Work on your fork
    1. Make your changes and additions
        - Most of your changes should be focused on `src/` and `test/` folders and/or `README.md`.
        - Files such as `validator.js`, `validator.min.js` and files in `lib/` folder are autogenerated when running tests (`npm test`) and need not to be changed **manually**.
    2. Change or add tests if needed
    3. Run tests and make sure they pass
    4. Add changes to README.md if needed
4. Commit changes to your own branch
5. **Make sure** you merge the latest from "upstream" and resolve conflicts if there is any
6. Repeat step 3(3) above
7. Push your work back up to your fork
8. Submit a Pull request so that we can review your changes

## Tests

Tests are using mocha, to run the tests use:

```sh
$ npm test
```

## Maintainers

- [chriso](https://github.com/chriso) - **Chris O'Hara** (author)
- [profnandaa](https://github.com/profnandaa) - **Anthony Nandaa**

## Reading

Remember, validating can be troublesome sometimes. See [A list of articles about programming assumptions commonly made that aren't true](https://github.com/jameslk/awesome-falsehoods).

## License (MIT)

```
Copyright (c) 2018 Chris O'Hara <cohara87@gmail.com>

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

[codecov-url]: https://codecov.io/gh/validatorjs/validator.js
[codecov-image]: https://codecov.io/gh/validatorjs/validator.js/branch/master/graph/badge.svg

[ci-url]: https://github.com/validatorjs/validator.js/actions?query=workflow%3ACI
[ci-image]: https://github.com/validatorjs/validator.js/workflows/CI/badge.svg?branch=master

[amd]: http://requirejs.org/docs/whyamd.html
[bower]: http://bower.io/

[mongoid]: http://docs.mongodb.org/manual/reference/object-id/
[ISIN]: https://en.wikipedia.org/wiki/International_Securities_Identification_Number
