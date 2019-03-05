'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

let _toDate = _interopRequireDefault(require('./lib/toDate'));

let _toFloat = _interopRequireDefault(require('./lib/toFloat'));

let _toInt = _interopRequireDefault(require('./lib/toInt'));

let _toBoolean = _interopRequireDefault(require('./lib/toBoolean'));

let _equals = _interopRequireDefault(require('./lib/equals'));

let _contains = _interopRequireDefault(require('./lib/contains'));

let _matches = _interopRequireDefault(require('./lib/matches'));

let _isEmail = _interopRequireDefault(require('./lib/isEmail'));

let _isURL = _interopRequireDefault(require('./lib/isURL'));

let _isMACAddress = _interopRequireDefault(require('./lib/isMACAddress'));

let _isIP = _interopRequireDefault(require('./lib/isIP'));

let _isIPRange = _interopRequireDefault(require('./lib/isIPRange'));

let _isFQDN = _interopRequireDefault(require('./lib/isFQDN'));

let _isBoolean = _interopRequireDefault(require('./lib/isBoolean'));

let _isAlpha = _interopRequireWildcard(require('./lib/isAlpha'));

let _isAlphanumeric = _interopRequireWildcard(require('./lib/isAlphanumeric'));

let _isNumeric = _interopRequireDefault(require('./lib/isNumeric'));

let _isPort = _interopRequireDefault(require('./lib/isPort'));

let _isLowercase = _interopRequireDefault(require('./lib/isLowercase'));

let _isUppercase = _interopRequireDefault(require('./lib/isUppercase'));

let _isAscii = _interopRequireDefault(require('./lib/isAscii'));

let _isFullWidth = _interopRequireDefault(require('./lib/isFullWidth'));

let _isHalfWidth = _interopRequireDefault(require('./lib/isHalfWidth'));

let _isVariableWidth = _interopRequireDefault(require('./lib/isVariableWidth'));

let _isMultibyte = _interopRequireDefault(require('./lib/isMultibyte'));

let _isSurrogatePair = _interopRequireDefault(require('./lib/isSurrogatePair'));

let _isInt = _interopRequireDefault(require('./lib/isInt'));

let _isFloat = _interopRequireWildcard(require('./lib/isFloat'));

let _isDecimal = _interopRequireDefault(require('./lib/isDecimal'));

let _isHexadecimal = _interopRequireDefault(require('./lib/isHexadecimal'));

let _isDivisibleBy = _interopRequireDefault(require('./lib/isDivisibleBy'));

let _isHexColor = _interopRequireDefault(require('./lib/isHexColor'));

let _isISRC = _interopRequireDefault(require('./lib/isISRC'));

let _isMD = _interopRequireDefault(require('./lib/isMD5'));

let _isHash = _interopRequireDefault(require('./lib/isHash'));

let _isJWT = _interopRequireDefault(require('./lib/isJWT'));

let _isJSON = _interopRequireDefault(require('./lib/isJSON'));

let _isEmpty = _interopRequireDefault(require('./lib/isEmpty'));

let _isLength = _interopRequireDefault(require('./lib/isLength'));

let _isByteLength = _interopRequireDefault(require('./lib/isByteLength'));

let _isUUID = _interopRequireDefault(require('./lib/isUUID'));

let _isMongoId = _interopRequireDefault(require('./lib/isMongoId'));

let _isAfter = _interopRequireDefault(require('./lib/isAfter'));

let _isBefore = _interopRequireDefault(require('./lib/isBefore'));

let _isIn = _interopRequireDefault(require('./lib/isIn'));

let _isCreditCard = _interopRequireDefault(require('./lib/isCreditCard'));

let _isIdentityCard = _interopRequireDefault(require('./lib/isIdentityCard'));

let _isISIN = _interopRequireDefault(require('./lib/isISIN'));

let _isISBN = _interopRequireDefault(require('./lib/isISBN'));

let _isISSN = _interopRequireDefault(require('./lib/isISSN'));

let _isMobilePhone = _interopRequireWildcard(require('./lib/isMobilePhone'));

let _isCurrency = _interopRequireDefault(require('./lib/isCurrency'));

let _isISO = _interopRequireDefault(require('./lib/isISO8601'));

let _isRFC = _interopRequireDefault(require('./lib/isRFC3339'));

let _isISO31661Alpha = _interopRequireDefault(require('./lib/isISO31661Alpha2'));

let _isISO31661Alpha2 = _interopRequireDefault(require('./lib/isISO31661Alpha3'));

let _isBase = _interopRequireDefault(require('./lib/isBase64'));

let _isDataURI = _interopRequireDefault(require('./lib/isDataURI'));

let _isMagnetURI = _interopRequireDefault(require('./lib/isMagnetURI'));

let _isMimeType = _interopRequireDefault(require('./lib/isMimeType'));

let _isLatLong = _interopRequireDefault(require('./lib/isLatLong'));

let _isPostalCode = _interopRequireWildcard(require('./lib/isPostalCode'));

let _ltrim = _interopRequireDefault(require('./lib/ltrim'));

let _rtrim = _interopRequireDefault(require('./lib/rtrim'));

let _trim = _interopRequireDefault(require('./lib/trim'));

let _escape = _interopRequireDefault(require('./lib/escape'));

let _unescape = _interopRequireDefault(require('./lib/unescape'));

let _stripLow = _interopRequireDefault(require('./lib/stripLow'));

let _whitelist = _interopRequireDefault(require('./lib/whitelist'));

let _blacklist = _interopRequireDefault(require('./lib/blacklist'));

let _isWhitelisted = _interopRequireDefault(require('./lib/isWhitelisted'));

let _normalizeEmail = _interopRequireDefault(require('./lib/normalizeEmail'));

let _toString = _interopRequireDefault(require('./lib/util/toString'));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; }  var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj;  }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let version = '1.0.0';
let validator = {
  version,
  toDate: _toDate.default,
  toFloat: _toFloat.default,
  toInt: _toInt.default,
  toBoolean: _toBoolean.default,
  equals: _equals.default,
  contains: _contains.default,
  matches: _matches.default,
  isEmail: _isEmail.default,
  isURL: _isURL.default,
  isMACAddress: _isMACAddress.default,
  isIP: _isIP.default,
  isIPRange: _isIPRange.default,
  isFQDN: _isFQDN.default,
  isBoolean: _isBoolean.default,
  isAlpha: _isAlpha.default,
  isAlphaLocales: _isAlpha.locales,
  isAlphanumeric: _isAlphanumeric.default,
  isAlphanumericLocales: _isAlphanumeric.locales,
  isNumeric: _isNumeric.default,
  isPort: _isPort.default,
  isLowercase: _isLowercase.default,
  isUppercase: _isUppercase.default,
  isAscii: _isAscii.default,
  isFullWidth: _isFullWidth.default,
  isHalfWidth: _isHalfWidth.default,
  isVariableWidth: _isVariableWidth.default,
  isMultibyte: _isMultibyte.default,
  isSurrogatePair: _isSurrogatePair.default,
  isInt: _isInt.default,
  isFloat: _isFloat.default,
  isFloatLocales: _isFloat.locales,
  isDecimal: _isDecimal.default,
  isHexadecimal: _isHexadecimal.default,
  isDivisibleBy: _isDivisibleBy.default,
  isHexColor: _isHexColor.default,
  isISRC: _isISRC.default,
  isMD5: _isMD.default,
  isHash: _isHash.default,
  isJWT: _isJWT.default,
  isJSON: _isJSON.default,
  isEmpty: _isEmpty.default,
  isLength: _isLength.default,
  isByteLength: _isByteLength.default,
  isUUID: _isUUID.default,
  isMongoId: _isMongoId.default,
  isAfter: _isAfter.default,
  isBefore: _isBefore.default,
  isIn: _isIn.default,
  isCreditCard: _isCreditCard.default,
  isIdentityCard: _isIdentityCard.default,
  isISIN: _isISIN.default,
  isISBN: _isISBN.default,
  isISSN: _isISSN.default,
  isMobilePhone: _isMobilePhone.default,
  isMobilePhoneLocales: _isMobilePhone.locales,
  isPostalCode: _isPostalCode.default,
  isPostalCodeLocales: _isPostalCode.locales,
  isCurrency: _isCurrency.default,
  isISO8601: _isISO.default,
  isRFC3339: _isRFC.default,
  isISO31661Alpha2: _isISO31661Alpha.default,
  isISO31661Alpha3: _isISO31661Alpha2.default,
  isBase64: _isBase.default,
  isDataURI: _isDataURI.default,
  isMagnetURI: _isMagnetURI.default,
  isMimeType: _isMimeType.default,
  isLatLong: _isLatLong.default,
  ltrim: _ltrim.default,
  rtrim: _rtrim.default,
  trim: _trim.default,
  escape: _escape.default,
  unescape: _unescape.default,
  stripLow: _stripLow.default,
  whitelist: _whitelist.default,
  blacklist: _blacklist.default,
  isWhitelisted: _isWhitelisted.default,
  normalizeEmail: _normalizeEmail.default,
  toString: _toString.default,
};
let _default = validator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
