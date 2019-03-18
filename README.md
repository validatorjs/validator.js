# aftership-validator-js
This is a project forked from [validator.js](https://github.com/chriso/validator.js)

## Installation
`npm install aftership-validator-js`

## New features
1. For function **isEmail**, we use rules below to validate display name (refer to the [RFC2822](https://tools.ietf.org/html/rfc2822#appendix-A.1.2)):
	1. The display name of an email address can be any characters(but we ruled out invisible characters in the code, so can't be invisible characters)
	2. If there is any illegal character such as angled-brackets/quotes/semicolon, must enclose the display name in double-quotes
	3. Quotes in display name should start with backslash \


   
  