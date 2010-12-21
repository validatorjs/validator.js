/*!
 * Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>
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

(function(exports) {

    var entities = {
        '&nbsp;': ' ',
        '&iexcl;': '¡',
        '&cent;': '¢',
        '&pound;': '£',
        '&curren;': '€',
        '&yen;': '¥',
        '&brvbar;': 'Š',
        '&sect;': '§',
        '&uml;': 'š',
        '&copy;': '©',
        '&ordf;': 'ª',
        '&laquo;': '«',
        '&not;': '¬',
        '&shy;': '­',
        '&reg;': '®',
        '&macr;': '¯',
        '&deg;': '°',
        '&plusmn;': '±',
        '&sup2;': '²',
        '&sup3;': '³',
        '&acute;': 'Ž',
        '&micro;': 'µ',
        '&para;': '¶',
        '&middot;': '·',
        '&cedil;': 'ž',
        '&sup1;': '¹',
        '&ordm;': 'º',
        '&raquo;': '»',
        '&frac14;': 'Œ',
        '&frac12;': 'œ',
        '&frac34;': 'Ÿ',
        '&iquest;': '¿',
        '&Agrave;': 'À',
        '&Aacute;': 'Á',
        '&Acirc;': 'Â',
        '&Atilde;': 'Ã',
        '&Auml;': 'Ä',
        '&Aring;': 'Å',
        '&AElig;': 'Æ',
        '&Ccedil;': 'Ç',
        '&Egrave;': 'È',
        '&Eacute;': 'É',
        '&Ecirc;': 'Ê',
        '&Euml;': 'Ë',
        '&Igrave;': 'Ì',
        '&Iacute;': 'Í',
        '&Icirc;': 'Î',
        '&Iuml;': 'Ï',
        '&ETH;': 'Ð',
        '&Ntilde;': 'Ñ',
        '&Ograve;': 'Ò',
        '&Oacute;': 'Ó',
        '&Ocirc;': 'Ô',
        '&Otilde;': 'Õ',
        '&Ouml;': 'Ö',
        '&times;': '×',
        '&Oslash;': 'Ø',
        '&Ugrave;': 'Ù',
        '&Uacute;': 'Ú',
        '&Ucirc;': 'Û',
        '&Uuml;': 'Ü',
        '&Yacute;': 'Ý',
        '&THORN;': 'Þ',
        '&szlig;': 'ß',
        '&agrave;': 'à',
        '&aacute;': 'á',
        '&acirc;': 'â',
        '&atilde;': 'ã',
        '&auml;': 'ä',
        '&aring;': 'å',
        '&aelig;': 'æ',
        '&ccedil;': 'ç',
        '&egrave;': 'è',
        '&eacute;': 'é',
        '&ecirc;': 'ê',
        '&euml;': 'ë',
        '&igrave;': 'ì',
        '&iacute;': 'í',
        '&icirc;': 'î',
        '&iuml;': 'ï',
        '&eth;': 'ð',
        '&ntilde;': 'ñ',
        '&ograve;': 'ò',
        '&oacute;': 'ó',
        '&ocirc;': 'ô',
        '&otilde;': 'õ',
        '&ouml;': 'ö',
        '&divide;': '÷',
        '&oslash;': 'ø',
        '&ugrave;': 'ù',
        '&uacute;': 'ú',
        '&ucirc;': 'û',
        '&uuml;': 'ü',
        '&yacute;': 'ý',
        '&thorn;': 'þ',
        '&yuml;': '&#255;',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&apos;': '&#39;',
        '&minus;': '&#8722;',
        '&circ;': '&#710;',
        '&tilde;': '&#732;',
        '&Scaron;': '&#352;',
        '&lsaquo;': '&#8249;',
        '&OElig;': '&#338;',
        '&lsquo;': '&#8216;',
        '&rsquo;': '&#8217;',
        '&ldquo;': '&#8220;',
        '&rdquo;': '&#8221;',
        '&bull;': '&#8226;',
        '&ndash;': '&#8211;',
        '&mdash;': '&#8212;',
        '&trade;': '&#8482;',
        '&scaron;': '&#353;',
        '&rsaquo;': '&#8250;',
        '&oelig;': '&#339;',
        '&Yuml;': '&#376;',
        '&fnof;': '&#402;',
        '&Alpha;': '&#913;',
        '&Beta;': '&#914;',
        '&Gamma;': '&#915;',
        '&Delta;': '&#916;',
        '&Epsilon;': '&#917;',
        '&Zeta;': '&#918;',
        '&Eta;': '&#919;',
        '&Theta;': '&#920;',
        '&Iota;': '&#921;',
        '&Kappa;': '&#922;',
        '&Lambda;': '&#923;',
        '&Mu;': '&#924;',
        '&Nu;': '&#925;',
        '&Xi;': '&#926;',
        '&Omicron;': '&#927;',
        '&Pi;': '&#928;',
        '&Rho;': '&#929;',
        '&Sigma;': '&#931;',
        '&Tau;': '&#932;',
        '&Upsilon;': '&#933;',
        '&Phi;': '&#934;',
        '&Chi;': '&#935;',
        '&Psi;': '&#936;',
        '&Omega;': '&#937;',
        '&alpha;': '&#945;',
        '&beta;': '&#946;',
        '&gamma;': '&#947;',
        '&delta;': '&#948;',
        '&epsilon;': '&#949;',
        '&zeta;': '&#950;',
        '&eta;': '&#951;',
        '&theta;': '&#952;',
        '&iota;': '&#953;',
        '&kappa;': '&#954;',
        '&lambda;': '&#955;',
        '&mu;': '&#956;',
        '&nu;': '&#957;',
        '&xi;': '&#958;',
        '&omicron;': '&#959;',
        '&pi;': '&#960;',
        '&rho;': '&#961;',
        '&sigmaf;': '&#962;',
        '&sigma;': '&#963;',
        '&tau;': '&#964;',
        '&upsilon;': '&#965;',
        '&phi;': '&#966;',
        '&chi;': '&#967;',
        '&psi;': '&#968;',
        '&omega;': '&#969;',
        '&thetasym;': '&#977;',
        '&upsih;': '&#978;',
        '&piv;': '&#982;',
        '&ensp;': '&#8194;',
        '&emsp;': '&#8195;',
        '&thinsp;': '&#8201;',
        '&zwnj;': '&#8204;',
        '&zwj;': '&#8205;',
        '&lrm;': '&#8206;',
        '&rlm;': '&#8207;',
        '&sbquo;': '&#8218;',
        '&bdquo;': '&#8222;',
        '&dagger;': '&#8224;',
        '&Dagger;': '&#8225;',
        '&hellip;': '&#8230;',
        '&permil;': '&#8240;',
        '&prime;': '&#8242;',
        '&Prime;': '&#8243;',
        '&oline;': '&#8254;',
        '&frasl;': '&#8260;',
        '&euro;': '&#8364;',
        '&image;': '&#8465;',
        '&weierp;': '&#8472;',
        '&real;': '&#8476;',
        '&alefsym;': '&#8501;',
        '&larr;': '&#8592;',
        '&uarr;': '&#8593;',
        '&rarr;': '&#8594;',
        '&darr;': '&#8595;',
        '&harr;': '&#8596;',
        '&crarr;': '&#8629;',
        '&lArr;': '&#8656;',
        '&uArr;': '&#8657;',
        '&rArr;': '&#8658;',
        '&dArr;': '&#8659;',
        '&hArr;': '&#8660;',
        '&forall;': '&#8704;',
        '&part;': '&#8706;',
        '&exist;': '&#8707;',
        '&empty;': '&#8709;',
        '&nabla;': '&#8711;',
        '&isin;': '&#8712;',
        '&notin;': '&#8713;',
        '&ni;': '&#8715;',
        '&prod;': '&#8719;',
        '&sum;': '&#8721;',
        '&lowast;': '&#8727;',
        '&radic;': '&#8730;',
        '&prop;': '&#8733;',
        '&infin;': '&#8734;',
        '&ang;': '&#8736;',
        '&and;': '&#8743;',
        '&or;': '&#8744;',
        '&cap;': '&#8745;',
        '&cup;': '&#8746;',
        '&int;': '&#8747;',
        '&there4;': '&#8756;',
        '&sim;': '&#8764;',
        '&cong;': '&#8773;',
        '&asymp;': '&#8776;',
        '&ne;': '&#8800;',
        '&equiv;': '&#8801;',
        '&le;': '&#8804;',
        '&ge;': '&#8805;',
        '&sub;': '&#8834;',
        '&sup;': '&#8835;',
        '&nsub;': '&#8836;',
        '&sube;': '&#8838;',
        '&supe;': '&#8839;',
        '&oplus;': '&#8853;',
        '&otimes;': '&#8855;',
        '&perp;': '&#8869;',
        '&sdot;': '&#8901;',
        '&lceil;': '&#8968;',
        '&rceil;': '&#8969;',
        '&lfloor;': '&#8970;',
        '&rfloor;': '&#8971;',
        '&lang;': '&#9001;',
        '&rang;': '&#9002;',
        '&loz;': '&#9674;',
        '&spades;': '&#9824;',
        '&clubs;': '&#9827;',
        '&hearts;': '&#9829;',
        '&diams;': '&#9830;'
    };

    var decode = function (str) {
        if (!~str.indexOf('&')) return str;
        
        //Decode literal entities
        for (var i in entities) {
            str = str.replace(new RegExp(i, 'g'), entities[i]); 
        }
        
        str = str.replace('&nbsp;', ' '); 
        
        //Decode hex entities
        str = str.replace(/&#x(0*[0-9a-f]{2,5});?/gi, function (m, code) {
            return String.fromCharCode(parseInt(+code, 16));
        });
        
        //Decode numeric entities
        str = str.replace(/&#([0-9]{2,4});?/gi, function (m, code) {
            return String.fromCharCode(+code);
        });

        str = str.replace(/&amp;/g, '&'); 
        
        return str;
    }

    var encode = function (str) {
        str = str.replace(/&/g, '&amp;');
        
        //Encode literal entities
        for (var i in entities) {
            str = str.replace(new RegExp(entities[i], 'g'), i);
        }
                
        return str;
    }

    exports.entities = {
        encode: encode,
        decode: decode
    }

    //This module is adapted from the CodeIgniter framework
    //The license is available at http://codeigniter.com/

    var never_allowed_str = {
        'document.cookie':              '[removed]',
        'document.write':               '[removed]',
        '.parentNode':                  '[removed]',
        '.innerHTML':                   '[removed]',
        'window.location':              '[removed]',
        '-moz-binding':                 '[removed]',
        '<!--':                         '&lt;!--',
        '-->':                          '--&gt;',
        '<![CDATA[':                    '&lt;![CDATA['
    };

    var never_allowed_regex = {
        'javascript\\s*:':              '[removed]',
        'expression\\s*(\\(|&\\#40;)':  '[removed]',
        'vbscript\\s*:':                '[removed]',
        'Redirect\\s+302':              '[removed]'
    };

    var non_displayables = [
        /%0[0-8bcef]/g,			// url encoded 00-08, 11, 12, 14, 15
        /%1[0-9a-f]/g,			// url encoded 16-31
        /[\x00-\x08]/g,			// 00-08
        /\x0b/g, /\x0c/g,		// 11,12
        /[\x0e-\x1f]/g			// 14-31
    ];

    var compact_words = [
        'javascript', 'expression', 'vbscript', 
        'script', 'applet', 'alert', 'document', 
        'write', 'cookie', 'window'
    ];

    exports.xssClean = function(str, is_image) {
        
        //Recursively clean objects and arrays
        if (typeof str === 'array' || typeof str === 'object') {
            for (var i in str) {
                str[i] = xssClean(str[i]);
            }
            return str;
        }
        
        //Remove invisible characters
        str = remove_invisible_characters(str);
        
        //Protect query string variables in URLs => 901119URL5918AMP18930PROTECT8198
        str = str.replace(/\&([a-z\_0-9]+)\=([a-z\_0-9]+)/i, xss_hash() + '$1=$2');
        
        //Validate standard character entities - add a semicolon if missing.  We do this to enable
        //the conversion of entities to ASCII later.
        str = str.replace(/(&\#?[0-9a-z]{2,})([\x00-\x20])*;?/i, '$1;$2');
        
        //Validate UTF16 two byte encoding (x00) - just as above, adds a semicolon if missing.
        str = str.replace(/(&\#x?)([0-9A-F]+);?/i, '$1;$2');
        
        //Un-protect query string variables
        str = str.replace(xss_hash(), '&');

        //Decode just in case stuff like this is submitted: 
        //<a href="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">Google</a>
        str = decodeURIComponent(str);
        
        //Convert character entities to ASCII - this permits our tests below to work reliably.
        //We only convert entities that are within tags since these are the ones that will pose security problems.
        str = str.replace(/[a-z]+=([\'\"]).*?\\1/gi, function(m, match) {
            return m.replace(match, convert_attribute(match));
        });
        str = str.replace(/<\w+.*?(?=>|<|$)/gi, function(m, match) {
            
        });
        
        //Remove invisible characters again
        str = remove_invisible_characters(str);
        
        //Convert tabs to spaces
        str = str.replace('\t', ' ');
        
        //Captured the converted string for later comparison
        var converted_string = str;
        
        //Remove strings that are never allowed
        for (var i in never_allowed_str) {
            str = str.replace(i, never_allowed_str[i]);   
        }
        
        //Remove regex patterns that are never allowed
        for (var i in never_allowed_regex) {
            str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);   
        }

        //Compact any exploded words like:  j a v a s c r i p t
        // We only want to do this when it is followed by a non-word character
        for (var i in compact_words) {
            var spacified = compact_words[i].split('').join('\\s*')+'\\s*';

            str = str.replace(new RegExp('('+spacified+')(\\W)', 'ig'), function(m, compat, after) {
                return compat.replace(/\s+/g, '') + after;
            });
        }
        
        //Remove disallowed Javascript in links or img tags
        do {
            var original = str;

            if (str.match(/<a/i)) {
                str = str.replace(/<a\\s+([^>]*?)(>|$)/gi, function(m, attributes, end_tag) {
                    attributes = filter_attributes(attributes.replace('<','').replace('>',''));
                    return m.replace(attributes, attributes.replace(/href=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\\s*,)/gi, ''));
                });
            }

            if (str.match(/<img/i)) {
                str = str.replace(/<img\\s+([^>]*?)(\\s?\/?>|$)/gi, function(m, attributes, end_tag) {
                    attributes = filter_attributes(attributes.replace('<','').replace('>',''));
                    return m.replace(attributes, attributes.replace(/src=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\\s*,)/gi, ''));
                });
            }

            if (str.match(/script/i) || str.match(/xss/i)) {
                str = str.replace(/<(\/*)(script|xss)(.*?)\>/gi, '[removed]');
            }
            
        } while(original != str);
        
        //Remove JavaScript Event Handlers - Note: This code is a little blunt.  It removes the event 
        //handler and anything up to the closing >, but it's unlikely to be a problem.
        event_handlers = ['[^a-z_\-]on\w*'];

        //Adobe Photoshop puts XML metadata into JFIF images, including namespacing, 
        //so we have to allow this for images
        if (!is_image) {
            event_handlers.push('xmlns');
        } 

        str = str.replace(new RegExp("<([^><]+?)("+event_handlers.join('|')+")(\\s*=\\s*[^><]*)([><]*)", 'i'), '<$1$4');
        
        //Sanitize naughty HTML elements
        //If a tag containing any of the words in the list
        //below is found, the tag gets converted to entities.
        //So this: <blink>
        //Becomes: &lt;blink&gt;
        naughty = 'alert|applet|audio|basefont|base|behavior|bgsound|blink|body|embed|expression|form|frameset|frame|head|html|ilayer|iframe|input|isindex|layer|link|meta|object|plaintext|style|script|textarea|title|video|xml|xss';
        str = str.replace(new RegExp('<(/*\\s*)('+naughty+')([^><]*)([><]*)', 'gi'), function(m, a, b, c, d) {
            return '&lt;' + a + b + c + d.replace('>','&gt;').replace('<','&lt;');
        });
        
        //Sanitize naughty scripting elements Similar to above, only instead of looking for
        //tags it looks for PHP and JavaScript commands that are disallowed.  Rather than removing the
        //code, it simply converts the parenthesis to entities rendering the code un-executable.
        //For example:	eval('some code')
        //Becomes:		eval&#40;'some code'&#41;
        str = str.replace(/(alert|cmd|passthru|eval|exec|expression|system|fopen|fsockopen|file|file_get_contents|readfile|unlink)(\\s*)\((.*?)\)/gi, '$1$2&#40;$3&#41;');
        
        //This adds a bit of extra precaution in case something got through the above filters
        for (var i in never_allowed_str) {
            str = str.replace(i, never_allowed_str[i]);   
        }
        for (var i in never_allowed_regex) {
            str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);   
        }
        
        //Images are handled in a special way
        if (is_image && str !== converted_string) {
            throw 'Image may contain XSS';
        }   
        
        return str;
    }

    function remove_invisible_characters(str) {
        for (var i in non_displayables) {
            str = str.replace(non_displayables[i], '');
        }
        return str;
    }

    function xss_hash() {
        //TODO: Create a random hash
        return '!*$^#(@*#&';
    }

    function convert_attribute(str) {
        return str.replace('>','&gt;').replace('<','&lt;').replace('\\','\\\\');
    }

    //Filter Attributes - filters tag attributes for consistency and safety
    function filter_attributes(str) {
        out = '';

        str.replace(/\\s*[a-z\-]+\\s*=\\s*(?:\042|\047)(?:[^\\1]*?)\\1/gi, function(m) {
            $out += m.replace(/\/\*.*?\*\//g, '');
        });
        
        return out;
    }

    var Validator = exports.Validator = function() {}

    Validator.prototype.check = function(str, fail_msg) {
        this.str = String(str || '');
        this.msg = fail_msg;
        return this;
    }

    //Create some aliases - may help code readability
    Validator.prototype.validate = Validator.prototype.check;
    Validator.prototype.assert = Validator.prototype.check;

    Validator.prototype.error = function(msg) {
        throw msg;
    }

    Validator.prototype.isEmail = function() {
        if (!this.str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
            this.error(this.msg || 'Invalid email');
        }
        return this;
    }

    Validator.prototype.isUrl = function() {
        if (!this.str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/)) {
            this.error(this.msg || 'Invalid URL');
        }
        return this;
    }

    Validator.prototype.isIP = function() {
        if (!this.str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
            this.error(this.msg || 'Invalid IP');
        }
        return this;
    }

    Validator.prototype.isAlpha = function() {
        if (!this.str.match(/^[a-zA-Z]+$/)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.isAlphanumeric = function() {
        if (!this.str.match(/^[a-zA-Z0-9]+$/)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.isNumeric = function() {
        if (!this.str.match(/^-?[0-9]+$/)) {
            this.error(this.msg || 'Invalid number');
        }
        return this;
    }

    Validator.prototype.isLowercase = function() {
        if (!this.str.match(/^[a-z0-9]+$/)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.isUppercase = function() {
        if (!this.str.match(/^[A-Z0-9]+$/)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.isInt = function() {
        if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))$/)) {
            this.error(this.msg || 'Invalid integer');
        }
        return this;
    }

    Validator.prototype.isDecimal = function() {
        if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/)) {
            this.error(this.msg || 'Invalid decimal');
        }
        return this;
    }

    Validator.prototype.isFloat = function() {
        return this.isDecimal();
    }

    Validator.prototype.notNull = function() {
        if (this.str === '') {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.isNull = function() {
        if (this.str !== '') {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.notEmpty = function() {
        if (this.str.match(/^[\s\t\r\n]*$/)) {
            this.error(this.msg || 'String is whitespace');
        }
        return this;
    }

    Validator.prototype.equals = function(equals) {
        if (this.str != equals) {
            this.error(this.msg || 'Not equal');
        }
        return this;
    }

    Validator.prototype.contains = function(str) {
        if (this.str.indexOf(str) === -1) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.notContains = function(str) {
        if (this.str.indexOf(str) >= 0) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers) {
        if (typeof pattern !== 'function') {
            pattern = new RegExp(pattern, modifiers);
        }
        if (! this.str.match(pattern)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers) {
        if (typeof pattern !== 'function') {
            pattern = new RegExp(pattern, modifiers);
        }
        if (this.str.match(pattern)) {
            this.error(this.msg || 'Invalid characters');
        }
        return this;
    }

    Validator.prototype.len = function(min, max) {
        if (this.str.length < min) {
            this.error(this.msg || 'String is too small');
        }
        if (typeof max !== undefined && this.str.length > max) {
            this.error(this.msg || 'String is too large');
        }
        return this;
    }

    var Filter = exports.Filter = function() {}

    var whitespace = '\\r\\n\\t\\s';

    Filter.prototype.modify = function(str) {
        this.str = str;
    }

    //Create some aliases - may help code readability
    Filter.prototype.convert = Filter.prototype.sanitize = function(str) {
        this.str = str;
        return this;
    }

    Filter.prototype.xss = function(is_image) {
        this.modify(xssClean(this.str, is_image));
        return this.str;
    }

    Filter.prototype.entityDecode = function() {
        this.modify(decode(this.str));
        return this.str;
    }

    Filter.prototype.entityEncode = function() {
        this.modify(encode(this.str));
        return this.str;
    }

    Filter.prototype.ltrim = function(chars) {
        chars = chars || whitespace;
        this.modify(this.str.replace(new RegExp('^['+chars+']+', 'g'), ''));
        return this.str;
    }

    Filter.prototype.rtrim = function(chars) {
        chars = chars || whitespace;
        this.modify(this.str.replace(new RegExp('['+chars+']+$', 'g'), ''));
        return this.str;
    }

    Filter.prototype.trim = function(chars) {
        chars = chars || whitespace;
        this.modify(this.str.replace(new RegExp('^['+chars+']+|['+chars+']+$', 'g'), ''));
        return this.str;
    }

    Filter.prototype.ifNull = function(replace) {
        if (!this.str || this.str === '') {
            this.modify(replace);
        }
        return this.str;
    }

    Filter.prototype.toFloat = function() {
        this.modify(parseFloat(this.str));
        return this.str;
    }

    Filter.prototype.toInt = function() {
        this.modify(parseInt(this.str));
        return this.str;
    }

    //Any strings with length > 0 (except for '0' and 'false') are considered true,
    //all other strings are false
    Filter.prototype.toBoolean = function() {
        if (!this.str || this.str == '0' || this.str == 'false' || this.str == '') {
            this.modify(false);
        } else {
            this.modify(true);
        }
        return this.str;
    }

    //String must be equal to '1' or 'true' to be considered true, all other strings
    //are false
    Filter.prototype.toBooleanStrict = function() {
        if (this.str == '1' || this.str == 'true') {
            this.modify(true);
        } else {
            this.modify(false);
        }
        return this.str;
    }

    //Quick access methods
    exports.sanitize = exports.convert = function(str) {
        var filter = new exports.Filter();
        return filter.sanitize(str);
    }

    exports.check = exports.validate = exports.assert = function(str, fail_msg) {
        var validator = new exports.Validator();
        return validator.check(str, fail_msg);
    }

})(this);