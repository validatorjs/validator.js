import assertString from './util/assertString';

const colorFormats = {
  hex: /^#((\d|[a-f]){3}|(\d|[a-f]){6})$/i,
  hexa: /^#(\d|[a-f]){8}$/i,
  rgb: /^rgb\(((\s*0*(2(5[0-5]|[0-4]\d)|1?\d{1,2})\s*,){2}\s*0*(2(5[0-5]|[0-4]\d)|1?\d{1,2})\s*|(\s*(0*100|0*\d{1,2})%\s*,){2}\s*(0*100|0*\d{1,2})%\s*)\)$/i,
  rgba: /^rgba\(((\s*0*(2(5[0-5]|[0-4]\d)|1?\d{1,2})\s*,){2}\s*0*(2(5[0-5]|[0-4]\d)|1?\d{1,2})\s*|(\s*(0*100|0*\d{1,2})%\s*,){2}\s*(0*100|0*\d{1,2})%\s*),\s*\d+(\.\d+)?%?\s*\)$/i,
  hsl: /^hsl\(\s*-?\d*\s*(,\s*\d*%\s*){2}\)$/i,
  hsla: /^hsla\(\s*-?\d*\s*(,\s*\d*%\s*){2},\s*\d+(\.\d+)?%?\s*\)$/i,
};

export default function (str, options) {
  assertString(str);

  if (options?.format) return colorFormats[options.format]?.test(str.trim());
  for (const format of Object.values(colorFormats)) {
    if (format.test(str.trim())) return true;
  }
  return false;
}
