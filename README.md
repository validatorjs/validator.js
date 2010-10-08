A library of string validation methods.

To install node-validator, use [npm](http://github.com/isaacs/npm):

    $ npm install validator
    
## Example
    
    var check = require('validator').check;
        
    check('test@email.com').len(6, 64).isEmail();

## List of validation methods

    isEmail()
    isUrl()                         //Accepts https? || ftp
    isIP()
    isAlpha()
    isAlphanumeric()
    isNumeric()                     
    isInt()                         //isNumeric accepts '001' but this doesn't
    isLowercase()
    isUppercase()
    isDecimal()
    isFloat()                       //Alias for isDecimal
    notNull()
    isNull()
    notEmpty()                      //i.e. not just whitespace
    equals(equals)
    contains(str)
    notContains(str)
    regex(pattern, modifiers)       //Usage: regex(/[a-z]/i) or regex('[a-z]','i')
    notRegex(pattern, modifiers)
    len(min, max)                   //max is optional

## Extending the library

When adding to the Validator prototype, use this.str to access the string and this.error(this.msg || default_msg) when the string is invalid

    var Validator = require('validator').Validator;
    Validator.prototype.contains = function(str) {
        if (!~this.str.indexOf(str)) {
            this.error(this.msg || this.str + ' does not contain ' + str);
        }
        return this; //Allow method chaining
    }

## Error handling

By default, the validation methods throw an exception when a check fails

    try {
        check('abc').notNull().isInt()
    } catch (e) {
        console.log(e); //Invalid integer
    }

To set a custom error message, set the second param

    try {
        check('abc', 'Please enter a valid integer').notNull().isInt()
    } catch (e) {
        console.log(e); //Please enter a valid integer
    }

To attach a custom error handler, modify the onError method of the Validator class
    
    Validator.error = function(msg) {
        //Do something
    }

To see the library in use, check out [pillar](http://github.com/chriso/pillar)
