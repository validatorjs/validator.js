"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStateCodeOrName = exports.isStateCode = exports.isStateName = exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stateLookupMap = {
  us: {
    alabama: 'al',
    alaska: 'ak',
    arizona: 'az',
    arkansas: 'ar',
    california: 'ca',
    colorado: 'co',
    connecticut: 'ct',
    delaware: 'de',
    'district of columbia': 'dc',
    florida: 'fl',
    georgia: 'ga',
    hawaii: 'hi',
    idaho: 'id',
    illinois: 'il',
    indiana: 'in',
    iowa: 'ia',
    kansas: 'ks',
    kentucky: 'ky',
    louisiana: 'la',
    maine: 'me',
    maryland: 'md',
    massachusetts: 'ma',
    michigan: 'mi',
    minnesota: 'mn',
    mississippi: 'ms',
    missouri: 'mo',
    montana: 'mt',
    nebraska: 'ne',
    nevada: 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    ohio: 'oh',
    oklahoma: 'ok',
    oregon: 'or',
    pennsylvania: 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    tennessee: 'tn',
    texas: 'tx',
    utah: 'ut',
    vermont: 'vt',
    virginia: 'va',
    washington: 'wa',
    'washington state': 'wa',
    'west virginia': 'wv',
    wisconsin: 'wi',
    wyoming: 'wy',
    'puerto rico': 'pr'
  },
  ca: {
    alberta: 'ab',
    'british columbia': 'bc',
    manitoba: 'mb',
    'new brunswick': 'nb',
    'newfoundland and labrador': 'nl',
    'northwest territories': 'nt',
    'nova scotia': 'ns',
    nunavut: 'nu',
    ontario: 'on',
    'prince edward island': 'pe',
    saskatchewan: 'sk',
    yukon: 'yt',
    quebec: 'qc'
  }
};
var locales = Object.keys(stateLookupMap);
exports.locales = locales;

var buildSearch = function buildSearch(aggFn) {
  return function (str) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'any';
    (0, _assertString.default)(str);
    return locales.filter(function (validLoc) {
      return new Array(locale === 'any' ? locales : locale).flatMap(function (x) {
        return x;
      }).map(function (x) {
        return x.toLowerCase();
      }).includes(validLoc);
    }).map(function (loc) {
      return stateLookupMap[loc];
    }).flatMap(aggFn).includes(str.toLowerCase());
  };
};

var isStateCode = buildSearch(Object.values);
exports.isStateCode = isStateCode;
var isStateName = buildSearch(Object.keys);
exports.isStateName = isStateName;

var isStateCodeOrName = function isStateCodeOrName() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return [isStateCode, isStateName].map(function (fn) {
    return fn.apply(void 0, args);
  }).some(function (x) {
    return x;
  });
};

exports.isStateCodeOrName = isStateCodeOrName;