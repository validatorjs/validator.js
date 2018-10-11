'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isJWT;

var _assertString = require('./util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = require('./util/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_is_jwt_options = {
  prefix: undefined
};

function isJWT(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_is_jwt_options);

  if (options.prefix) {
    var final_pattern = '^{{pattern}} [a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+\\.[a-zA-Z0-9\\-_]+$';

    return new RegExp(final_pattern.replace('{{pattern}}', options.prefix)).test(str);
  }

  return (/^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/.test(str)
  );
}
module.exports = exports['default'];