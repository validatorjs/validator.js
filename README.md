**node-validator is a library of string validators and sanitizers**

![tests](https://api.travis-ci.org/chriso/node-validator.png?branch=master)

### Server-side usage

Install the library with `npm install validator`

```javascript
var validator = require('validator');

validator.isEmail('foo@bar.com'); //=> true
```

### Client-side usage

The library can be loaded as a script and supports [AMD](http://requirejs.org/docs/whyamd.html)

```html
<script type="text/javascript" src="validator.min.js"></script>
<script type="text/javascript">
  validator.isEmail('foo@bar.com'); //=> true
</script>
```

## API

See the [wiki](#) for the full list of validators and sanitizers.

## Strings only

This library validates and sanitizes **strings** only. All input will be coerced to a string using the following rules

- Call the `toString` property if available
- Replace `null`, `undefined` or `NaN` with an empty string
- Everything else is coerced with `input + ''`

## Deprecations

Version 3 of the library deprecated some functionality

- **XSS sanitizer**: Use [Google Caja](https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/html-sanitizer.js).
- **Entity encoding**: Use [fb55/entities](https://github.com/fb55/node-entities) or [substack/node-ent](https://github.com/substack/node-ent).
- **Validator chaining**: The API was too unintuitive. I'd prefer to let users create their own higher-level patterns from the provided building blocks.

## License (MIT)

Copyright (c) 2014 Chris O'Hara <cohara87@gmail.com>

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
