export const float = {
  'en-US': /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
  'pt-BR': /^(?:[-+]?(?:[0-9]+))?(?:,[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
};

export const decimalPointLocales = ['en-AU', 'en-CA', 'en-IN', 'en-GB', 'zh-HK', 'zh-TW'];

for (let locale, i = 0; i < decimalPointLocales.length; i++) {
  locale = decimalPointLocales[i];
  float[locale] = float['en-US'];
}

export const decimalCommaLocales = ['cs-Cz', 'fr-CA', 'fr-FR', 'pt-PT', 'pl-PL', 'ru-RU'];

for (let locale, i = 0; i < decimalCommaLocales.length; i++) {
  locale = decimalCommaLocales[i];
  float[locale] = float['pt-BR'];
}
// Source: https://en.wikipedia.org/wiki/Decimal_mark
