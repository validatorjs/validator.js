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
!function(global, factory) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : global.validator = factory();
}(this, function() {
  "use strict";
  function assertString(input) {
    if ("string" != typeof input) throw new Error("this library validates strings only");
  }
  function toDate(date) {
    assertString(date);
    date = Date.parse(date);
    return isNaN(date) ? null : new Date(date);
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
    return strict ? "1" === str || "true" === str : "0" !== str && "false" !== str && "" !== str;
  }
  function equals(str, comparison) {
    assertString(str);
    return str === comparison;
  }
  function toString(input) {
    "object" === ("undefined" == typeof input ? "undefined" : babelHelpers["typeof"](input)) && null !== input ? input = "function" == typeof input.toString ? input.toString() : "[object Object]" : (null === input || "undefined" == typeof input || isNaN(input) && !input.length) && (input = "");
    return String(input);
  }
  function contains(str, elem) {
    assertString(str);
    return str.indexOf(toString(elem)) >= 0;
  }
  function matches(str, pattern, modifiers) {
    assertString(str);
    "[object RegExp]" !== Object.prototype.toString.call(pattern) && (pattern = new RegExp(pattern, modifiers));
    return pattern.test(str);
  }
  function merge() {
    var obj = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
    var defaults = arguments[1];
    for (var key in defaults) "undefined" == typeof obj[key] && (obj[key] = defaults[key]);
    return obj;
  }
  function isByteLength(str, options) {
    assertString(str);
    var min = void 0;
    var max = void 0;
    if ("object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options))) {
      min = options.min || 0;
      max = options.max;
    } else {
      min = arguments[1];
      max = arguments[2];
    }
    var len = encodeURI(str).split(/%..|./).length - 1;
    return len >= min && ("undefined" == typeof max || max >= len);
  }
  function isFDQN(str, options) {
    assertString(str);
    options = merge(options, default_fqdn_options);
    options.allow_trailing_dot && "." === str[str.length - 1] && (str = str.substring(0, str.length - 1));
    var parts = str.split(".");
    if (options.require_tld) {
      var tld = parts.pop();
      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) return !1;
    }
    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (options.allow_underscores) {
        if (part.indexOf("__") >= 0) return !1;
        part = part.replace(/_/g, "");
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) return !1;
      if (/[\uff01-\uff5e]/.test(part)) return !1;
      if ("-" === part[0] || "-" === part[part.length - 1]) return !1;
      if (part.indexOf("---") >= 0 && "xn--" !== part.slice(0, 4)) return !1;
    }
    return !0;
  }
  function isEmail(str, options) {
    assertString(str);
    options = merge(options, default_email_options);
    if (options.allow_display_name) {
      var display_email = str.match(displayName);
      display_email && (str = display_email[1]);
    }
    var parts = str.split("@");
    var domain = parts.pop();
    var user = parts.join("@");
    var lower_domain = domain.toLowerCase();
    ("gmail.com" === lower_domain || "googlemail.com" === lower_domain) && (user = user.replace(/\./g, "").toLowerCase());
    if (!isByteLength(user, {
      max: 64
    }) || !isByteLength(domain, {
      max: 256
    })) return !1;
    if (!isFDQN(domain, {
      require_tld: options.require_tld
    })) return !1;
    if ('"' === user[0]) {
      user = user.slice(1, user.length - 1);
      return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
    }
    var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
    var user_parts = user.split(".");
    for (var i = 0; i < user_parts.length; i++) if (!pattern.test(user_parts[i])) return !1;
    return !0;
  }
  function isIP(str) {
    var version = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1];
    assertString(str);
    version = String(version);
    if (!version) return isIP(str, 4) || isIP(str, 6);
    if ("4" === version) {
      if (!ipv4Maybe.test(str)) return !1;
      var parts = str.split(".").sort(function(a, b) {
        return a - b;
      });
      return parts[3] <= 255;
    }
    if ("6" === version) {
      var blocks = str.split(":");
      var foundOmissionBlock = !1;
      var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
      var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;
      if (blocks.length > expectedNumberOfBlocks) return !1;
      if ("::" === str) return !0;
      if ("::" === str.substr(0, 2)) {
        blocks.shift();
        blocks.shift();
        foundOmissionBlock = !0;
      } else if ("::" === str.substr(str.length - 2)) {
        blocks.pop();
        blocks.pop();
        foundOmissionBlock = !0;
      }
      for (var i = 0; i < blocks.length; ++i) if ("" === blocks[i] && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) return !1;
        foundOmissionBlock = !0;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) return !1;
      return foundOmissionBlock ? blocks.length >= 1 : blocks.length === expectedNumberOfBlocks;
    }
    return !1;
  }
  function isURL(url, options) {
    assertString(url);
    if (!url || url.length >= 2083 || /\s/.test(url)) return !1;
    if (0 === url.indexOf("mailto:")) return !1;
    options = merge(options, default_url_options);
    var protocol = void 0, auth = void 0, host = void 0, hostname = void 0, port = void 0, port_str = void 0, split = void 0;
    split = url.split("://");
    if (split.length > 1) {
      protocol = split.shift();
      if (options.require_valid_protocol && -1 === options.protocols.indexOf(protocol)) return !1;
    } else {
      if (options.require_protocol) return !1;
      options.allow_protocol_relative_urls && "//" === url.substr(0, 2) && (split[0] = url.substr(2));
    }
    url = split.join("://");
    split = url.split("#");
    url = split.shift();
    split = url.split("?");
    url = split.shift();
    split = url.split("/");
    url = split.shift();
    split = url.split("@");
    if (split.length > 1) {
      auth = split.shift();
      if (auth.indexOf(":") >= 0 && auth.split(":").length > 2) return !1;
    }
    hostname = split.join("@");
    split = hostname.split(":");
    host = split.shift();
    if (split.length) {
      port_str = split.join(":");
      port = parseInt(port_str, 10);
      if (!/^[0-9]+$/.test(port_str) || 0 >= port || port > 65535) return !1;
    }
    return isIP(host) || isFDQN(host, options) || "localhost" === host ? options.host_whitelist && -1 === options.host_whitelist.indexOf(host) ? !1 : options.host_blacklist && -1 !== options.host_blacklist.indexOf(host) ? !1 : !0 : !1;
  }
  function isMACAddress(str) {
    assertString(str);
    return macAddress.test(str);
  }
  function isBoolean(str) {
    assertString(str);
    return [ "true", "false", "1", "0" ].indexOf(str) >= 0;
  }
  function isAlpha(str) {
    var locale = arguments.length <= 1 || void 0 === arguments[1] ? "en-US" : arguments[1];
    assertString(str);
    if (locale in alpha) return alpha[locale].test(str);
    throw new Error("Invalid locale '" + locale + "'");
  }
  function isAlphanumeric(str) {
    var locale = arguments.length <= 1 || void 0 === arguments[1] ? "en-US" : arguments[1];
    assertString(str);
    if (locale in alphanumeric) return alphanumeric[locale].test(str);
    throw new Error("Invalid locale '" + locale + "'");
  }
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
  function isAscii(str) {
    assertString(str);
    return ascii.test(str);
  }
  function isFullWidth(str) {
    assertString(str);
    return fullWidth.test(str);
  }
  function isHalfWidth(str) {
    return halfWidth.test(str);
  }
  function isVariableWidth(str) {
    assertString(str);
    return fullWidth.test(str) && halfWidth.test(str);
  }
  function isMultibyte(str) {
    assertString(str);
    return multibyte.test(str);
  }
  function isSurrogatePair(str) {
    assertString(str);
    return surrogatePair.test(str);
  }
  function isInt(str, options) {
    assertString(str);
    options = options || {};
    return int.test(str) && (!options.hasOwnProperty("min") || str >= options.min) && (!options.hasOwnProperty("max") || str <= options.max);
  }
  function isFloat(str, options) {
    assertString(str);
    options = options || {};
    return "" === str || "." === str ? !1 : float.test(str) && (!options.hasOwnProperty("min") || str >= options.min) && (!options.hasOwnProperty("max") || str <= options.max);
  }
  function isDecimal(str) {
    assertString(str);
    return "" !== str && decimal.test(str);
  }
  function isHexadecimal(str) {
    assertString(str);
    return hexadecimal.test(str);
  }
  function isDivisibleBy(str, num) {
    assertString(str);
    return toFloat(str) % parseInt(num, 10) === 0;
  }
  function isHexColor(str) {
    assertString(str);
    return hexcolor.test(str);
  }
  function isJSON(str) {
    assertString(str);
    try {
      var obj = JSON.parse(str);
      return !!obj && "object" === ("undefined" == typeof obj ? "undefined" : babelHelpers["typeof"](obj));
    } catch (e) {}
    return !1;
  }
  function isNull(str) {
    assertString(str);
    return 0 === str.length;
  }
  function isLength(str, options) {
    assertString(str);
    var min = void 0;
    var max = void 0;
    if ("object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options))) {
      min = options.min || 0;
      max = options.max;
    } else {
      min = arguments[1];
      max = arguments[2];
    }
    var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    var len = str.length - surrogatePairs.length;
    return len >= min && ("undefined" == typeof max || max >= len);
  }
  function isUUID(str) {
    var version = arguments.length <= 1 || void 0 === arguments[1] ? "all" : arguments[1];
    assertString(str);
    var pattern = uuid[version];
    return pattern && pattern.test(str);
  }
  function isMongoId(str) {
    assertString(str);
    return isHexadecimal(str) && 24 === str.length;
  }
  function isISO8601(str) {
    assertString(str);
    return iso8601.test(str);
  }
  function getTimezoneOffset(str) {
    var iso8601Parts = str.match(iso8601);
    var timezone = void 0, sign = void 0, hours = void 0, minutes = void 0;
    if (iso8601Parts) {
      timezone = iso8601Parts[21];
      if (!timezone) return iso8601Parts[12] ? null : 0;
      if ("z" === timezone || "Z" === timezone) return 0;
      sign = iso8601Parts[22];
      if (-1 !== timezone.indexOf(":")) {
        hours = parseInt(iso8601Parts[23], 10);
        minutes = parseInt(iso8601Parts[24], 10);
      } else {
        hours = 0;
        minutes = parseInt(iso8601Parts[23], 10);
      }
    } else {
      str = str.toLowerCase();
      timezone = str.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/);
      if (!timezone) return -1 !== str.indexOf("gmt") ? 0 : null;
      sign = timezone[1];
      var offset = timezone[2];
      3 === offset.length && (offset = "0" + offset);
      if (offset.length <= 2) {
        hours = 0;
        minutes = parseInt(offset, 10);
      } else {
        hours = parseInt(offset.slice(0, 2), 10);
        minutes = parseInt(offset.slice(2, 4), 10);
      }
    }
    return (60 * hours + minutes) * ("-" === sign ? 1 : -1);
  }
  function isDate(str) {
    assertString(str);
    var normalizedDate = new Date(Date.parse(str));
    if (isNaN(normalizedDate)) return !1;
    var timezoneOffset = getTimezoneOffset(str);
    if (null !== timezoneOffset) {
      var timezoneDifference = normalizedDate.getTimezoneOffset() - timezoneOffset;
      normalizedDate = new Date(normalizedDate.getTime() + 6e4 * timezoneDifference);
    }
    var day = String(normalizedDate.getDate());
    var dayOrYear = void 0;
    var dayOrYearMatches = void 0;
    var year = void 0;
    dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g);
    if (!dayOrYearMatches) return !0;
    dayOrYear = dayOrYearMatches.map(function(digitString) {
      return digitString.match(/\d+/g)[0];
    }).join("/");
    year = String(normalizedDate.getFullYear()).slice(-2);
    return dayOrYear === day || dayOrYear === year ? !0 : dayOrYear === "" + day / year || dayOrYear === "" + year / day ? !0 : !1;
  }
  function isAfter(str) {
    var date = arguments.length <= 1 || void 0 === arguments[1] ? new Date() : arguments[1];
    assertString(str);
    var comparison = toDate(date);
    var original = toDate(str);
    return !!(original && comparison && original > comparison);
  }
  function isBefore(str, date) {
    assertString(str);
    var comparison = toDate(date || new Date());
    var original = toDate(str);
    return !!(original && comparison && comparison > original);
  }
  function isIn(str, options) {
    assertString(str);
    var i = void 0;
    if ("[object Array]" === Object.prototype.toString.call(options)) {
      var array = [];
      for (i in options) ({}).hasOwnProperty.call(options, i) && (array[i] = toString(options[i]));
      return array.indexOf(str) >= 0;
    }
    return "object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options)) ? options.hasOwnProperty(str) : options && "function" == typeof options.indexOf ? options.indexOf(str) >= 0 : !1;
  }
  function isCreditCard(str) {
    assertString(str);
    var sanitized = str.replace(/[^0-9]+/g, "");
    if (!creditCard.test(sanitized)) return !1;
    var sum = 0;
    var digit = void 0;
    var tmpNum = void 0;
    var shouldDouble = void 0;
    for (var i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        sum += tmpNum >= 10 ? tmpNum % 10 + 1 : tmpNum;
      } else sum += tmpNum;
      shouldDouble = !shouldDouble;
    }
    return !!(sum % 10 === 0 ? sanitized : !1);
  }
  function isISIN(str) {
    assertString(str);
    if (!isin.test(str)) return !1;
    var checksumStr = str.replace(/[A-Z]/g, function(character) {
      return parseInt(character, 36);
    });
    var sum = 0;
    var digit = void 0;
    var tmpNum = void 0;
    var shouldDouble = !0;
    for (var i = checksumStr.length - 2; i >= 0; i--) {
      digit = checksumStr.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        sum += tmpNum >= 10 ? tmpNum + 1 : tmpNum;
      } else sum += tmpNum;
      shouldDouble = !shouldDouble;
    }
    return parseInt(str.substr(str.length - 1), 10) === (1e4 - sum) % 10;
  }
  function isISBN(str) {
    var version = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1];
    assertString(str);
    version = String(version);
    if (!version) return isISBN(str, 10) || isISBN(str, 13);
    var sanitized = str.replace(/[\s-]+/g, "");
    var checksum = 0;
    var i = void 0;
    if ("10" === version) {
      if (!isbn10Maybe.test(sanitized)) return !1;
      for (i = 0; 9 > i; i++) checksum += (i + 1) * sanitized.charAt(i);
      checksum += "X" === sanitized.charAt(9) ? 100 : 10 * sanitized.charAt(9);
      if (checksum % 11 === 0) return !!sanitized;
    } else if ("13" === version) {
      if (!isbn13Maybe.test(sanitized)) return !1;
      for (i = 0; 12 > i; i++) checksum += factor[i % 2] * sanitized.charAt(i);
      if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) return !!sanitized;
    }
    return !1;
  }
  function isMobilePhone(str, locale) {
    assertString(str);
    return locale in phones ? phones[locale].test(str) : !1;
  }
  function currencyRegex(options) {
    var symbol = "(\\" + options.symbol.replace(/\./g, "\\.") + ")" + (options.require_symbol ? "" : "?"), negative = "-?", whole_dollar_amount_without_sep = "[1-9]\\d*", whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\" + options.thousands_separator + "\\d{3})*", valid_whole_dollar_amounts = [ "0", whole_dollar_amount_without_sep, whole_dollar_amount_with_sep ], whole_dollar_amount = "(" + valid_whole_dollar_amounts.join("|") + ")?", decimal_amount = "(\\" + options.decimal_separator + "\\d{2})?";
    var pattern = whole_dollar_amount + decimal_amount;
    options.allow_negatives && !options.parens_for_negatives && (options.negative_sign_after_digits ? pattern += negative : options.negative_sign_before_digits && (pattern = negative + pattern));
    options.allow_negative_sign_placeholder ? pattern = "( (?!\\-))?" + pattern : options.allow_space_after_symbol ? pattern = " ?" + pattern : options.allow_space_after_digits && (pattern += "( (?!$))?");
    options.symbol_after_digits ? pattern += symbol : pattern = symbol + pattern;
    options.allow_negatives && (options.parens_for_negatives ? pattern = "(\\(" + pattern + "\\)|" + pattern + ")" : options.negative_sign_before_digits || options.negative_sign_after_digits || (pattern = negative + pattern));
    return new RegExp("^(?!-? )(?=.*\\d)" + pattern + "$");
  }
  function isCurrency(str, options) {
    assertString(str);
    options = merge(options, default_currency_options);
    return currencyRegex(options).test(str);
  }
  function isBase64(str) {
    assertString(str);
    return base64.test(str);
  }
  function ltrim(str, chars) {
    assertString(str);
    var pattern = chars ? new RegExp("^[" + chars + "]+", "g") : /^\s+/g;
    return str.replace(pattern, "");
  }
  function rtrim(str, chars) {
    assertString(str);
    var pattern = chars ? new RegExp("[" + chars + "]+$", "g") : /\s+$/g;
    return str.replace(pattern, "");
  }
  function trim(str, chars) {
    assertString(str);
    var pattern = chars ? new RegExp("^[" + chars + "]+|[" + chars + "]+$", "g") : /^\s+|\s+$/g;
    return str.replace(pattern, "");
  }
  function escape(str) {
    assertString(str);
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;").replace(/\`/g, "&#96;");
  }
  function blacklist(str, chars) {
    assertString(str);
    return str.replace(new RegExp("[" + chars + "]+", "g"), "");
  }
  function stripLow(str, keep_new_lines) {
    assertString(str);
    var chars = keep_new_lines ? "\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F" : "\\x00-\\x1F\\x7F";
    return blacklist(str, chars);
  }
  function whitelist(str, chars) {
    assertString(str);
    return str.replace(new RegExp("[^" + chars + "]+", "g"), "");
  }
  function isWhitelisted(str, chars) {
    assertString(str);
    for (var i = str.length - 1; i >= 0; i--) if (-1 === chars.indexOf(str[i])) return !1;
    return !0;
  }
  function normalizeEmail(email, options) {
    options = merge(options, default_normalize_email_options);
    if (!isEmail(email)) return !1;
    var parts = email.split("@", 2);
    parts[1] = parts[1].toLowerCase();
    if ("gmail.com" === parts[1] || "googlemail.com" === parts[1]) {
      options.remove_extension && (parts[0] = parts[0].split("+")[0]);
      options.remove_dots && (parts[0] = parts[0].replace(/\./g, ""));
      if (!parts[0].length) return !1;
      parts[0] = parts[0].toLowerCase();
      parts[1] = "gmail.com";
    } else options.lowercase && (parts[0] = parts[0].toLowerCase());
    return parts.join("@");
  }
  var babelHelpers = {};
  babelHelpers["typeof"] = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
  };
  var default_fqdn_options = {
    require_tld: !0,
    allow_underscores: !1,
    allow_trailing_dot: !1
  };
  var default_email_options = {
    allow_display_name: !1,
    allow_utf8_local_part: !0,
    require_tld: !0
  };
  var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
  var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
  var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
  var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
  var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
  var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  var ipv6Block = /^[0-9A-F]{1,4}$/i;
  var default_url_options = {
    protocols: [ "http", "https", "ftp" ],
    require_tld: !0,
    require_protocol: !1,
    require_valid_protocol: !0,
    allow_underscores: !1,
    allow_trailing_dot: !1,
    allow_protocol_relative_urls: !1
  };
  var macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
  var alpha = {
    "en-US": /^[A-Z]+$/i,
    "de-DE": /^[A-ZÄÖÜß]+$/i,
    "es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
    "fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
    "nl-NL": /^[A-ZÉËÏÓÖÜ]+$/i,
    "pt-PT": /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i
  };
  var alphanumeric = {
    "en-US": /^[0-9A-Z]+$/i,
    "de-DE": /^[0-9A-ZÄÖÜß]+$/i,
    "es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
    "fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
    "nl-NL": /^[0-9A-ZÉËÏÓÖÜ]+$/i,
    "pt-PT": /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i
  };
  var englishLocales = [ "AU", "GB", "HK", "IN", "NZ", "ZA", "ZM" ];
  for (var locale, i = 0; i < englishLocales.length; i++) {
    locale = "en-" + englishLocales[i];
    alpha[locale] = alpha["en-US"];
    alphanumeric[locale] = alphanumeric["en-US"];
  }
  var numeric = /^[-+]?[0-9]+$/;
  var ascii = /^[\x00-\x7F]+$/;
  var fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
  var halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
  var multibyte = /[^\x00-\x7F]/;
  var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
  var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
  var float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
  var decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/;
  var hexadecimal = /^[0-9A-F]+$/i;
  var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
  var uuid = {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  };
  var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
  var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;
  var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
  var isbn13Maybe = /^(?:[0-9]{13})$/;
  var factor = [ 1, 3 ];
  var phones = {
    "en-US": /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
    "de-DE": /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
    "el-GR": /^(\+?30)?(69\d{8})$/,
    "en-AU": /^(\+?61|0)4\d{8}$/,
    "en-GB": /^(\+?44|0)7\d{9}$/,
    "en-HK": /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
    "en-IN": /^(\+?91|0)?[789]\d{9}$/,
    "en-NZ": /^(\+?64|0)2\d{7,9}$/,
    "en-ZA": /^(\+?27|0)\d{9}$/,
    "en-ZM": /^(\+?26)?09[567]\d{7}$/,
    "es-ES": /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
    "fi-FI": /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
    "fr-FR": /^(\+?33|0)[67]\d{8}$/,
    "nb-NO": /^(\+?47)?[49]\d{7}$/,
    "nn-NO": /^(\+?47)?[49]\d{7}$/,
    "pt-BR": /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
    "pt-PT": /^(\+?351)?9[1236]\d{7}$/,
    "ru-RU": /^(\+?7|8)?9\d{9}$/,
    "vi-VN": /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
    "zh-CN": /^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/,
    "zh-TW": /^(\+?886\-?|0)?9\d{8}$/
  };
  var default_currency_options = {
    symbol: "$",
    require_symbol: !1,
    allow_space_after_symbol: !1,
    symbol_after_digits: !1,
    allow_negatives: !0,
    parens_for_negatives: !1,
    negative_sign_before_digits: !1,
    negative_sign_after_digits: !1,
    allow_negative_sign_placeholder: !1,
    thousands_separator: ",",
    decimal_separator: ".",
    allow_space_after_digits: !1
  };
  var base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
  var default_normalize_email_options = {
    lowercase: !0,
    remove_dots: !0,
    remove_extension: !0
  };
  var version = "4.8.0";
  var validator = {
    version: version,
    toDate: toDate,
    toFloat: toFloat,
    toInt: toInt,
    toBoolean: toBoolean,
    equals: equals,
    contains: contains,
    matches: matches,
    isEmail: isEmail,
    isURL: isURL,
    isMACAddress: isMACAddress,
    isIP: isIP,
    isFQDN: isFDQN,
    isBoolean: isBoolean,
    isAlpha: isAlpha,
    isAlphanumeric: isAlphanumeric,
    isNumeric: isNumeric,
    isLowercase: isLowercase,
    isUppercase: isUppercase,
    isAscii: isAscii,
    isFullWidth: isFullWidth,
    isHalfWidth: isHalfWidth,
    isVariableWidth: isVariableWidth,
    isMultibyte: isMultibyte,
    isSurrogatePair: isSurrogatePair,
    isInt: isInt,
    isFloat: isFloat,
    isDecimal: isDecimal,
    isHexadecimal: isHexadecimal,
    isDivisibleBy: isDivisibleBy,
    isHexColor: isHexColor,
    isJSON: isJSON,
    isNull: isNull,
    isLength: isLength,
    isByteLength: isByteLength,
    isUUID: isUUID,
    isMongoId: isMongoId,
    isDate: isDate,
    isAfter: isAfter,
    isBefore: isBefore,
    isIn: isIn,
    isCreditCard: isCreditCard,
    isISIN: isISIN,
    isISBN: isISBN,
    isMobilePhone: isMobilePhone,
    isCurrency: isCurrency,
    isISO8601: isISO8601,
    isBase64: isBase64,
    ltrim: ltrim,
    rtrim: rtrim,
    trim: trim,
    escape: escape,
    stripLow: stripLow,
    whitelist: whitelist,
    blacklist: blacklist,
    isWhitelisted: isWhitelisted,
    normalizeEmail: normalizeEmail,
    toString: toString
  };
  return validator;
});