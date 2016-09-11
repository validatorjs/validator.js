#### 5.7.0

- Added support for IPv6 in `isURL()`
  ([#564](https://github.com/chriso/validator.js/issues/564))
- Added support for urls without a host (e.g. `file:///foo.txt`) in `isURL()`
  ([#563](https://github.com/chriso/validator.js/issues/563))
- Added support for regular expressions in the `isURL()` host whitelist and blacklist
  ([#562](https://github.com/chriso/validator.js/issues/562))
- Added support for MasterCard 2-Series BIN
  ([#576](https://github.com/chriso/validator.js/pull/576))
- New locales
  ([#575](https://github.com/chriso/validator.js/pull/575),
   [#552](https://github.com/chriso/validator.js/issues/552))

#### 5.6.0

- Added an `isMD5()` validator
  ([#557](https://github.com/chriso/validator.js/pull/557))
- Fixed an exceptional case in `isDate()`
  ([#566](https://github.com/chriso/validator.js/pull/566))
- New locales
  ([#559](https://github.com/chriso/validator.js/pull/559),
  [#568](https://github.com/chriso/validator.js/pull/568),
  [#571](https://github.com/chriso/validator.js/pull/571),
  [#573](https://github.com/chriso/validator.js/pull/573))

#### 5.5.0

- Fixed a regex denial of service in `trim()` and `rtrim()`
  ([#556](https://github.com/chriso/validator.js/pull/556))
- Added an Algerian locale to `isMobilePhone()`
  ([#540](https://github.com/chriso/validator.js/pull/540))
- Fixed the Hungarian locale in `isAlpha()` and `isAlphanumeric()`
  ([#541](https://github.com/chriso/validator.js/pull/541))
- Added a Polish locale to `isMobilePhone()`
  ([#545](https://github.com/chriso/validator.js/pull/545))

#### 5.4.0

- Accept Union Pay credit cards in `isCreditCard()`
  ([#539](https://github.com/chriso/validator.js/pull/539))
- Added Danish locale to `isMobilePhone()`
  ([#538](https://github.com/chriso/validator.js/pull/538))
- Added Hungarian locales to `isAlpha()`, `isAlphanumeric()` and `isMobilePhone()`
  ([#537](https://github.com/chriso/validator.js/pull/537))

#### 5.3.0

- Added an `allow_leading_zeroes` option to `isInt()`
  ([#532](https://github.com/chriso/validator.js/pull/532))
- Adjust Chinese mobile phone validation
  ([#523](https://github.com/chriso/validator.js/pull/523))
- Added a Canadian locale to `isMobilePhone()`
  ([#524](https://github.com/chriso/validator.js/issues/524))

#### 5.2.0

- Added a `isDataURI()` validator
  ([#521](https://github.com/chriso/validator.js/pull/521))
- Added Czech locales
  ([#522](https://github.com/chriso/validator.js/pull/522))
- Fixed a bug with `isURL()` when protocol was missing and "://" appeared in the query
  ([#518](https://github.com/chriso/validator.js/issues/518))

#### 5.1.0

- Added a `unescape()` HTML function
  ([#509](https://github.com/chriso/validator.js/pull/509))
- Added a Malaysian locale to `isMobilePhone()`
  ([#507](https://github.com/chriso/validator.js/pull/507))
- Added Polish locales to `isAlpha()` and `isAlphanumeric()`
  ([#506](https://github.com/chriso/validator.js/pull/506))
- Added Turkish locales to `isAlpha()`, `isAlphanumeric()` and `isMobilePhone()`
  ([#512](https://github.com/chriso/validator.js/pull/512))
- Allow >1 underscore in hostnames when using `allow_underscores`
  ([#510](https://github.com/chriso/validator.js/issues/510))

#### 5.0.0

- Migrate to ES6
  ([#496](https://github.com/chriso/validator.js/pull/496))
- Break the library up so that individual functions can be imported
  ([#496](https://github.com/chriso/validator.js/pull/496))
- Remove auto-coercion of input to a string
  ([#496](https://github.com/chriso/validator.js/pull/496))
- Remove the `extend()` function
  ([#496](https://github.com/chriso/validator.js/pull/496))
- Added Arabic locales to `isAlpha()` and `isAlphanumeric()`
  ([#496](https://github.com/chriso/validator.js/pull/496#issuecomment-184781730))
- Fix validation of very large base64 strings
  ([#503](https://github.com/chriso/validator.js/pull/503))

#### 4.9.0

- Added a Russian locale to `isAlpha()` and `isAlphanumeric()`
  ([#499](https://github.com/chriso/validator.js/pull/499))
- Remove the restriction on adjacent hyphens in hostnames
  ([#500](https://github.com/chriso/validator.js/issues/500))

#### 4.8.0

- Added Spanish, French, Portuguese and Dutch support for `isAlpha()` and `isAlphanumeric()`
  ([#492](https://github.com/chriso/validator.js/pull/492))
- Added a Brazilian locale to `isMobilePhone()`
  ([#489](https://github.com/chriso/validator.js/pull/489))
- Reject IPv4 addresses with invalid zero padding
  ([#490](https://github.com/chriso/validator.js/pull/490))
- Fix the client-side version when used with RequireJS
  ([#494](https://github.com/chriso/validator.js/issues/494))

#### 4.7.1

- Use [node-depd](https://github.com/dougwilson/nodejs-depd) to print deprecation notices
  ([#487](https://github.com/chriso/validator.js/issues/487))

#### 4.7.0

- Print a deprecation warning if validator input is not a string
  ([1f67e1e](https://github.com/chriso/validator.js/commit/1f67e1e15198c0ae735151290dc8dc2bf14da254)).
  Note that this will be an error in v5.
- Added a German locale to `isMobilePhone()`, `isAlpha()` and `isAlphanumeric()`
  ([#477](https://github.com/chriso/validator.js/pull/477))
- Added a Finnish locale to `isMobilePhone()`
  ([#455](https://github.com/chriso/validator.js/pull/455))

#### 4.6.1

- Fix coercion of objects: `Object.toString()` is `[object Object]` not `""`
  ([a57f3c8](https://github.com/chriso/validator.js/commit/a57f3c843c715fba2664ee22ec80e9e28e88e0a6))

#### 4.6.0

- Added a Spanish locale to `isMobilePhone()`
  ([#481](https://github.com/chriso/validator.js/pull/481))
- Fix string coercion of objects created with `Object.create(null)`
  ([#484](https://github.com/chriso/validator.js/issues/484))

#### 4.5.2

- Fix a timezone issue with short-form ISO 8601 dates, e.g.
  `validator.isDate('2011-12-21')`
  ([#480](https://github.com/chriso/validator.js/issues/480))

#### 4.5.1

- Make `isLength()` / `isByteLength()` accept `{min, max}` as options object.
  ([#474](https://github.com/chriso/validator.js/issues/474))

#### 4.5.0

- Add validation for Indian mobile phone numbers
  ([#471](https://github.com/chriso/validator.js/pull/471))
- Tweak Greek and Chinese mobile phone validation
  ([#467](https://github.com/chriso/validator.js/pull/467),
   [#468](https://github.com/chriso/validator.js/pull/468))
- Fixed a bug in `isDate()` when validating ISO 8601 dates without a timezone
  ([#472](https://github.com/chriso/validator.js/issues/472))

#### 4.4.1

- Allow triple hyphens in IDNA hostnames
  ([#466](https://github.com/chriso/validator.js/issues/466))

#### 4.4.0

- Added `isMACAddress()` validator
  ([#458](https://github.com/chriso/validator.js/pull/458))
- Added `isWhitelisted()` validator
  ([#462](https://github.com/chriso/validator.js/pull/462))
- Added a New Zealand locale to `isMobilePhone()`
  ([#452](https://github.com/chriso/validator.js/pull/452))
- Added options to control GMail address normalization
  ([#460](https://github.com/chriso/validator.js/pull/460))

#### 4.3.0

- Support Ember CLI module definitions
  ([#448](https://github.com/chriso/validator.js/pull/448))
- Added a Vietnam locale to `isMobilePhone()`
  ([#451](https://github.com/chriso/validator.js/pull/451))

#### 4.2.1

- Fix `isDate()` handling of RFC2822 timezones
  ([#447](https://github.com/chriso/validator.js/pull/447))

#### 4.2.0

- Fix `isDate()` handling of ISO8601 timezones
  ([#444](https://github.com/chriso/validator.js/pull/444))
- Fix the incorrect `isFloat('.') === true`
  ([#443](https://github.com/chriso/validator.js/pull/443))
- Added a Norwegian locale to `isMobilePhone()`
  ([#439](https://github.com/chriso/validator.js/pull/439))

#### 4.1.0

- General `isDate()` improvements
  ([#431](https://github.com/chriso/validator.js/pull/431))
- Tests now require node 4.0+
  ([#438](https://github.com/chriso/validator.js/pull/438))

#### 4.0.6

- Added a Taiwan locale to `isMobilePhone()`
  ([#432](https://github.com/chriso/validator.js/pull/432))
- Fixed a bug in `isBefore()` where it would return `null`
  ([#436](https://github.com/chriso/validator.js/pull/436))

#### 4.0.5

- Fixed a denial of service vulnerability in the `isEmail()` regex
  ([#152](https://github.com/chriso/validator.js/issues/152#issuecomment-131874928))

#### 4.0.4

- Reverted the leap year validation in `isDate()` as it introduced some regressions
  ([#422](https://github.com/chriso/validator.js/issues/422), [#423](https://github.com/chriso/validator.js/issues/423))

#### 4.0.3

- Added leap year validation to `isDate()`
  ([#418](https://github.com/chriso/validator.js/pull/418))

#### 4.0.2

- Fixed `isDecimal()` with an empty string
  ([#419](https://github.com/chriso/validator.js/issues/419))

#### 4.0.1

- Fixed `isByteLength()` with certain strings
  ([09f0c6d](https://github.com/chriso/validator.js/commit/09f0c6d2321f0c78af6a7de42e91b63955e4c01e))
- Put length restrictions on email parts
  ([#258](https://github.com/chriso/validator.js/issues/258#issuecomment-127173612))

#### 4.0.0

- Simplified the `isEmail()` regex and fixed some edge cases
  ([#258](https://github.com/chriso/validator.js/issues/258#issuecomment-127173612))
- Added ISO 8601 date validation via `isISO8601()`
  ([#373](https://github.com/chriso/validator.js/issues/373))
