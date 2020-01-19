"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmpty;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var default_is_empty_options = {
  ignore_whitespace: false,
  to_string: false
};

function isEmpty(str, options) {
  var emptyValues = [undefined, null, [], false, 0, '', '0'];
  options = (0, _merge.default)(options, default_is_empty_options);

  if (options.to_string) {
    (0, _assertString.default)(str);
  }

  if (options.ignore_whitespace) {
    str = str.trim().length;
  }

  for (var i = 0; i < emptyValues.length; i++) {
    if (str === emptyValues[i]) {
      return true;
    }
  }

  if (_typeof(str) === 'object') {
    for (var key in str) {
      if (str.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;