"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLimitedExtensionPostRequest;

var _isEmail = _interopRequireDefault(require("./isEmail"));

var _isRingCentralIvrPin = _interopRequireDefault(require("./isRingCentralIvrPin"));

var _isRingCentralPassword = _interopRequireDefault(require("./isRingCentralPassword"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isLimitedExtensionPostRequest(requestObj) {
  if (_typeof(requestObj) !== 'object') {
    throw new Error("should be an object not ".concat(_typeof(requestObj)));
  }

  if (!requestObj.ivrPin) {
    throw new Error('ivrPin required');
  } else if ((0, _isRingCentralIvrPin.default)(requestObj.ivrPin) === false) {
    throw new Error('ivrPin is invalid');
  }

  if (!requestObj.password) {
    throw new Error('passowrd required');
  } else if ((0, _isRingCentralPassword.default)(requestObj.password) === false) {
    throw new Error('password is invalid');
  }

  if (!requestObj.type) {
    throw new Error('type required');
  } else if (requestObj.type !== 'Limited') {
    throw new Error('type should be \'Limited\'');
  }

  if (!requestObj.contact) {
    throw new Error('contact body required');
  }

  if (!requestObj.contact.firstName) {
    throw new Error('contact.firstName required');
  }

  if (requestObj.contact.lastName) {
    throw new Error('contact.lastName forbidden');
  }

  if (!requestObj.contact.email) {
    throw new Error('contact.email required');
  } else if ((0, _isEmail.default)(requestObj.contact.email) === false) {
    throw new Error('contact.email is invalid');
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;