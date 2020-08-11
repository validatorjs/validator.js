function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import isEmail from './isEmail';
import isRingCentralIvrPin from './isRingCentralIvrPin';
import isRingCentralPassword from './isRingCentralPassword';
export default function isLimitedExtensionPostRequest(requestObj) {
  if (_typeof(requestObj) !== 'object') {
    throw new Error("should be an object not ".concat(_typeof(requestObj)));
  }

  if (!requestObj.ivrPin) {
    throw new Error('ivrPin required');
  } else if (isRingCentralIvrPin(requestObj.ivrPin) === false) {
    throw new Error('ivrPin is invalid');
  }

  if (!requestObj.password) {
    throw new Error('passowrd required');
  } else if (isRingCentralPassword(requestObj.password) === false) {
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
  } else if (isEmail(requestObj.contact.email) === false) {
    throw new Error('contact.email is invalid');
  }

  return true;
}