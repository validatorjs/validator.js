/*!
 * Copyright (c) 2016 Chris O'Hara <cohara87@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      (global.validator = factory());
}(this, function () { 'use strict';

      function assertString(input) {
        if (typeof input !== 'string') {
          throw new TypeError('This library (validator.js) validates strings only');
        }
      }

      function toDate(date) {
        assertString(date);
        date = Date.parse(date);
        return !isNaN(date) ? new Date(date) : null;
      }

      function toFloat(str) {
        assertString(str);
        return parseFloat(str);
      }

      function toInt(str, radix) {
        assertString(str);
        return parseInt(str, radix || 10);
      }

      function toBoolean(str, strict) {
        assertString(str);
        if (strict) {
          return str === '1' || str === 'true';
        }
        return str !== '0' && str !== 'false' && str !== '';
      }

      function equals(str, comparison) {
        assertString(str);
        return str === comparison;
      }

      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      function toString(input) {
        if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null) {
          if (typeof input.toString === 'function') {
            input = input.toString();
          } else {
            input = '[object Object]';
          }
        } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
          input = '';
        }
        return String(input);
      }

      function contains(str, elem) {
        assertString(str);
        return str.indexOf(toString(elem)) >= 0;
      }

      function matches(str, pattern, modifiers) {
        assertString(str);
        if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
          pattern = new RegExp(pattern, modifiers);
        }
        return pattern.test(str);
      }

      function merge() {
        var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var defaults = arguments[1];

        for (var key in defaults) {
          if (typeof obj[key] === 'undefined') {
            obj[key] = defaults[key];
          }
        }
        return obj;
      }

      /* eslint-disable prefer-rest-params */
      function isByteLength(str, options) {
        assertString(str);
        var min = void 0;
        var max = void 0;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          min = options.min || 0;
          max = options.max;
        } else {
          // backwards compatibility: isByteLength(str, min [, max])
          min = arguments[1];
          max = arguments[2];
        }
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && (typeof max === 'undefined' || len <= max);
      }

      var default_fqdn_options = {
        require_tld: true,
        allow_underscores: false,
        allow_trailing_dot: false
      };

      function isFDQN(str, options) {
        assertString(str);
        options = merge(options, default_fqdn_options);

        /* Remove the optional trailing dot before checking validity */
        if (options.allow_trailing_dot && str[str.length - 1] === '.') {
          str = str.substring(0, str.length - 1);
        }
        var parts = str.split('.');
        if (options.require_tld) {
          var tld = parts.pop();
          if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
            return false;
          }
        }
        for (var part, i = 0; i < parts.length; i++) {
          part = parts[i];
          if (options.allow_underscores) {
            part = part.replace(/_/g, '');
          }
          if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
            return false;
          }
          if (/[\uff01-\uff5e]/.test(part)) {
            // disallow full-width chars
            return false;
          }
          if (part[0] === '-' || part[part.length - 1] === '-') {
            return false;
          }
        }
        return true;
      }

      var default_email_options = {
        allow_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
      };

      /* eslint-disable max-len */
      /* eslint-disable no-control-regex */
      var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
      var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
      var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
      var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
      var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
      /* eslint-enable max-len */
      /* eslint-enable no-control-regex */

      function isEmail(str, options) {
        assertString(str);
        options = merge(options, default_email_options);

        if (options.allow_display_name) {
          var display_email = str.match(displayName);
          if (display_email) {
            str = display_email[1];
          }
        }

        var parts = str.split('@');
        var domain = parts.pop();
        var user = parts.join('@');

        var lower_domain = domain.toLowerCase();
        if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
          user = user.replace(/\./g, '').toLowerCase();
        }

        if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 256 })) {
          return false;
        }

        if (!isFDQN(domain, { require_tld: options.require_tld })) {
          return false;
        }

        if (user[0] === '"') {
          user = user.slice(1, user.length - 1);
          return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
        }

        var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

        var user_parts = user.split('.');
        for (var i = 0; i < user_parts.length; i++) {
          if (!pattern.test(user_parts[i])) {
            return false;
          }
        }

        return true;
      }

      var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      var ipv6Block = /^[0-9A-F]{1,4}$/i;

      function isIP(str) {
        var version = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        assertString(str);
        version = String(version);
        if (!version) {
          return isIP(str, 4) || isIP(str, 6);
        } else if (version === '4') {
          if (!ipv4Maybe.test(str)) {
            return false;
          }
          var parts = str.split('.').sort(function (a, b) {
            return a - b;
          });
          return parts[3] <= 255;
        } else if (version === '6') {
          var blocks = str.split(':');
          var foundOmissionBlock = false; // marker to indicate ::

          // At least some OS accept the last 32 bits of an IPv6 address
          // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
          // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
          // and '::a.b.c.d' is deprecated, but also valid.
          var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
          var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

          if (blocks.length > expectedNumberOfBlocks) {
            return false;
          }
          // initial or final ::
          if (str === '::') {
            return true;
          } else if (str.substr(0, 2) === '::') {
            blocks.shift();
            blocks.shift();
            foundOmissionBlock = true;
          } else if (str.substr(str.length - 2) === '::') {
            blocks.pop();
            blocks.pop();
            foundOmissionBlock = true;
          }

          for (var i = 0; i < blocks.length; ++i) {
            // test for a :: which can not be at the string start/end
            // since those cases have been handled above
            if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
              if (foundOmissionBlock) {
                return false; // multiple :: in address
              }
              foundOmissionBlock = true;
            } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
              // it has been checked before that the last
              // block is a valid IPv4 address
            } else if (!ipv6Block.test(blocks[i])) {
              return false;
            }
          }
          if (foundOmissionBlock) {
            return blocks.length >= 1;
          }
          return blocks.length === expectedNumberOfBlocks;
        }
        return false;
      }

      var default_url_options = {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
      };

      function isURL(url, options) {
        assertString(url);
        if (!url || url.length >= 2083 || /\s/.test(url)) {
          return false;
        }
        if (url.indexOf('mailto:') === 0) {
          return false;
        }
        options = merge(options, default_url_options);
        var protocol = void 0,
            auth = void 0,
            host = void 0,
            hostname = void 0,
            port = void 0,
            port_str = void 0,
            split = void 0;

        split = url.split('#');
        url = split.shift();

        split = url.split('?');
        url = split.shift();

        split = url.split('://');
        if (split.length > 1) {
          protocol = split.shift();
          if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
            return false;
          }
        } else if (options.require_protocol) {
          return false;
        } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
          split[0] = url.substr(2);
        }
        url = split.join('://');

        split = url.split('/');
        url = split.shift();
        split = url.split('@');
        if (split.length > 1) {
          auth = split.shift();
          if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
            return false;
          }
        }
        hostname = split.join('@');
        split = hostname.split(':');
        host = split.shift();
        if (split.length) {
          port_str = split.join(':');
          port = parseInt(port_str, 10);
          if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
            return false;
          }
        }
        if (!isIP(host) && !isFDQN(host, options) && host !== 'localhost') {
          return false;
        }
        if (options.host_whitelist && options.host_whitelist.indexOf(host) === -1) {
          return false;
        }
        if (options.host_blacklist && options.host_blacklist.indexOf(host) !== -1) {
          return false;
        }
        return true;
      }

      var macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

      function isMACAddress(str) {
        assertString(str);
        return macAddress.test(str);
      }

      function isBoolean(str) {
        assertString(str);
        return ['true', 'false', '1', '0'].indexOf(str) >= 0;
      }

      var alpha = {
        'en-US': /^[A-Z]+$/i,
        'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
        'de-DE': /^[A-ZÄÖÜß]+$/i,
        'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
        'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        'nl-NL': /^[A-ZÉËÏÓÖÜ]+$/i,
        'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
        'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
        'pt-PT': /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
        'ru-RU': /^[А-ЯЁа-яё]+$/i,
        'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
        ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
      };

      var alphanumeric = {
        'en-US': /^[0-9A-Z]+$/i,
        'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
        'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
        'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
        'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
        'nl-NL': /^[0-9A-ZÉËÏÓÖÜ]+$/i,
        'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
        'pt-PT': /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
        'ru-RU': /^[0-9А-ЯЁа-яё]+$/i,
        'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
        ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
      };

      var englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];

      for (var locale, i = 0; i < englishLocales.length; i++) {
        locale = 'en-' + englishLocales[i];
        alpha[locale] = alpha['en-US'];
        alphanumeric[locale] = alphanumeric['en-US'];
      }

      // Source: http://www.localeplanet.com/java/
      var arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];

      for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
        _locale = 'ar-' + arabicLocales[_i];
        alpha[_locale] = alpha.ar;
        alphanumeric[_locale] = alphanumeric.ar;
      }

      function isAlpha(str) {
        var locale = arguments.length <= 1 || arguments[1] === undefined ? 'en-US' : arguments[1];

        assertString(str);
        if (locale in alpha) {
          return alpha[locale].test(str);
        }
        throw new Error('Invalid locale \'' + locale + '\'');
      }

      function isAlphanumeric(str) {
        var locale = arguments.length <= 1 || arguments[1] === undefined ? 'en-US' : arguments[1];

        assertString(str);
        if (locale in alphanumeric) {
          return alphanumeric[locale].test(str);
        }
        throw new Error('Invalid locale \'' + locale + '\'');
      }

      var numeric = /^[-+]?[0-9]+$/;

      function isNumeric(str) {
        assertString(str);
        return numeric.test(str);
      }

      function isLowercase(str) {
        assertString(str);
        return str === str.toLowerCase();
      }

      function isUppercase(str) {
        assertString(str);
        return str === str.toUpperCase();
      }

      /* eslint-disable no-control-regex */
      var ascii = /^[\x00-\x7F]+$/;
      /* eslint-enable no-control-regex */

      function isAscii(str) {
        assertString(str);
        return ascii.test(str);
      }

      var fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

      function isFullWidth(str) {
        assertString(str);
        return fullWidth.test(str);
      }

      var halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

      function isHalfWidth(str) {
        assertString(str);
        return halfWidth.test(str);
      }

      function isVariableWidth(str) {
        assertString(str);
        return fullWidth.test(str) && halfWidth.test(str);
      }

      /* eslint-disable no-control-regex */
      var multibyte = /[^\x00-\x7F]/;
      /* eslint-enable no-control-regex */

      function isMultibyte(str) {
        assertString(str);
        return multibyte.test(str);
      }

      var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

      function isSurrogatePair(str) {
        assertString(str);
        return surrogatePair.test(str);
      }

      var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
      var intLeadingZeroes = /^[-+]?[0-9]+$/;

      function isInt(str, options) {
        assertString(str);
        options = options || {};

        // Get the regex to use for testing, based on whether
        // leading zeroes are allowed or not.
        var regex = options.hasOwnProperty('allow_leading_zeroes') && options.allow_leading_zeroes ? intLeadingZeroes : int;

        // Check min/max
        var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
        var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;

        return regex.test(str) && minCheckPassed && maxCheckPassed;
      }

      var float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;

      function isFloat(str, options) {
        assertString(str);
        options = options || {};
        if (str === '' || str === '.') {
          return false;
        }
        return float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
      }

      var decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;

      function isDecimal(str) {
        assertString(str);
        return str !== '' && decimal.test(str);
      }

      var hexadecimal = /^[0-9A-F]+$/i;

      function isHexadecimal(str) {
        assertString(str);
        return hexadecimal.test(str);
      }

      function isDivisibleBy(str, num) {
        assertString(str);
        return toFloat(str) % parseInt(num, 10) === 0;
      }

      var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

      function isHexColor(str) {
        assertString(str);
        return hexcolor.test(str);
      }

      function isJSON(str) {
        assertString(str);
        try {
          var obj = JSON.parse(str);
          return !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
        } catch (e) {/* ignore */}
        return false;
      }

      function isNull(str) {
        assertString(str);
        return str.length === 0;
      }

      /* eslint-disable prefer-rest-params */
      function isLength(str, options) {
        assertString(str);
        var min = void 0;
        var max = void 0;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          min = options.min || 0;
          max = options.max;
        } else {
          // backwards compatibility: isLength(str, min [, max])
          min = arguments[1];
          max = arguments[2];
        }
        var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
        var len = str.length - surrogatePairs.length;
        return len >= min && (typeof max === 'undefined' || len <= max);
      }

      var uuid = {
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
      };

      function isUUID(str) {
        var version = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

        assertString(str);
        var pattern = uuid[version];
        return pattern && pattern.test(str);
      }

      function isMongoId(str) {
        assertString(str);
        return isHexadecimal(str) && str.length === 24;
      }

      /* eslint-disable max-len */
      // from http://goo.gl/0ejHHW
      var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
      /* eslint-enable max-len */

      function isISO8601 (str) {
        assertString(str);
        return iso8601.test(str);
      }

      function getTimezoneOffset(str) {
        var iso8601Parts = str.match(iso8601);
        var timezone = void 0,
            sign = void 0,
            hours = void 0,
            minutes = void 0;
        if (!iso8601Parts) {
          str = str.toLowerCase();
          timezone = str.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/);
          if (!timezone) {
            return str.indexOf('gmt') !== -1 ? 0 : null;
          }
          sign = timezone[1];
          var offset = timezone[2];
          if (offset.length === 3) {
            offset = '0' + offset;
          }
          if (offset.length <= 2) {
            hours = 0;
            minutes = parseInt(offset, 10);
          } else {
            hours = parseInt(offset.slice(0, 2), 10);
            minutes = parseInt(offset.slice(2, 4), 10);
          }
        } else {
          timezone = iso8601Parts[21];
          if (!timezone) {
            // if no hour/minute was provided, the date is GMT
            return !iso8601Parts[12] ? 0 : null;
          }
          if (timezone === 'z' || timezone === 'Z') {
            return 0;
          }
          sign = iso8601Parts[22];
          if (timezone.indexOf(':') !== -1) {
            hours = parseInt(iso8601Parts[23], 10);
            minutes = parseInt(iso8601Parts[24], 10);
          } else {
            hours = 0;
            minutes = parseInt(iso8601Parts[23], 10);
          }
        }
        return (hours * 60 + minutes) * (sign === '-' ? 1 : -1);
      }

      function isDate(str) {
        assertString(str);
        var normalizedDate = new Date(Date.parse(str));
        if (isNaN(normalizedDate)) {
          return false;
        }

        // normalizedDate is in the user's timezone. Apply the input
        // timezone offset to the date so that the year and day match
        // the input
        var timezoneOffset = getTimezoneOffset(str);
        if (timezoneOffset !== null) {
          var timezoneDifference = normalizedDate.getTimezoneOffset() - timezoneOffset;
          normalizedDate = new Date(normalizedDate.getTime() + 60000 * timezoneDifference);
        }

        var day = String(normalizedDate.getDate());
        var dayOrYear = void 0,
            dayOrYearMatches = void 0,
            year = void 0;
        // check for valid double digits that could be late days
        // check for all matches since a string like '12/23' is a valid date
        // ignore everything with nearby colons
        dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g);
        if (!dayOrYearMatches) {
          return true;
        }
        dayOrYear = dayOrYearMatches.map(function (digitString) {
          return digitString.match(/\d+/g)[0];
        }).join('/');

        year = String(normalizedDate.getFullYear()).slice(-2);
        if (dayOrYear === day || dayOrYear === year) {
          return true;
        } else if (dayOrYear === '' + day / year || dayOrYear === '' + year / day) {
          return true;
        }
        return false;
      }

      function isAfter(str) {
        var date = arguments.length <= 1 || arguments[1] === undefined ? String(new Date()) : arguments[1];

        assertString(str);
        var comparison = toDate(date);
        var original = toDate(str);
        return !!(original && comparison && original > comparison);
      }

      function isBefore(str) {
        var date = arguments.length <= 1 || arguments[1] === undefined ? String(new Date()) : arguments[1];

        assertString(str);
        var comparison = toDate(date);
        var original = toDate(str);
        return !!(original && comparison && original < comparison);
      }

      function isIn(str, options) {
        assertString(str);
        var i = void 0;
        if (Object.prototype.toString.call(options) === '[object Array]') {
          var array = [];
          for (i in options) {
            if ({}.hasOwnProperty.call(options, i)) {
              array[i] = toString(options[i]);
            }
          }
          return array.indexOf(str) >= 0;
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          return options.hasOwnProperty(str);
        } else if (options && typeof options.indexOf === 'function') {
          return options.indexOf(str) >= 0;
        }
        return false;
      }

      /* eslint-disable max-len */
      var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
      /* eslint-enable max-len */

      function isCreditCard(str) {
        assertString(str);
        var sanitized = str.replace(/[^0-9]+/g, '');
        if (!creditCard.test(sanitized)) {
          return false;
        }
        var sum = 0;
        var digit = void 0;
        var tmpNum = void 0;
        var shouldDouble = void 0;
        for (var i = sanitized.length - 1; i >= 0; i--) {
          digit = sanitized.substring(i, i + 1);
          tmpNum = parseInt(digit, 10);
          if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
              sum += tmpNum % 10 + 1;
            } else {
              sum += tmpNum;
            }
          } else {
            sum += tmpNum;
          }
          shouldDouble = !shouldDouble;
        }
        return !!(sum % 10 === 0 ? sanitized : false);
      }

      var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

      function isISIN(str) {
        assertString(str);
        if (!isin.test(str)) {
          return false;
        }

        var checksumStr = str.replace(/[A-Z]/g, function (character) {
          return parseInt(character, 36);
        });

        var sum = 0;
        var digit = void 0;
        var tmpNum = void 0;
        var shouldDouble = true;
        for (var i = checksumStr.length - 2; i >= 0; i--) {
          digit = checksumStr.substring(i, i + 1);
          tmpNum = parseInt(digit, 10);
          if (shouldDouble) {
            tmpNum *= 2;
            if (tmpNum >= 10) {
              sum += tmpNum + 1;
            } else {
              sum += tmpNum;
            }
          } else {
            sum += tmpNum;
          }
          shouldDouble = !shouldDouble;
        }

        return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
      }

      var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
      var isbn13Maybe = /^(?:[0-9]{13})$/;
      var factor = [1, 3];

      function isISBN(str) {
        var version = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        assertString(str);
        version = String(version);
        if (!version) {
          return isISBN(str, 10) || isISBN(str, 13);
        }
        var sanitized = str.replace(/[\s-]+/g, '');
        var checksum = 0;
        var i = void 0;
        if (version === '10') {
          if (!isbn10Maybe.test(sanitized)) {
            return false;
          }
          for (i = 0; i < 9; i++) {
            checksum += (i + 1) * sanitized.charAt(i);
          }
          if (sanitized.charAt(9) === 'X') {
            checksum += 10 * 10;
          } else {
            checksum += 10 * sanitized.charAt(9);
          }
          if (checksum % 11 === 0) {
            return !!sanitized;
          }
        } else if (version === '13') {
          if (!isbn13Maybe.test(sanitized)) {
            return false;
          }
          for (i = 0; i < 12; i++) {
            checksum += factor[i % 2] * sanitized.charAt(i);
          }
          if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) {
            return !!sanitized;
          }
        }
        return false;
      }

      /* eslint-disable max-len */
      var phones = {
        'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
        'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
        'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
        'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
        'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
        'da-DK': /^(\+?45)?(\d{8})$/,
        'el-GR': /^(\+?30)?(69\d{8})$/,
        'en-AU': /^(\+?61|0)4\d{8}$/,
        'en-GB': /^(\+?44|0)7\d{9}$/,
        'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
        'en-IN': /^(\+?91|0)?[789]\d{9}$/,
        'en-NZ': /^(\+?64|0)2\d{7,9}$/,
        'en-ZA': /^(\+?27|0)\d{9}$/,
        'en-ZM': /^(\+?26)?09[567]\d{7}$/,
        'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
        'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
        'fr-FR': /^(\+?33|0)[67]\d{8}$/,
        'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
        'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
        'nb-NO': /^(\+?47)?[49]\d{7}$/,
        'nn-NO': /^(\+?47)?[49]\d{7}$/,
        'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
        'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
        'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
        'ru-RU': /^(\+?7|8)?9\d{9}$/,
        'tr-TR': /^(\+?90|0)?5\d{9}$/,
        'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
        'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
        'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
      };
      /* eslint-enable max-len */

      // aliases
      phones['en-CA'] = phones['en-US'];

      function isMobilePhone(str, locale) {
        assertString(str);
        if (locale in phones) {
          return phones[locale].test(str);
        }
        return false;
      }

      function currencyRegex(options) {
        var symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?'),
            negative = '-?',
            whole_dollar_amount_without_sep = '[1-9]\\d*',
            whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*',
            valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
            whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?',
            decimal_amount = '(\\' + options.decimal_separator + '\\d{2})?';
        var pattern = whole_dollar_amount + decimal_amount;

        // default is negative sign before symbol, but there are two other options (besides parens)
        if (options.allow_negatives && !options.parens_for_negatives) {
          if (options.negative_sign_after_digits) {
            pattern += negative;
          } else if (options.negative_sign_before_digits) {
            pattern = negative + pattern;
          }
        }

        // South African Rand, for example, uses R 123 (space) and R-123 (no space)
        if (options.allow_negative_sign_placeholder) {
          pattern = '( (?!\\-))?' + pattern;
        } else if (options.allow_space_after_symbol) {
          pattern = ' ?' + pattern;
        } else if (options.allow_space_after_digits) {
          pattern += '( (?!$))?';
        }

        if (options.symbol_after_digits) {
          pattern += symbol;
        } else {
          pattern = symbol + pattern;
        }

        if (options.allow_negatives) {
          if (options.parens_for_negatives) {
            pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
          } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
            pattern = negative + pattern;
          }
        }

        /* eslint-disable prefer-template */
        return new RegExp('^' +
        // ensure there's a dollar and/or decimal amount, and that
        // it doesn't start with a space or a negative sign followed by a space
        '(?!-? )(?=.*\\d)' + pattern + '$');
        /* eslint-enable prefer-template */
      }

      var default_currency_options = {
        symbol: '$',
        require_symbol: false,
        allow_space_after_symbol: false,
        symbol_after_digits: false,
        allow_negatives: true,
        parens_for_negatives: false,
        negative_sign_before_digits: false,
        negative_sign_after_digits: false,
        allow_negative_sign_placeholder: false,
        thousands_separator: ',',
        decimal_separator: '.',
        allow_space_after_digits: false
      };

      function isCurrency(str, options) {
        assertString(str);
        options = merge(options, default_currency_options);
        return currencyRegex(options).test(str);
      }

      var notBase64 = /[^A-Z0-9+\/=]/i;

      function isBase64(str) {
        assertString(str);
        var len = str.length;
        if (!len || len % 4 !== 0 || notBase64.test(str)) {
          return false;
        }
        var firstPaddingChar = str.indexOf('=');
        return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
      }

      var dataURI = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9!\$&',\(\)\*\+,;=\-\._~:@\/\?%\s]*\s*$/i; // eslint-disable-line max-len

      function isDataURI(str) {
        assertString(str);
        return dataURI.test(str);
      }

      function ltrim(str, chars) {
        assertString(str);
        var pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
        return str.replace(pattern, '');
      }

      function rtrim(str, chars) {
        assertString(str);
        var pattern = chars ? new RegExp('[' + chars + ']') : /\s/;

        var idx = str.length - 1;
        while (idx >= 0 && pattern.test(str[idx])) {
          idx--;
        }

        return idx < str.length ? str.substr(0, idx + 1) : str;
      }

      function trim(str, chars) {
        return rtrim(ltrim(str, chars), chars);
      }

      function escape(str) {
            assertString(str);
            return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/`/g, '&#96;');
      }

      function unescape(str) {
            assertString(str);
            return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#96;/g, '`');
      }

      function blacklist(str, chars) {
        assertString(str);
        return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
      }

      function stripLow(str, keep_new_lines) {
        assertString(str);
        var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
        return blacklist(str, chars);
      }

      function whitelist(str, chars) {
        assertString(str);
        return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
      }

      function isWhitelisted(str, chars) {
        assertString(str);
        for (var i = str.length - 1; i >= 0; i--) {
          if (chars.indexOf(str[i]) === -1) {
            return false;
          }
        }
        return true;
      }

      var default_normalize_email_options = {
        lowercase: true,
        remove_dots: true,
        remove_extension: true
      };

      function normalizeEmail(email, options) {
        options = merge(options, default_normalize_email_options);
        if (!isEmail(email)) {
          return false;
        }
        var parts = email.split('@', 2);
        parts[1] = parts[1].toLowerCase();
        if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
          if (options.remove_extension) {
            parts[0] = parts[0].split('+')[0];
          }
          if (options.remove_dots) {
            parts[0] = parts[0].replace(/\./g, '');
          }
          if (!parts[0].length) {
            return false;
          }
          parts[0] = parts[0].toLowerCase();
          parts[1] = 'gmail.com';
        } else if (options.lowercase) {
          parts[0] = parts[0].toLowerCase();
        }
        return parts.join('@');
      }

      var version = '5.5.0';

      var validator = {
        version: version,
        toDate: toDate,
        toFloat: toFloat, toInt: toInt,
        toBoolean: toBoolean,
        equals: equals, contains: contains, matches: matches,
        isEmail: isEmail, isURL: isURL, isMACAddress: isMACAddress, isIP: isIP, isFQDN: isFDQN,
        isBoolean: isBoolean,
        isAlpha: isAlpha, isAlphanumeric: isAlphanumeric, isNumeric: isNumeric, isLowercase: isLowercase, isUppercase: isUppercase,
        isAscii: isAscii, isFullWidth: isFullWidth, isHalfWidth: isHalfWidth, isVariableWidth: isVariableWidth,
        isMultibyte: isMultibyte, isSurrogatePair: isSurrogatePair,
        isInt: isInt, isFloat: isFloat, isDecimal: isDecimal, isHexadecimal: isHexadecimal, isDivisibleBy: isDivisibleBy,
        isHexColor: isHexColor,
        isJSON: isJSON,
        isNull: isNull,
        isLength: isLength, isByteLength: isByteLength,
        isUUID: isUUID, isMongoId: isMongoId,
        isDate: isDate, isAfter: isAfter, isBefore: isBefore,
        isIn: isIn,
        isCreditCard: isCreditCard,
        isISIN: isISIN, isISBN: isISBN,
        isMobilePhone: isMobilePhone,
        isCurrency: isCurrency,
        isISO8601: isISO8601,
        isBase64: isBase64, isDataURI: isDataURI,
        ltrim: ltrim, rtrim: rtrim, trim: trim,
        escape: escape, unescape: unescape, stripLow: stripLow,
        whitelist: whitelist, blacklist: blacklist,
        isWhitelisted: isWhitelisted,
        normalizeEmail: normalizeEmail,
        toString: toString
      };

      return validator;

}));