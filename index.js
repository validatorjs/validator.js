"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "toDate", {
  enumerable: true,
  get: function get() {
    return _toDate.default;
  }
});
Object.defineProperty(exports, "toFloat", {
  enumerable: true,
  get: function get() {
    return _toFloat.default;
  }
});
Object.defineProperty(exports, "toInt", {
  enumerable: true,
  get: function get() {
    return _toInt.default;
  }
});
Object.defineProperty(exports, "toBoolean", {
  enumerable: true,
  get: function get() {
    return _toBoolean.default;
  }
});
Object.defineProperty(exports, "equals", {
  enumerable: true,
  get: function get() {
    return _equals.default;
  }
});
Object.defineProperty(exports, "contains", {
  enumerable: true,
  get: function get() {
    return _contains.default;
  }
});
Object.defineProperty(exports, "matches", {
  enumerable: true,
  get: function get() {
    return _matches.default;
  }
});
Object.defineProperty(exports, "isEmail", {
  enumerable: true,
  get: function get() {
    return _isEmail.default;
  }
});
Object.defineProperty(exports, "isURL", {
  enumerable: true,
  get: function get() {
    return _isURL.default;
  }
});
Object.defineProperty(exports, "isMACAddress", {
  enumerable: true,
  get: function get() {
    return _isMACAddress.default;
  }
});
Object.defineProperty(exports, "isIP", {
  enumerable: true,
  get: function get() {
    return _isIP.default;
  }
});
Object.defineProperty(exports, "isIPRange", {
  enumerable: true,
  get: function get() {
    return _isIPRange.default;
  }
});
Object.defineProperty(exports, "isFQDN", {
  enumerable: true,
  get: function get() {
    return _isFQDN.default;
  }
});
Object.defineProperty(exports, "isDate", {
  enumerable: true,
  get: function get() {
    return _isDate.default;
  }
});
Object.defineProperty(exports, "isBoolean", {
  enumerable: true,
  get: function get() {
    return _isBoolean.default;
  }
});
Object.defineProperty(exports, "isLocale", {
  enumerable: true,
  get: function get() {
    return _isLocale.default;
  }
});
Object.defineProperty(exports, "isAlpha", {
  enumerable: true,
  get: function get() {
    return _isAlpha.default;
  }
});
Object.defineProperty(exports, "isAlphaLocales", {
  enumerable: true,
  get: function get() {
    return _isAlpha.locales;
  }
});
Object.defineProperty(exports, "isAlphanumeric", {
  enumerable: true,
  get: function get() {
    return _isAlphanumeric.default;
  }
});
Object.defineProperty(exports, "isAlphanumericLocales", {
  enumerable: true,
  get: function get() {
    return _isAlphanumeric.locales;
  }
});
Object.defineProperty(exports, "isNumeric", {
  enumerable: true,
  get: function get() {
    return _isNumeric.default;
  }
});
Object.defineProperty(exports, "isPassportNumber", {
  enumerable: true,
  get: function get() {
    return _isPassportNumber.default;
  }
});
Object.defineProperty(exports, "isPort", {
  enumerable: true,
  get: function get() {
    return _isPort.default;
  }
});
Object.defineProperty(exports, "isLowercase", {
  enumerable: true,
  get: function get() {
    return _isLowercase.default;
  }
});
Object.defineProperty(exports, "isUppercase", {
  enumerable: true,
  get: function get() {
    return _isUppercase.default;
  }
});
Object.defineProperty(exports, "isAscii", {
  enumerable: true,
  get: function get() {
    return _isAscii.default;
  }
});
Object.defineProperty(exports, "isFullWidth", {
  enumerable: true,
  get: function get() {
    return _isFullWidth.default;
  }
});
Object.defineProperty(exports, "isHalfWidth", {
  enumerable: true,
  get: function get() {
    return _isHalfWidth.default;
  }
});
Object.defineProperty(exports, "isVariableWidth", {
  enumerable: true,
  get: function get() {
    return _isVariableWidth.default;
  }
});
Object.defineProperty(exports, "isMultibyte", {
  enumerable: true,
  get: function get() {
    return _isMultibyte.default;
  }
});
Object.defineProperty(exports, "isSemVer", {
  enumerable: true,
  get: function get() {
    return _isSemVer.default;
  }
});
Object.defineProperty(exports, "isSurrogatePair", {
  enumerable: true,
  get: function get() {
    return _isSurrogatePair.default;
  }
});
Object.defineProperty(exports, "isInt", {
  enumerable: true,
  get: function get() {
    return _isInt.default;
  }
});
Object.defineProperty(exports, "isFloat", {
  enumerable: true,
  get: function get() {
    return _isFloat.default;
  }
});
Object.defineProperty(exports, "isFloatLocales", {
  enumerable: true,
  get: function get() {
    return _isFloat.locales;
  }
});
Object.defineProperty(exports, "isDecimal", {
  enumerable: true,
  get: function get() {
    return _isDecimal.default;
  }
});
Object.defineProperty(exports, "isHexadecimal", {
  enumerable: true,
  get: function get() {
    return _isHexadecimal.default;
  }
});
Object.defineProperty(exports, "isOctal", {
  enumerable: true,
  get: function get() {
    return _isOctal.default;
  }
});
Object.defineProperty(exports, "isDivisibleBy", {
  enumerable: true,
  get: function get() {
    return _isDivisibleBy.default;
  }
});
Object.defineProperty(exports, "isHexColor", {
  enumerable: true,
  get: function get() {
    return _isHexColor.default;
  }
});
Object.defineProperty(exports, "isRgbColor", {
  enumerable: true,
  get: function get() {
    return _isRgbColor.default;
  }
});
Object.defineProperty(exports, "isHSL", {
  enumerable: true,
  get: function get() {
    return _isHSL.default;
  }
});
Object.defineProperty(exports, "isISRC", {
  enumerable: true,
  get: function get() {
    return _isISRC.default;
  }
});
Object.defineProperty(exports, "isIBAN", {
  enumerable: true,
  get: function get() {
    return _isIBAN.default;
  }
});
Object.defineProperty(exports, "isBIC", {
  enumerable: true,
  get: function get() {
    return _isBIC.default;
  }
});
Object.defineProperty(exports, "isMD5", {
  enumerable: true,
  get: function get() {
    return _isMD.default;
  }
});
Object.defineProperty(exports, "isHash", {
  enumerable: true,
  get: function get() {
    return _isHash.default;
  }
});
Object.defineProperty(exports, "isJWT", {
  enumerable: true,
  get: function get() {
    return _isJWT.default;
  }
});
Object.defineProperty(exports, "isJSON", {
  enumerable: true,
  get: function get() {
    return _isJSON.default;
  }
});
Object.defineProperty(exports, "isEmpty", {
  enumerable: true,
  get: function get() {
    return _isEmpty.default;
  }
});
Object.defineProperty(exports, "isLength", {
  enumerable: true,
  get: function get() {
    return _isLength.default;
  }
});
Object.defineProperty(exports, "isByteLength", {
  enumerable: true,
  get: function get() {
    return _isByteLength.default;
  }
});
Object.defineProperty(exports, "isUUID", {
  enumerable: true,
  get: function get() {
    return _isUUID.default;
  }
});
Object.defineProperty(exports, "isMongoId", {
  enumerable: true,
  get: function get() {
    return _isMongoId.default;
  }
});
Object.defineProperty(exports, "isAfter", {
  enumerable: true,
  get: function get() {
    return _isAfter.default;
  }
});
Object.defineProperty(exports, "isBefore", {
  enumerable: true,
  get: function get() {
    return _isBefore.default;
  }
});
Object.defineProperty(exports, "isIn", {
  enumerable: true,
  get: function get() {
    return _isIn.default;
  }
});
Object.defineProperty(exports, "isCreditCard", {
  enumerable: true,
  get: function get() {
    return _isCreditCard.default;
  }
});
Object.defineProperty(exports, "isIdentityCard", {
  enumerable: true,
  get: function get() {
    return _isIdentityCard.default;
  }
});
Object.defineProperty(exports, "isEAN", {
  enumerable: true,
  get: function get() {
    return _isEAN.default;
  }
});
Object.defineProperty(exports, "isISIN", {
  enumerable: true,
  get: function get() {
    return _isISIN.default;
  }
});
Object.defineProperty(exports, "isISBN", {
  enumerable: true,
  get: function get() {
    return _isISBN.default;
  }
});
Object.defineProperty(exports, "isISSN", {
  enumerable: true,
  get: function get() {
    return _isISSN.default;
  }
});
Object.defineProperty(exports, "isMobilePhone", {
  enumerable: true,
  get: function get() {
    return _isMobilePhone.default;
  }
});
Object.defineProperty(exports, "isMobilePhoneLocales", {
  enumerable: true,
  get: function get() {
    return _isMobilePhone.locales;
  }
});
Object.defineProperty(exports, "isEthereumAddress", {
  enumerable: true,
  get: function get() {
    return _isEthereumAddress.default;
  }
});
Object.defineProperty(exports, "isCurrency", {
  enumerable: true,
  get: function get() {
    return _isCurrency.default;
  }
});
Object.defineProperty(exports, "isBtcAddress", {
  enumerable: true,
  get: function get() {
    return _isBtcAddress.default;
  }
});
Object.defineProperty(exports, "isISO8601", {
  enumerable: true,
  get: function get() {
    return _isISO.default;
  }
});
Object.defineProperty(exports, "isRFC3339", {
  enumerable: true,
  get: function get() {
    return _isRFC.default;
  }
});
Object.defineProperty(exports, "isISO31661Alpha2", {
  enumerable: true,
  get: function get() {
    return _isISO31661Alpha.default;
  }
});
Object.defineProperty(exports, "isISO31661Alpha3", {
  enumerable: true,
  get: function get() {
    return _isISO31661Alpha2.default;
  }
});
Object.defineProperty(exports, "isBase32", {
  enumerable: true,
  get: function get() {
    return _isBase.default;
  }
});
Object.defineProperty(exports, "isBase64", {
  enumerable: true,
  get: function get() {
    return _isBase2.default;
  }
});
Object.defineProperty(exports, "isDataURI", {
  enumerable: true,
  get: function get() {
    return _isDataURI.default;
  }
});
Object.defineProperty(exports, "isMagnetURI", {
  enumerable: true,
  get: function get() {
    return _isMagnetURI.default;
  }
});
Object.defineProperty(exports, "isMimeType", {
  enumerable: true,
  get: function get() {
    return _isMimeType.default;
  }
});
Object.defineProperty(exports, "isLatLong", {
  enumerable: true,
  get: function get() {
    return _isLatLong.default;
  }
});
Object.defineProperty(exports, "isPostalCode", {
  enumerable: true,
  get: function get() {
    return _isPostalCode.default;
  }
});
Object.defineProperty(exports, "isPostalCodeLocales", {
  enumerable: true,
  get: function get() {
    return _isPostalCode.locales;
  }
});
Object.defineProperty(exports, "ltrim", {
  enumerable: true,
  get: function get() {
    return _ltrim.default;
  }
});
Object.defineProperty(exports, "rtrim", {
  enumerable: true,
  get: function get() {
    return _rtrim.default;
  }
});
Object.defineProperty(exports, "trim", {
  enumerable: true,
  get: function get() {
    return _trim.default;
  }
});
Object.defineProperty(exports, "escape", {
  enumerable: true,
  get: function get() {
    return _escape.default;
  }
});
Object.defineProperty(exports, "unescape", {
  enumerable: true,
  get: function get() {
    return _unescape.default;
  }
});
Object.defineProperty(exports, "stripLow", {
  enumerable: true,
  get: function get() {
    return _stripLow.default;
  }
});
Object.defineProperty(exports, "whitelist", {
  enumerable: true,
  get: function get() {
    return _whitelist.default;
  }
});
Object.defineProperty(exports, "blacklist", {
  enumerable: true,
  get: function get() {
    return _blacklist.default;
  }
});
Object.defineProperty(exports, "isWhitelisted", {
  enumerable: true,
  get: function get() {
    return _isWhitelisted.default;
  }
});
Object.defineProperty(exports, "normalizeEmail", {
  enumerable: true,
  get: function get() {
    return _normalizeEmail.default;
  }
});
Object.defineProperty(exports, "isSlug", {
  enumerable: true,
  get: function get() {
    return _isSlug.default;
  }
});
exports.version = exports.default = void 0;

var _toDate = _interopRequireDefault(require("./lib/toDate"));

var _toFloat = _interopRequireDefault(require("./lib/toFloat"));

var _toInt = _interopRequireDefault(require("./lib/toInt"));

var _toBoolean = _interopRequireDefault(require("./lib/toBoolean"));

var _equals = _interopRequireDefault(require("./lib/equals"));

var _contains = _interopRequireDefault(require("./lib/contains"));

var _matches = _interopRequireDefault(require("./lib/matches"));

var _isEmail = _interopRequireDefault(require("./lib/isEmail"));

var _isURL = _interopRequireDefault(require("./lib/isURL"));

var _isMACAddress = _interopRequireDefault(require("./lib/isMACAddress"));

var _isIP = _interopRequireDefault(require("./lib/isIP"));

var _isIPRange = _interopRequireDefault(require("./lib/isIPRange"));

var _isFQDN = _interopRequireDefault(require("./lib/isFQDN"));

var _isDate = _interopRequireDefault(require("./lib/isDate"));

var _isBoolean = _interopRequireDefault(require("./lib/isBoolean"));

var _isLocale = _interopRequireDefault(require("./lib/isLocale"));

var _isAlpha = _interopRequireWildcard(require("./lib/isAlpha"));

var _isAlphanumeric = _interopRequireWildcard(require("./lib/isAlphanumeric"));

var _isNumeric = _interopRequireDefault(require("./lib/isNumeric"));

var _isPassportNumber = _interopRequireDefault(require("./lib/isPassportNumber"));

var _isPort = _interopRequireDefault(require("./lib/isPort"));

var _isLowercase = _interopRequireDefault(require("./lib/isLowercase"));

var _isUppercase = _interopRequireDefault(require("./lib/isUppercase"));

var _isAscii = _interopRequireDefault(require("./lib/isAscii"));

var _isFullWidth = _interopRequireDefault(require("./lib/isFullWidth"));

var _isHalfWidth = _interopRequireDefault(require("./lib/isHalfWidth"));

var _isVariableWidth = _interopRequireDefault(require("./lib/isVariableWidth"));

var _isMultibyte = _interopRequireDefault(require("./lib/isMultibyte"));

var _isSemVer = _interopRequireDefault(require("./lib/isSemVer"));

var _isSurrogatePair = _interopRequireDefault(require("./lib/isSurrogatePair"));

var _isInt = _interopRequireDefault(require("./lib/isInt"));

var _isFloat = _interopRequireWildcard(require("./lib/isFloat"));

var _isDecimal = _interopRequireDefault(require("./lib/isDecimal"));

var _isHexadecimal = _interopRequireDefault(require("./lib/isHexadecimal"));

var _isOctal = _interopRequireDefault(require("./lib/isOctal"));

var _isDivisibleBy = _interopRequireDefault(require("./lib/isDivisibleBy"));

var _isHexColor = _interopRequireDefault(require("./lib/isHexColor"));

var _isRgbColor = _interopRequireDefault(require("./lib/isRgbColor"));

var _isHSL = _interopRequireDefault(require("./lib/isHSL"));

var _isISRC = _interopRequireDefault(require("./lib/isISRC"));

var _isIBAN = _interopRequireDefault(require("./lib/isIBAN"));

var _isBIC = _interopRequireDefault(require("./lib/isBIC"));

var _isMD = _interopRequireDefault(require("./lib/isMD5"));

var _isHash = _interopRequireDefault(require("./lib/isHash"));

var _isJWT = _interopRequireDefault(require("./lib/isJWT"));

var _isJSON = _interopRequireDefault(require("./lib/isJSON"));

var _isEmpty = _interopRequireDefault(require("./lib/isEmpty"));

var _isLength = _interopRequireDefault(require("./lib/isLength"));

var _isByteLength = _interopRequireDefault(require("./lib/isByteLength"));

var _isUUID = _interopRequireDefault(require("./lib/isUUID"));

var _isMongoId = _interopRequireDefault(require("./lib/isMongoId"));

var _isAfter = _interopRequireDefault(require("./lib/isAfter"));

var _isBefore = _interopRequireDefault(require("./lib/isBefore"));

var _isIn = _interopRequireDefault(require("./lib/isIn"));

var _isCreditCard = _interopRequireDefault(require("./lib/isCreditCard"));

var _isIdentityCard = _interopRequireDefault(require("./lib/isIdentityCard"));

var _isEAN = _interopRequireDefault(require("./lib/isEAN"));

var _isISIN = _interopRequireDefault(require("./lib/isISIN"));

var _isISBN = _interopRequireDefault(require("./lib/isISBN"));

var _isISSN = _interopRequireDefault(require("./lib/isISSN"));

var _isMobilePhone = _interopRequireWildcard(require("./lib/isMobilePhone"));

var _isEthereumAddress = _interopRequireDefault(require("./lib/isEthereumAddress"));

var _isCurrency = _interopRequireDefault(require("./lib/isCurrency"));

var _isBtcAddress = _interopRequireDefault(require("./lib/isBtcAddress"));

var _isISO = _interopRequireDefault(require("./lib/isISO8601"));

var _isRFC = _interopRequireDefault(require("./lib/isRFC3339"));

var _isISO31661Alpha = _interopRequireDefault(require("./lib/isISO31661Alpha2"));

var _isISO31661Alpha2 = _interopRequireDefault(require("./lib/isISO31661Alpha3"));

var _isBase = _interopRequireDefault(require("./lib/isBase32"));

var _isBase2 = _interopRequireDefault(require("./lib/isBase64"));

var _isDataURI = _interopRequireDefault(require("./lib/isDataURI"));

var _isMagnetURI = _interopRequireDefault(require("./lib/isMagnetURI"));

var _isMimeType = _interopRequireDefault(require("./lib/isMimeType"));

var _isLatLong = _interopRequireDefault(require("./lib/isLatLong"));

var _isPostalCode = _interopRequireWildcard(require("./lib/isPostalCode"));

var _ltrim = _interopRequireDefault(require("./lib/ltrim"));

var _rtrim = _interopRequireDefault(require("./lib/rtrim"));

var _trim = _interopRequireDefault(require("./lib/trim"));

var _escape = _interopRequireDefault(require("./lib/escape"));

var _unescape = _interopRequireDefault(require("./lib/unescape"));

var _stripLow = _interopRequireDefault(require("./lib/stripLow"));

var _whitelist = _interopRequireDefault(require("./lib/whitelist"));

var _blacklist = _interopRequireDefault(require("./lib/blacklist"));

var _isWhitelisted = _interopRequireDefault(require("./lib/isWhitelisted"));

var _normalizeEmail = _interopRequireDefault(require("./lib/normalizeEmail"));

var _isSlug = _interopRequireDefault(require("./lib/isSlug"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '13.0.0';
exports.version = version;
var validator = {
  version: version,
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
  isIBAN: _isIBAN.default,
  isBIC: _isBIC.default,
  isAlpha: _isAlpha.default,
  isAlphaLocales: _isAlpha.locales,
  isAlphanumeric: _isAlphanumeric.default,
  isAlphanumericLocales: _isAlphanumeric.locales,
  isNumeric: _isNumeric.default,
  isPassportNumber: _isPassportNumber.default,
  isPort: _isPort.default,
  isLowercase: _isLowercase.default,
  isUppercase: _isUppercase.default,
  isAscii: _isAscii.default,
  isFullWidth: _isFullWidth.default,
  isHalfWidth: _isHalfWidth.default,
  isVariableWidth: _isVariableWidth.default,
  isMultibyte: _isMultibyte.default,
  isSemVer: _isSemVer.default,
  isSurrogatePair: _isSurrogatePair.default,
  isInt: _isInt.default,
  isFloat: _isFloat.default,
  isFloatLocales: _isFloat.locales,
  isDecimal: _isDecimal.default,
  isHexadecimal: _isHexadecimal.default,
  isOctal: _isOctal.default,
  isDivisibleBy: _isDivisibleBy.default,
  isHexColor: _isHexColor.default,
  isRgbColor: _isRgbColor.default,
  isHSL: _isHSL.default,
  isISRC: _isISRC.default,
  isMD5: _isMD.default,
  isHash: _isHash.default,
  isJWT: _isJWT.default,
  isJSON: _isJSON.default,
  isEmpty: _isEmpty.default,
  isLength: _isLength.default,
  isLocale: _isLocale.default,
  isByteLength: _isByteLength.default,
  isUUID: _isUUID.default,
  isMongoId: _isMongoId.default,
  isAfter: _isAfter.default,
  isBefore: _isBefore.default,
  isIn: _isIn.default,
  isCreditCard: _isCreditCard.default,
  isIdentityCard: _isIdentityCard.default,
  isEAN: _isEAN.default,
  isISIN: _isISIN.default,
  isISBN: _isISBN.default,
  isISSN: _isISSN.default,
  isMobilePhone: _isMobilePhone.default,
  isMobilePhoneLocales: _isMobilePhone.locales,
  isPostalCode: _isPostalCode.default,
  isPostalCodeLocales: _isPostalCode.locales,
  isEthereumAddress: _isEthereumAddress.default,
  isCurrency: _isCurrency.default,
  isBtcAddress: _isBtcAddress.default,
  isISO8601: _isISO.default,
  isRFC3339: _isRFC.default,
  isISO31661Alpha2: _isISO31661Alpha.default,
  isISO31661Alpha3: _isISO31661Alpha2.default,
  isBase32: _isBase.default,
  isBase64: _isBase2.default,
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
  toString: toString,
  isSlug: _isSlug.default,
  isDate: _isDate.default
};
var _default = validator;
exports.default = _default;