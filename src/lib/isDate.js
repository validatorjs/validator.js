import merge from './util/merge';
import startsWith from './util/startsWith';

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
    len = Math.max(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

// ES5 equivalent of `array.find(predicate)`; Array.prototype.find is ES2015.
function find(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) return array[i];
  }
  return undefined;
}

export default function isDate(input, options) {
  // TODO(next major): throw on input that is neither a string nor a Date, like the other
  // validators (assertString). Returning false is the current, documented behaviour
  // (README, "Strings only").
  if (typeof options === 'string') { // Allow backward compatibility for old format isDate(input [, format])
    options = merge({ format: options }, default_date_options);
  } else {
    options = merge(options, default_date_options);
  }
  if (typeof input === 'string' && isValidFormat(options.format)) {
    if (options.strictMode && input.length !== options.format.length) return false;
    const formatDelimiter = find(
      options.delimiters,
      delimiter => options.format.indexOf(delimiter) !== -1
    );
    const dateDelimiter = options.strictMode
      ? formatDelimiter
      : find(options.delimiters, delimiter => input.indexOf(delimiter) !== -1);
    const dateAndFormat = zip(
      input.split(dateDelimiter),
      options.format.toLowerCase().split(formatDelimiter)
    );
    const dateObj = {};

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (!dateWord || !formatWord || dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }

    let fullYear = dateObj.y;

    // Check if the year starts with a hyphen
    if (startsWith(fullYear, '-')) {
      return false; // Hyphen before year is not allowed
    }

    if (dateObj.y.length === 2) {
      const parsedYear = parseInt(dateObj.y, 10);

      if (isNaN(parsedYear)) {
        return false;
      }

      const currentYearLastTwoDigits = new Date().getFullYear() % 100;

      if (parsedYear < currentYearLastTwoDigits) {
        fullYear = `20${dateObj.y}`;
      } else {
        fullYear = `19${dateObj.y}`;
      }
    }

    let month = dateObj.m;

    if (dateObj.m.length === 1) {
      month = `0${dateObj.m}`;
    }

    let day = dateObj.d;

    if (dateObj.d.length === 1) {
      day = `0${dateObj.d}`;
    }

    return new Date(`${fullYear}-${month}-${day}T00:00:00.000Z`).getUTCDate() === +dateObj.d;
  }

  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }

  return false;
}
