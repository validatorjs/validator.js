import toDate from "./lib/toDate.js";
import toFloat from "./lib/toFloat.js";
import toInt from "./lib/toInt.js";
import toBoolean from "./lib/toBoolean.js";
import equals from "./lib/equals.js";
import contains from "./lib/contains.js";
import matches from "./lib/matches.js";

import isEmail from "./lib/isEmail.js";
import isURL from "./lib/isURL.js";
import isMACAddress from "./lib/isMACAddress.js";
import isIP from "./lib/isIP.js";
import isIPRange from "./lib/isIPRange.js";
import isFQDN from "./lib/isFQDN.js";
import isDate from "./lib/isDate.js";
import isTime from "./lib/isTime.js";

import isBoolean from "./lib/isBoolean.js";
import isLocale from "./lib/isLocale.js";

import isAlpha, { locales as isAlphaLocales } from "./lib/isAlpha.js";
import isAlphanumeric, {
  locales as isAlphanumericLocales,
} from "./lib/isAlphanumeric.js";
import isNumeric from "./lib/isNumeric.js";
import isPassportNumber from "./lib/isPassportNumber.js";
import isPort from "./lib/isPort.js";
import isLowercase from "./lib/isLowercase.js";
import isUppercase from "./lib/isUppercase.js";

import isIMEI from "./lib/isIMEI.js";

import isAscii from "./lib/isAscii.js";
import isFullWidth from "./lib/isFullWidth.js";
import isHalfWidth from "./lib/isHalfWidth.js";
import isVariableWidth from "./lib/isVariableWidth.js";
import isMultibyte from "./lib/isMultibyte.js";
import isSemVer from "./lib/isSemVer.js";
import isSurrogatePair from "./lib/isSurrogatePair.js";

import isInt from "./lib/isInt.js";
import isFloat, { locales as isFloatLocales } from "./lib/isFloat.js";
import isDecimal from "./lib/isDecimal.js";
import isHexadecimal from "./lib/isHexadecimal.js";
import isOctal from "./lib/isOctal.js";
import isDivisibleBy from "./lib/isDivisibleBy.js";

import isHexColor from "./lib/isHexColor.js";
import isRgbColor from "./lib/isRgbColor.js";
import isHSL from "./lib/isHSL.js";

import isISRC from "./lib/isISRC.js";

import isIBAN, { locales as ibanLocales } from "./lib/isIBAN.js";
import isBIC from "./lib/isBIC.js";

import isMD5 from "./lib/isMD5.js";
import isHash from "./lib/isHash.js";
import isJWT from "./lib/isJWT.js";

import isJSON from "./lib/isJSON.js";
import isEmpty from "./lib/isEmpty.js";

import isLength from "./lib/isLength.js";
import isByteLength from "./lib/isByteLength.js";

import isUUID from "./lib/isUUID.js";
import isMongoId from "./lib/isMongoId.js";

import isAfter from "./lib/isAfter.js";
import isBefore from "./lib/isBefore.js";

import isIn from "./lib/isIn.js";

import isLuhnNumber from "./lib/isLuhnNumber.js";
import isCreditCard from "./lib/isCreditCard.js";
import isIdentityCard from "./lib/isIdentityCard.js";

import isEAN from "./lib/isEAN.js";
import isISIN from "./lib/isISIN.js";
import isISBN from "./lib/isISBN.js";
import isISSN from "./lib/isISSN.js";
import isTaxID from "./lib/isTaxID.js";

import isMobilePhone, {
  locales as isMobilePhoneLocales,
} from "./lib/isMobilePhone.js";

import isEthereumAddress from "./lib/isEthereumAddress.js";

import isCurrency from "./lib/isCurrency.js";

import isBtcAddress from "./lib/isBtcAddress.js";

import { isISO6346, isFreightContainerID } from "./lib/isISO6346.js";
import isISO6391 from "./lib/isISO6391.js";
import isISO8601 from "./lib/isISO8601.js";
import isRFC3339 from "./lib/isRFC3339.js";
import isISO31661Alpha2 from "./lib/isISO31661Alpha2.js";
import isISO31661Alpha3 from "./lib/isISO31661Alpha3.js";
import isISO4217 from "./lib/isISO4217.js";

import isBase32 from "./lib/isBase32.js";
import isBase58 from "./lib/isBase58.js";
import isBase64 from "./lib/isBase64.js";
import isDataURI from "./lib/isDataURI.js";
import isMagnetURI from "./lib/isMagnetURI.js";
import isMailtoURI from "./lib/isMailtoURI.js";

import isMimeType from "./lib/isMimeType.js";

import isLatLong from "./lib/isLatLong.js";
import isPostalCode, {
  locales as isPostalCodeLocales,
} from "./lib/isPostalCode.js";

import ltrim from "./lib/ltrim.js";
import rtrim from "./lib/rtrim.js";
import trim from "./lib/trim.js";
import escape from "./lib/escape.js";
import unescape from "./lib/unescape.js";
import stripLow from "./lib/stripLow.js";
import whitelist from "./lib/whitelist.js";
import blacklist from "./lib/blacklist.js";
import isWhitelisted from "./lib/isWhitelisted.js";

import normalizeEmail from "./lib/normalizeEmail.js";

import isSlug from "./lib/isSlug.js";
import isLicensePlate from "./lib/isLicensePlate.js";
import isStrongPassword from "./lib/isStrongPassword.js";

import isVAT from "./lib/isVAT.js";

const version = "13.11.0";

const validator = {
  version,
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
  isLuhnNumber,
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
  isISO6346,
  isFreightContainerID,
  isISO6391,
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
  isMailtoURI,
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
  toString,
  isSlug,
  isStrongPassword,
  isTaxID,
  isDate,
  isTime,
  isLicensePlate,
  isVAT,
  ibanLocales,
};

export default validator;
