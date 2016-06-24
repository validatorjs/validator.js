'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var float = exports.float = {
  'en-US': /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
  'pt-BR': /^(?:[-+]?(?:[0-9]+))?(?:,[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
};

var decimalPointLocales = exports.decimalPointLocales = ['en-AU', 'en-CA', 'en-IN', 'en-GB', 'zh-HK', 'zh-TW'];

for (var locale, i = 0; i < decimalPointLocales.length; i++) {
  locale = decimalPointLocales[i];
  float[locale] = float['en-US'];
}

var decimalCommaLocales = exports.decimalCommaLocales = ['cs-Cz', 'fr-CA', 'fr-FR', 'pt-PT', 'pl-PL', 'ru-RU'];

for (var _locale, _i = 0; _i < decimalCommaLocales.length; _i++) {
  _locale = decimalCommaLocales[_i];
  float[_locale] = float['pt-BR'];
}
// Source: https://en.wikipedia.org/wiki/Decimal_mark