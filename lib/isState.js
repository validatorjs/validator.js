"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isState;
exports.isStateCodeLocales = exports.isStateNameLocales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// source: https://www.ups.com/worldshiphelp/WS14/ENU/AppHelp/Codes/State_Province_Codes.htm
var validStateCodes = {
  US: ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'],
  CA: ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']
};
var validStateNames = {
  US: ['District of Columbia', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  CA: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Saskatchewan', 'Yukon']
};

var combineSimilarObjectArraysByKeys = function combineSimilarObjectArraysByKeys(keysToUse, objectsToUse) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(objectsToUse.map(function (obj) {
    var _ref2;

    return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(keysToUse.map(function (key) {
      return obj[key];
    })));
  }))).filter(function (x) {
    return x;
  });
};

function isState(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    locale: 'any',
    codesOnly: false,
    namesOnly: false
  };
  (0, _assertString.default)(str);
  var codesOnly = options.codesOnly,
      namesOnly = options.namesOnly,
      locale = options.locale;
  var useLocale = [];
  var objectToUse = {};

  if (Array.isArray(locale)) {
    useLocale = locale;
  } else if (!locale || locale === 'any') {
    useLocale = _toConsumableArray(new Set([].concat(Object.keys(validStateCodes), Object.keys(validStateNames))));
  } else {
    useLocale = [locale];
  }

  if (codesOnly) {
    objectToUse = [validStateCodes];
  }

  if (namesOnly) {
    objectToUse = [validStateNames];
  }

  if (!codesOnly && !namesOnly || codesOnly && namesOnly) {
    objectToUse = [validStateCodes, validStateNames];
  }

  return combineSimilarObjectArraysByKeys(useLocale, objectToUse).map(function (v) {
    return v.toLowerCase();
  }).includes(str.toLowerCase());
}

var isStateNameLocales = Object.keys(validStateNames);
exports.isStateNameLocales = isStateNameLocales;
var isStateCodeLocales = Object.keys(validStateCodes);
exports.isStateCodeLocales = isStateCodeLocales;