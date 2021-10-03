import toDate from './toDate';
import toFloat from './toFloat';
import toInt from './toInt';
import toBoolean from './toBoolean';
import equals from './equals';
import contains from './contains';
import matches from './matches';

import isEmail from './isEmail';
import isURL from './isURL';
import isMACAddress from './isMACAddress';
import isIP from './isIP';
import isIPRange from './isIPRange';
import isFQDN from './isFQDN';
import isDate from './isDate';

import isBoolean from './isBoolean';
import isLocale from './isLocale';

import isAlpha, { locales as isAlphaLocales } from './isAlpha';
import isAlphanumeric, { locales as isAlphanumericLocales } from './isAlphanumeric';
import isNumeric from './isNumeric';
import isPassportNumber from './isPassportNumber';
import isPort from './isPort';
import isLowercase from './isLowercase';
import isUppercase from './isUppercase';

import isIMEI from './isIMEI';

import isAscii from './isAscii';
import isFullWidth from './isFullWidth';
import isHalfWidth from './isHalfWidth';
import isVariableWidth from './isVariableWidth';
import isMultibyte from './isMultibyte';
import isSemVer from './isSemVer';
import isSurrogatePair from './isSurrogatePair';

import isInt from './isInt';
import isFloat, { locales as isFloatLocales } from './isFloat';
import isDecimal from './isDecimal';
import isHexadecimal from './isHexadecimal';
import isOctal from './isOctal';
import isDivisibleBy from './isDivisibleBy';

import isHexColor from './isHexColor';
import isRgbColor from './isRgbColor';
import isHSL from './isHSL';

import isISRC from './isISRC';

import isIBAN, { locales as ibanLocales } from './isIBAN';
import isBIC from './isBIC';

import isMD5 from './isMD5';
import isHash from './isHash';
import isJWT from './isJWT';

import isJSON from './isJSON';
import isEmpty from './isEmpty';

import isLength from './isLength';
import isByteLength from './isByteLength';

import isUUID from './isUUID';
import isMongoId from './isMongoId';

import isAfter from './isAfter';
import isBefore from './isBefore';

import isIn from './isIn';

import isCreditCard from './isCreditCard';
import isIdentityCard from './isIdentityCard';

import isEAN from './isEAN';
import isISIN from './isISIN';
import isISBN from './isISBN';
import isISSN from './isISSN';
import isTaxID from './isTaxID';

import isMobilePhone, { locales as isMobilePhoneLocales } from './isMobilePhone';

import isEthereumAddress from './isEthereumAddress';

import isCurrency from './isCurrency';

import isBtcAddress from './isBtcAddress';

import isISO8601 from './isISO8601';
import isRFC3339 from './isRFC3339';
import isISO31661Alpha2 from './isISO31661Alpha2';
import isISO31661Alpha3 from './isISO31661Alpha3';
import isISO4217 from './isISO4217';

import isBase32 from './isBase32';
import isBase58 from './isBase58';
import isBase64 from './isBase64';
import isDataURI from './isDataURI';
import isMagnetURI from './isMagnetURI';

import isMimeType from './isMimeType';

import isLatLong from './isLatLong';
import isPostalCode, { locales as isPostalCodeLocales } from './isPostalCode';

import ltrim from './ltrim';
import rtrim from './rtrim';
import trim from './trim';
import escape from './escape';
import unescape from './unescape';
import stripLow from './stripLow';
import whitelist from './whitelist';
import blacklist from './blacklist';
import isWhitelisted from './isWhitelisted';

import normalizeEmail from './normalizeEmail';

import isSlug from './isSlug';
import isLicensePlate from './isLicensePlate';
import isStrongPassword from './isStrongPassword';

import isVAT from './isVAT';

export default {
  toDate,
  toFloat,
  toInt,
  toBoolean,
  equals,
  contains,
  matches,
  isEmail,
  isURL,
  isMACAddress,
  isIP,
  isIPRange,
  isFQDN,
  isBoolean,
  isIBAN,
  isBIC,
  isAlpha,
  isAlphaLocales,
  isAlphanumeric,
  isAlphanumericLocales,
  isNumeric,
  isPassportNumber,
  isPort,
  isLowercase,
  isUppercase,
  isAscii,
  isFullWidth,
  isHalfWidth,
  isVariableWidth,
  isMultibyte,
  isSemVer,
  isSurrogatePair,
  isInt,
  isIMEI,
  isFloat,
  isFloatLocales,
  isDecimal,
  isHexadecimal,
  isOctal,
  isDivisibleBy,
  isHexColor,
  isRgbColor,
  isHSL,
  isISRC,
  isMD5,
  isHash,
  isJWT,
  isJSON,
  isEmpty,
  isLength,
  isLocale,
  isByteLength,
  isUUID,
  isMongoId,
  isAfter,
  isBefore,
  isIn,
  isCreditCard,
  isIdentityCard,
  isEAN,
  isISIN,
  isISBN,
  isISSN,
  isMobilePhone,
  isMobilePhoneLocales,
  isPostalCode,
  isPostalCodeLocales,
  isEthereumAddress,
  isCurrency,
  isBtcAddress,
  isISO8601,
  isRFC3339,
  isISO31661Alpha2,
  isISO31661Alpha3,
  isISO4217,
  isBase32,
  isBase58,
  isBase64,
  isDataURI,
  isMagnetURI,
  isMimeType,
  isLatLong,
  ltrim,
  rtrim,
  trim,
  escape,
  unescape,
  stripLow,
  whitelist,
  blacklist,
  isWhitelisted,
  normalizeEmail,
  isSlug,
  isStrongPassword,
  isTaxID,
  isDate,
  isLicensePlate,
  isVAT,
  ibanLocales,
};
