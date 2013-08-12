**node-validator is a library of string validation, filtering and sanitization methods.**

To install node-validator, use [npm](http://github.com/isaacs/npm):

```bash
$ npm install validator
```

To use the library in the browser, include `validator-min.js`

## Example

```javascript
var check = require('validator').check,
    sanitize = require('validator').sanitize

//Validate
check('test@email.com').len(6, 64).isEmail();        //Methods are chainable
check('abc').isInt();                                //Throws 'Invalid integer'
check('abc', 'Please enter a number').isInt();       //Throws 'Please enter a number'
check('abcdefghijklmnopzrtsuvqxyz').is(/^[a-z]+$/);

//Set a message per validator
check('foo', {
    isNumeric: 'This is not a number',
    contains: 'The value doesn\'t have a 0 in it'
}).isNumeric().contains('0');

//Referencing validator args from the message
check('foo', 'The message needs to be between %1 and %2 characters long (you passed "%0")').len(2, 6);

//Sanitize / Filter
var int = sanitize('0123').toInt();                  //123
var bool = sanitize('true').toBoolean();             //true
var str = sanitize(' \t\r hello \n').trim();         //'hello'
var str = sanitize('aaaaaaaaab').ltrim('a');         //'b'
var str = sanitize(large_input_str).xss();
var str = sanitize('&lt;a&gt;').entityDecode();      //'<a>'
```

## Web development

Often it's more desirable to check or automatically sanitize parameters by name (rather than the actual string). See [this gist](https://gist.github.com/752126) for instructions on binding the library to the `request` prototype.

If you are using the [express.js framework](https://github.com/visionmedia/express) you can use the [express-validator middleware](https://github.com/ctavan/express-validator) to seamlessly integrate node-validator.

Example `http://localhost:8080/?zip=12345&foo=1&textarea=large_string`

```javascript
get('/', function (req, res) {
    req.onValidationError(function (msg) {
        //Redirect the user with error 'msg'
    });

    //Validate user input
    req.check('zip', 'Please enter a valid ZIP code').len(4,5).isInt();
    req.check('email', 'Please enter a valid email').len(6,64).isEmail();
    req.checkHeader('referer').contains('localhost');

    //Sanitize user input
    req.sanitize('textarea').xss();
    req.sanitize('foo').toBoolean();

    //etc.
});
```

## An important note

This library validates **strings** only. If you pass something that's not a string as input it will be coerced to a string using the following rules:

- Is it an object with a `toString` property? Call `input.toString()`
- Is it `null`, `undefined`, or `NaN`? Replace with an empty string
- All other input? Coerce to a string using `'' + input`

## List of validation methods

```javascript
is()                            //Alias for regex()
not()                           //Alias for notRegex()
isEmail()
isUrl()                         //Accepts http, https, ftp
isIP()                          //Combines isIPv4 and isIPv6
isIPv4()
isIPv6()
isAlpha()
isAlphanumeric()
isNumeric()
isHexadecimal()
isHexColor()                    //Accepts valid hexcolors with or without # prefix
isInt()                         //isNumeric accepts zero padded numbers, e.g. '001', isInt doesn't
isLowercase()
isUppercase()
isDecimal()
isFloat()                       //Alias for isDecimal
notNull()                       //Check if length is 0
isNull()
notEmpty()                      //Not just whitespace (input.trim().length !== 0)
equals(equals)
contains(str)
notContains(str)
regex(pattern, modifiers)       //Usage: regex(/[a-z]/i) or regex('[a-z]','i')
notRegex(pattern, modifiers)
len(min, max)                   //max is optional
isUUID(version)                 //Version can be 3, 4 or 5 or empty, see http://en.wikipedia.org/wiki/Universally_unique_identifier
isUUIDv3()                      //Alias for isUUID(3)
isUUIDv4()                      //Alias for isUUID(4)
isUUIDv5()                      //Alias for isUUID(5)
isDate()                        //Uses Date.parse() - regex is probably a better choice
isAfter(date)                   //Argument is optional and defaults to today. Comparison is non-inclusive
isBefore(date)                  //Argument is optional and defaults to today. Comparison is non-inclusive
isIn(options)                   //Accepts an array or string
notIn(options)
max(val)
min(val)
isCreditCard()                  //Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
```

## List of sanitization / filter methods

```javascript
trim(chars)                     //Trim optional `chars`, default is to trim whitespace (\r\n\t )
ltrim(chars)
rtrim(chars)
ifNull(replace)
toFloat()
toInt()
toBoolean()                     //True unless str = '0', 'false', or str.length == 0
toBooleanStrict()               //False unless str = '1' or 'true'
entityDecode()                  //Decode HTML entities
entityEncode()
escape()                        //Escape &, <, >, and "
xss()                           //Remove common XSS attack vectors from user-supplied HTML
xss(true)                       //Remove common XSS attack vectors from images
```

## Extending the library

When adding to the Validator prototype, use `this.str` to access the string and `this.error(this.msg || default_msg)` when the string is invalid

```javascript
var Validator = require('validator').Validator;
Validator.prototype.contains = function(str) {
    if (!~this.str.indexOf(str)) {
        this.error(this.msg || this.str + ' does not contain ' + str);
    }
    return this; //Allow method chaining
}
```

When adding to the Filter (sanitize) prototype, use `this.str` to access the string and `this.modify(new_str)` to update it

```javascript
var Filter = require('validator').Filter;
Filter.prototype.removeNumbers = function() {
    this.modify(this.str.replace(/[0-9]+/g, ''));
    return this.str;
}
```

## Error handling

By default, the validation methods throw an exception when a check fails

```javascript
try {
    check('abc').notNull().isInt()
} catch (e) {
    console.log(e.message); //Invalid integer
}
```

To set a custom error message, set the second param of `check()`

```javascript
try {
    check('abc', 'Please enter a valid integer').notNull().isInt()
} catch (e) {
    console.log(e.message); //Please enter a valid integer
}
```

To attach a custom error handler, set the `error` method of the validator instance

```javascript
var Validator = require('validator').Validator;
var v = new Validator();
v.error = function(msg) {
    console.log('Fail');
}
v.check('abc').isInt(); //'Fail'
```

You might want to collect errors instead of throwing each time

```javascript
Validator.prototype.error = function (msg) {
    this._errors.push(msg);
    return this;
}

Validator.prototype.getErrors = function () {
    return this._errors;
}

var validator = new Validator();

validator.check('abc').isEmail();
validator.check('hello').len(10,30);

var errors = validator.getErrors(); // ['Invalid email', 'String is too small']
```

## Contributors

- [zero21xxx](https://github.com/zero21xxx) - Added per check messages
- [PING](https://github.com/PlNG) - Fixed entity encoding
- [Dan VerWeire](https://github.com/wankdanker) - Modified the behaviour of the error handler
- [ctavan](https://github.com/ctavan) - Added isArray (since removed) and isUUID
- [foxbunny](https://github.com/foxbunny) - Added min(), max(), isAfter(), isBefore(), and improved isDate()
- [oris](https://github.com/orls) - Added in()
- [mren](https://github.com/mren) - Decoupled rules
- [Thorsten Basse](https://github.com/tbasse) - Cleanup and refinement of existing validators
- [Neal Poole](https://github.com/nealpoole) - Port the latest xss() updates from CodeIgniter

## LICENSE

(MIT License)

Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>

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
