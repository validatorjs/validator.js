!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : global.validator = factory();
}(this, function() {
    "use strict";
    function assertString(input) {
        if ("string" != typeof input) throw new Error("this library validates strings only");
    }
    function toDate(date) {
        return "[object Date]" === Object.prototype.toString.call(date) ? date : (assertString(date), 
        date = Date.parse(date), isNaN(date) ? null : new Date(date));
    }
    function toFloat(str) {
        return assertString(str), parseFloat(str);
    }
    function toInt(str, radix) {
        return assertString(str), parseInt(str, radix || 10);
    }
    function toBoolean(str, strict) {
        return assertString(str), strict ? "1" === str || "true" === str : "0" !== str && "false" !== str && "" !== str;
    }
    function equals(str, comparison) {
        return assertString(str), str === comparison;
    }
    function toString(input) {
        return "object" === ("undefined" == typeof input ? "undefined" : babelHelpers["typeof"](input)) && null !== input ? input = "function" == typeof input.toString ? input.toString() : "[object Object]" : (null === input || "undefined" == typeof input || isNaN(input) && !input.length) && (input = ""), 
        String(input);
    }
    function contains(str, elem) {
        return assertString(str), str.indexOf(toString(elem)) >= 0;
    }
    function matches(str, pattern, modifiers) {
        return assertString(str), "[object RegExp]" !== Object.prototype.toString.call(pattern) && (pattern = new RegExp(pattern, modifiers)), 
        pattern.test(str);
    }
    function merge() {
        var obj = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0], defaults = arguments[1];
        for (var key in defaults) "undefined" == typeof obj[key] && (obj[key] = defaults[key]);
        return obj;
    }
    function isByteLength(str, options) {
        assertString(str);
        var min = void 0, max = void 0;
        "object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options)) ? (min = options.min || 0, 
        max = options.max) : (min = arguments[1], max = arguments[2]);
        var len = encodeURI(str).split(/%..|./).length - 1;
        return len >= min && ("undefined" == typeof max || max >= len);
    }
    function isFDQN(str, options) {
        assertString(str), options = merge(options, default_fqdn_options), options.allow_trailing_dot && "." === str[str.length - 1] && (str = str.substring(0, str.length - 1));
        var parts = str.split(".");
        if (options.require_tld) {
            var tld = parts.pop();
            if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) return !1;
        }
        for (var part, i = 0; i < parts.length; i++) {
            if (part = parts[i], options.allow_underscores) {
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
        if (assertString(str), options = merge(options, default_email_options), options.allow_display_name) {
            var display_email = str.match(displayName);
            display_email && (str = display_email[1]);
        }
        var parts = str.split("@"), domain = parts.pop(), user = parts.join("@"), lower_domain = domain.toLowerCase();
        if (("gmail.com" === lower_domain || "googlemail.com" === lower_domain) && (user = user.replace(/\./g, "").toLowerCase()), 
        !isByteLength(user, {
            max: 64
        }) || !isByteLength(domain, {
            max: 256
        })) return !1;
        if (!isFDQN(domain, {
            require_tld: options.require_tld
        })) return !1;
        if ('"' === user[0]) return user = user.slice(1, user.length - 1), options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
        for (var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart, user_parts = user.split("."), i = 0; i < user_parts.length; i++) if (!pattern.test(user_parts[i])) return !1;
        return !0;
    }
    function isIP(str) {
        var version = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1];
        if (assertString(str), version = String(version), !version) return isIP(str, 4) || isIP(str, 6);
        if ("4" === version) {
            if (!ipv4Maybe.test(str)) return !1;
            var parts = str.split(".").sort(function(a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        }
        if ("6" === version) {
            var blocks = str.split(":"), foundOmissionBlock = !1, foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4), expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;
            if (blocks.length > expectedNumberOfBlocks) return !1;
            if ("::" === str) return !0;
            "::" === str.substr(0, 2) ? (blocks.shift(), blocks.shift(), foundOmissionBlock = !0) : "::" === str.substr(str.length - 2) && (blocks.pop(), 
            blocks.pop(), foundOmissionBlock = !0);
            for (var i = 0; i < blocks.length; ++i) if ("" === blocks[i] && i > 0 && i < blocks.length - 1) {
                if (foundOmissionBlock) return !1;
                foundOmissionBlock = !0;
            } else if (foundIPv4TransitionBlock && i === blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) return !1;
            return foundOmissionBlock ? blocks.length >= 1 : blocks.length === expectedNumberOfBlocks;
        }
        return !1;
    }
    function isURL(url, options) {
        if (assertString(url), !url || url.length >= 2083 || /\s/.test(url)) return !1;
        if (0 === url.indexOf("mailto:")) return !1;
        options = merge(options, default_url_options);
        var protocol = void 0, auth = void 0, host = void 0, hostname = void 0, port = void 0, port_str = void 0, split = void 0;
        if (split = url.split("://"), split.length > 1) {
            if (protocol = split.shift(), options.require_valid_protocol && -1 === options.protocols.indexOf(protocol)) return !1;
        } else {
            if (options.require_protocol) return !1;
            options.allow_protocol_relative_urls && "//" === url.substr(0, 2) && (split[0] = url.substr(2));
        }
        return url = split.join("://"), split = url.split("#"), url = split.shift(), split = url.split("?"), 
        url = split.shift(), split = url.split("/"), url = split.shift(), split = url.split("@"), 
        split.length > 1 && (auth = split.shift(), auth.indexOf(":") >= 0 && auth.split(":").length > 2) ? !1 : (hostname = split.join("@"), 
        split = hostname.split(":"), host = split.shift(), split.length && (port_str = split.join(":"), 
        port = parseInt(port_str, 10), !/^[0-9]+$/.test(port_str) || 0 >= port || port > 65535) ? !1 : isIP(host) || isFDQN(host, options) || "localhost" === host ? options.host_whitelist && -1 === options.host_whitelist.indexOf(host) ? !1 : options.host_blacklist && -1 !== options.host_blacklist.indexOf(host) ? !1 : !0 : !1);
    }
    function isMACAddress(str) {
        return assertString(str), macAddress.test(str);
    }
    function isBoolean(str) {
        return assertString(str), [ "true", "false", "1", "0" ].indexOf(str) >= 0;
    }
    function isAlpha(str) {
        var locale = arguments.length <= 1 || void 0 === arguments[1] ? "en-US" : arguments[1];
        if (assertString(str), locale in alpha) return alpha[locale].test(str);
        throw new Error("Invalid locale '" + locale + "'");
    }
    function isAlphanumeric(str) {
        var locale = arguments.length <= 1 || void 0 === arguments[1] ? "en-US" : arguments[1];
        if (assertString(str), locale in alphanumeric) return alphanumeric[locale].test(str);
        throw new Error("Invalid locale '" + locale + "'");
    }
    function isNumeric(str) {
        return assertString(str), numeric.test(str);
    }
    function isLowercase(str) {
        return assertString(str), str === str.toLowerCase();
    }
    function isUppercase(str) {
        return assertString(str), str === str.toUpperCase();
    }
    function isAscii(str) {
        return assertString(str), ascii.test(str);
    }
    function isFullWidth(str) {
        return assertString(str), fullWidth.test(str);
    }
    function isHalfWidth(str) {
        return halfWidth.test(str);
    }
    function isVariableWidth(str) {
        return assertString(str), fullWidth.test(str) && halfWidth.test(str);
    }
    function isMultibyte(str) {
        return assertString(str), multibyte.test(str);
    }
    function isSurrogatePair(str) {
        return assertString(str), surrogatePair.test(str);
    }
    function isInt(str, options) {
        return assertString(str), options = options || {}, int.test(str) && (!options.hasOwnProperty("min") || str >= options.min) && (!options.hasOwnProperty("max") || str <= options.max);
    }
    function isFloat(str, options) {
        return assertString(str), options = options || {}, "" === str || "." === str ? !1 : float.test(str) && (!options.hasOwnProperty("min") || str >= options.min) && (!options.hasOwnProperty("max") || str <= options.max);
    }
    function isDecimal(str) {
        return assertString(str), "" !== str && decimal.test(str);
    }
    function isHexadecimal(str) {
        return assertString(str), hexadecimal.test(str);
    }
    function isDivisibleBy(str, num) {
        return assertString(str), toFloat(str) % parseInt(num, 10) === 0;
    }
    function isHexColor(str) {
        return assertString(str), hexcolor.test(str);
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
        return assertString(str), 0 === str.length;
    }
    function isLength(str, options) {
        assertString(str);
        var min = void 0, max = void 0;
        "object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options)) ? (min = options.min || 0, 
        max = options.max) : (min = arguments[1], max = arguments[2]);
        var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [], len = str.length - surrogatePairs.length;
        return len >= min && ("undefined" == typeof max || max >= len);
    }
    function isUUID(str) {
        var version = arguments.length <= 1 || void 0 === arguments[1] ? "all" : arguments[1];
        assertString(str);
        var pattern = uuid[version];
        return pattern && pattern.test(str);
    }
    function isMongoId(str) {
        return assertString(str), isHexadecimal(str) && 24 === str.length;
    }
    function isISO8601(str) {
        return assertString(str), iso8601.test(str);
    }
    function getTimezoneOffset(str) {
        var iso8601Parts = str.match(iso8601), timezone = void 0, sign = void 0, hours = void 0, minutes = void 0;
        if (iso8601Parts) {
            if (timezone = iso8601Parts[21], !timezone) return iso8601Parts[12] ? null : 0;
            if ("z" === timezone || "Z" === timezone) return 0;
            sign = iso8601Parts[22], -1 !== timezone.indexOf(":") ? (hours = parseInt(iso8601Parts[23], 10), 
            minutes = parseInt(iso8601Parts[24], 10)) : (hours = 0, minutes = parseInt(iso8601Parts[23], 10));
        } else {
            if (str = str.toLowerCase(), timezone = str.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/), 
            !timezone) return -1 !== str.indexOf("gmt") ? 0 : null;
            sign = timezone[1];
            var offset = timezone[2];
            3 === offset.length && (offset = "0" + offset), offset.length <= 2 ? (hours = 0, 
            minutes = parseInt(offset, 10)) : (hours = parseInt(offset.slice(0, 2), 10), minutes = parseInt(offset.slice(2, 4), 10));
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
        var day = String(normalizedDate.getDate()), dayOrYear = void 0, dayOrYearMatches = void 0, year = void 0;
        return (dayOrYearMatches = str.match(/(^|[^:\d])[23]\d([^:\d]|$)/g)) ? (dayOrYear = dayOrYearMatches.map(function(digitString) {
            return digitString.match(/\d+/g)[0];
        }).join("/"), year = String(normalizedDate.getFullYear()).slice(-2), dayOrYear === day || dayOrYear === year ? !0 : dayOrYear === "" + day / year || dayOrYear === "" + year / day ? !0 : !1) : !0;
    }
    function isAfter(str) {
        var date = arguments.length <= 1 || void 0 === arguments[1] ? new Date() : arguments[1];
        assertString(str);
        var comparison = toDate(date), original = toDate(str);
        return !!(original && comparison && original > comparison);
    }
    function isBefore(str, date) {
        assertString(str);
        var comparison = toDate(date || new Date()), original = toDate(str);
        return !!(original && comparison && comparison > original);
    }
    function isIn(str, options) {
        assertString(str);
        var i = void 0;
        if ("[object Array]" === Object.prototype.toString.call(options)) {
            var array = [];
            for (i in options) array[i] = toString(options[i]);
            return array.indexOf(str) >= 0;
        }
        return "object" === ("undefined" == typeof options ? "undefined" : babelHelpers["typeof"](options)) ? options.hasOwnProperty(str) : options && "function" == typeof options.indexOf ? options.indexOf(str) >= 0 : !1;
    }
    function isCreditCard(str) {
        assertString(str);
        var sanitized = str.replace(/[^0-9]+/g, "");
        if (!creditCard.test(sanitized)) return !1;
        for (var sum = 0, digit = void 0, tmpNum = void 0, shouldDouble = void 0, i = sanitized.length - 1; i >= 0; i--) digit = sanitized.substring(i, i + 1), 
        tmpNum = parseInt(digit, 10), shouldDouble ? (tmpNum *= 2, sum += tmpNum >= 10 ? tmpNum % 10 + 1 : tmpNum) : sum += tmpNum, 
        shouldDouble = !shouldDouble;
        return !!(sum % 10 === 0 ? sanitized : !1);
    }
    function isISIN(str) {
        if (assertString(str), !isin.test(str)) return !1;
        for (var checksumStr = str.replace(/[A-Z]/g, function(character) {
            return parseInt(character, 36);
        }), sum = 0, digit = void 0, tmpNum = void 0, shouldDouble = !0, i = checksumStr.length - 2; i >= 0; i--) digit = checksumStr.substring(i, i + 1), 
        tmpNum = parseInt(digit, 10), shouldDouble ? (tmpNum *= 2, sum += tmpNum >= 10 ? tmpNum + 1 : tmpNum) : sum += tmpNum, 
        shouldDouble = !shouldDouble;
        return parseInt(str.substr(str.length - 1), 10) === (1e4 - sum) % 10;
    }
    function isISBN(str) {
        var version = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1];
        if (assertString(str), version = String(version), !version) return isISBN(str, 10) || isISBN(str, 13);
        var sanitized = str.replace(/[\s-]+/g, ""), checksum = 0, i = void 0;
        if ("10" === version) {
            if (!isbn10Maybe.test(sanitized)) return !1;
            for (i = 0; 9 > i; i++) checksum += (i + 1) * sanitized.charAt(i);
            if (checksum += "X" === sanitized.charAt(9) ? 100 : 10 * sanitized.charAt(9), checksum % 11 === 0) return !!sanitized;
        } else if ("13" === version) {
            if (!isbn13Maybe.test(sanitized)) return !1;
            for (i = 0; 12 > i; i++) checksum += factor[i % 2] * sanitized.charAt(i);
            if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) return !!sanitized;
        }
        return !1;
    }
    function isMobilePhone(str, locale) {
        return assertString(str), locale in phones ? phones[locale].test(str) : !1;
    }
    function currencyRegex(options) {
        var symbol = "(\\" + options.symbol.replace(/\./g, "\\.") + ")" + (options.require_symbol ? "" : "?"), negative = "-?", whole_dollar_amount_without_sep = "[1-9]\\d*", whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\" + options.thousands_separator + "\\d{3})*", valid_whole_dollar_amounts = [ "0", whole_dollar_amount_without_sep, whole_dollar_amount_with_sep ], whole_dollar_amount = "(" + valid_whole_dollar_amounts.join("|") + ")?", decimal_amount = "(\\" + options.decimal_separator + "\\d{2})?", pattern = whole_dollar_amount + decimal_amount;
        return options.allow_negatives && !options.parens_for_negatives && (options.negative_sign_after_digits ? pattern += negative : options.negative_sign_before_digits && (pattern = negative + pattern)), 
        options.allow_negative_sign_placeholder ? pattern = "( (?!\\-))?" + pattern : options.allow_space_after_symbol ? pattern = " ?" + pattern : options.allow_space_after_digits && (pattern += "( (?!$))?"), 
        options.symbol_after_digits ? pattern += symbol : pattern = symbol + pattern, options.allow_negatives && (options.parens_for_negatives ? pattern = "(\\(" + pattern + "\\)|" + pattern + ")" : options.negative_sign_before_digits || options.negative_sign_after_digits || (pattern = negative + pattern)), 
        new RegExp("^(?!-? )(?=.*\\d)" + pattern + "$");
    }
    function isCurrency(str, options) {
        return assertString(str), options = merge(options, default_currency_options), currencyRegex(options).test(str);
    }
    function isBase64(str) {
        return assertString(str), base64.test(str);
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
        return assertString(str), str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;").replace(/\`/g, "&#96;");
    }
    function blacklist(str, chars) {
        return assertString(str), str.replace(new RegExp("[" + chars + "]+", "g"), "");
    }
    function stripLow(str, keep_new_lines) {
        assertString(str);
        var chars = keep_new_lines ? "\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F" : "\\x00-\\x1F\\x7F";
        return blacklist(str, chars);
    }
    function whitelist(str, chars) {
        return assertString(str), str.replace(new RegExp("[^" + chars + "]+", "g"), "");
    }
    function isWhitelisted(str, chars) {
        assertString(str);
        for (var i = str.length - 1; i >= 0; i--) if (-1 === chars.indexOf(str[i])) return !1;
        return !0;
    }
    function normalizeEmail(email, options) {
        if (options = merge(options, default_normalize_email_options), !isEmail(email)) return !1;
        var parts = email.split("@", 2);
        if (parts[1] = parts[1].toLowerCase(), "gmail.com" === parts[1] || "googlemail.com" === parts[1]) {
            if (options.remove_extension && (parts[0] = parts[0].split("+")[0]), options.remove_dots && (parts[0] = parts[0].replace(/\./g, "")), 
            !parts[0].length) return !1;
            parts[0] = parts[0].toLowerCase(), parts[1] = "gmail.com";
        } else options.lowercase && (parts[0] = parts[0].toLowerCase());
        return parts.join("@");
    }
    var babelHelpers = {};
    babelHelpers["typeof"] = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
    for (var locale, default_fqdn_options = {
        require_tld: !0,
        allow_underscores: !1,
        allow_trailing_dot: !1
    }, default_email_options = {
        allow_display_name: !1,
        allow_utf8_local_part: !0,
        require_tld: !0
    }, displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i, emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i, quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i, emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i, quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i, ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, ipv6Block = /^[0-9A-F]{1,4}$/i, default_url_options = {
        protocols: [ "http", "https", "ftp" ],
        require_tld: !0,
        require_protocol: !1,
        require_valid_protocol: !0,
        allow_underscores: !1,
        allow_trailing_dot: !1,
        allow_protocol_relative_urls: !1
    }, macAddress = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/, alpha = {
        "en-US": /^[A-Z]+$/i,
        "de-DE": /^[A-ZÄÖÜß]+$/i,
        "es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
        "fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        "nl-NL": /^[A-ZÉËÏÓÖÜ]+$/i,
        "pt-PT": /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i
    }, alphanumeric = {
        "en-US": /^[0-9A-Z]+$/i,
        "de-DE": /^[0-9A-ZÄÖÜß]+$/i,
        "es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
        "fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
        "nl-NL": /^[0-9A-ZÉËÏÓÖÜ]+$/i,
        "pt-PT": /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i
    }, englishLocales = [ "AU", "GB", "HK", "IN", "NZ", "ZA", "ZM" ], i = 0; i < englishLocales.length; i++) locale = "en-" + englishLocales[i], 
    alpha[locale] = alpha["en-US"], alphanumeric[locale] = alphanumeric["en-US"];
    var numeric = /^[-+]?[0-9]+$/, ascii = /^[\x00-\x7F]+$/, fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/, halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/, multibyte = /[^\x00-\x7F]/, surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/, int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/, float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/, decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/, hexadecimal = /^[0-9A-F]+$/i, hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i, uuid = {
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    }, iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/, isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/, isbn13Maybe = /^(?:[0-9]{13})$/, factor = [ 1, 3 ], phones = {
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
    }, default_currency_options = {
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
    }, base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i, default_normalize_email_options = {
        lowercase: !0,
        remove_dots: !0,
        remove_extension: !0
    }, version = "5.0.0", validator = {
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