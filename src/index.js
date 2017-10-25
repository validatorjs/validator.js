import toDate from './lib/toDate';
import toFloat from './lib/toFloat';
import toInt from './lib/toInt';
import toBoolean from './lib/toBoolean';
import equals from './lib/equals';
import contains from './lib/contains';
import matches from './lib/matches';

import isEmail from './lib/isEmail';
import isURL from './lib/isURL';
import isMACAddress from './lib/isMACAddress';
import isIP from './lib/isIP';
import isFQDN from './lib/isFQDN';

import isBoolean from './lib/isBoolean';

import isAlpha from './lib/isAlpha';
import isAlphanumeric from './lib/isAlphanumeric';
import isNumeric from './lib/isNumeric';
import isPort from './lib/isPort';
import isLowercase from './lib/isLowercase';
import isUppercase from './lib/isUppercase';

import isAscii from './lib/isAscii';
import isFullWidth from './lib/isFullWidth';
import isHalfWidth from './lib/isHalfWidth';
import isVariableWidth from './lib/isVariableWidth';
import isMultibyte from './lib/isMultibyte';
import isSurrogatePair from './lib/isSurrogatePair';

import isInt from './lib/isInt';
import isFloat from './lib/isFloat';
import isDecimal from './lib/isDecimal';
import isHexadecimal from './lib/isHexadecimal';
import isDivisibleBy from './lib/isDivisibleBy';

import isHexColor from './lib/isHexColor';

import isISRC from './lib/isISRC';

import isMD5 from './lib/isMD5';
import isHash from './lib/isHash';

import isJSON from './lib/isJSON';
import isEmpty from './lib/isEmpty';

import isLength from './lib/isLength';
import isByteLength from './lib/isByteLength';

import isUUID from './lib/isUUID';
import isMongoId from './lib/isMongoId';

import isAfter from './lib/isAfter';
import isBefore from './lib/isBefore';

import isIn from './lib/isIn';

import isCreditCard from './lib/isCreditCard';

import isISIN from './lib/isISIN';
import isISBN from './lib/isISBN';
import isISSN from './lib/isISSN';

import isMobilePhone from './lib/isMobilePhone';

import isCurrency from './lib/isCurrency';

import isISO8601 from './lib/isISO8601';
import isISO31661Alpha2 from './lib/isISO31661Alpha2';

import isBase64 from './lib/isBase64';
import isDataURI from './lib/isDataURI';

import isLatLong from './lib/isLatLong';
import isPostalCode from './lib/isPostalCode';

import ltrim from './lib/ltrim';
import rtrim from './lib/rtrim';
import trim from './lib/trim';
import escape from './lib/escape';
import unescape from './lib/unescape';
import stripLow from './lib/stripLow';
import whitelist from './lib/whitelist';
import blacklist from './lib/blacklist';
import isWhitelisted from './lib/isWhitelisted';

import normalizeEmail from './lib/normalizeEmail';

import toString from './lib/util/toString';

const version = '9.1.1';

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
  isFQDN,
  isBoolean,
  isAlpha,
  isAlphanumeric,
  isNumeric,
  isPort,
  isLowercase,
  isUppercase,
  isAscii,
  isFullWidth,
  isHalfWidth,
  isVariableWidth,
  isMultibyte,
  isSurrogatePair,
  isInt,
  isFloat,
  isDecimal,
  isHexadecimal,
  isDivisibleBy,
  isHexColor,
  isISRC,
  isMD5,
  isHash,
  isJSON,
  isEmpty,
  isLength,
  isByteLength,
  isUUID,
  isMongoId,
  isAfter,
  isBefore,
  isIn,
  isCreditCard,
  isISIN,
  isISBN,
  isISSN,
  isMobilePhone,
  isPostalCode,
  isCurrency,
  isISO8601,
  isISO31661Alpha2,
  isBase64,
  isDataURI,
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
};

export default validator;
