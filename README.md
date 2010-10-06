A library of methods for input validation, sanitization and filtering.

To install pillar, use [npm](http://github.com/isaacs/npm):

    $ npm install validator
    
## Example

    var Validator = require('validator').Validator;
        
    Validator.check('test@email.com').length(3, 40).isEmail();
    
## Error handling

By default, the validation methods throw an exception when a check fails

    try {
        Validator.check('abc').notNull().isInt()
    } catch (e) {
        console.log(e); //Invalid integer
    }

To set a custom error message, set the second param of check()

    try {
        Validator.check('abc', 'Please enter a valid integer').notNull().isInt()
    } catch (e) {
        console.log(e); //Please enter a valid integer
    }

To attach a custom error handler

    Validator.error = function(msg) {
        //Do smoething
    }

To see the library in use, check out [pillar](http://github.com/chriso/pillar)
