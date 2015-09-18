#### HEAD

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
