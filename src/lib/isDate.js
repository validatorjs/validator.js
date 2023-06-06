import merge from './util/merge';

const default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false,
};

function isValidFormat(format) {
  return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(format);
}

function zip(date, format) {
  const zippedArr = [],
    len = Math.min(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

export default function isDate(input, options) {
  if (typeof options === 'string') { // Allow backward compatbility for old format isDate(input [, format])
    options = merge({ format: options }, default_date_options);
  } else {
    options = merge(options, default_date_options);
  }
  if (typeof input === 'string' && isValidFormat(options.format)) {
    const formatDelimiter = options.delimiters
      .find(delimiter => options.format.indexOf(delimiter) !== -1);
    const dateDelimiter = options.strictMode
      ? formatDelimiter
      : options.delimiters.find(delimiter => input.indexOf(delimiter) !== -1);
    const dateAndFormat = zip(
      input.split(dateDelimiter),
      options.format.toLowerCase().split(formatDelimiter)
    );
    const dateObj = {};

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }

    let fullYear = dateObj.y;

    if (dateObj.y.length === 2) {
      const currentYearLastTwoDigits = new Date().getFullYear() % 100;

      if (parseInt(dateObj.y, 10) < currentYearLastTwoDigits) {
        fullYear = `20${dateObj.y}`;
      } else {
        fullYear = `19${dateObj.y}`;
      }
    }

    return new Date(`${fullYear}-${dateObj.m}-${dateObj.d}`).getDate() === +dateObj.d;
  }

  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }

  return false;
}
