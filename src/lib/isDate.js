import merge from './util/merge';

const default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false,
};

function isValidFormat(format) {
  // Formats with delimiters
  const withDelimiters = /(^(y{4}|y{2})[\.\/-](m{1,2})[\.\/-](d{1,2})$)|(^(m{1,2})[\.\/-](d{1,2})[\.\/-]((y{4}|y{2})$))|(^(d{1,2})[\.\/-](m{1,2})[\.\/-]((y{4}|y{2})$))/gi;

  // Formats without delimiters (e.g., YYYYMMDD, YYMMDD, MMDDYYYY, DDMMYYYY)
  const withoutDelimiters = /^(y{4}|y{2})(m{2})(d{2})$|^(m{2})(d{2})(y{4}|y{2})$|^(d{2})(m{2})(y{4}|y{2})$/gi;

  return withDelimiters.test(format) || withoutDelimiters.test(format);
}

function zip(date, format) {
  const zippedArr = [],
    len = Math.max(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

function hasNoDelimiter(format, delimiters) {
  return !delimiters.some(delimiter => format.indexOf(delimiter) !== -1);
}

function parseDelimiterlessFormat(format) {
  // Extract component positions from format like
  // YYYYMMDD, YYMMDD, MMDDYYYY, DDMMYYYY
  const lowerFormat = format.toLowerCase();
  const components = [];
  let pos = 0;

  while (pos < lowerFormat.length) {
    const char = lowerFormat[pos];
    let len = 0;

    while (pos + len < lowerFormat.length && lowerFormat[pos + len] === char) {
      len += 1;
    }

    components.push({
      type: char,
      start: pos,
      length: len,
    });

    pos += len;
  }

  return components;
}

function extractDatePartsWithoutDelimiter(input, format) {
  const components = parseDelimiterlessFormat(format);
  const dateObj = {};

  for (const comp of components) {
    dateObj[comp.type] = input.substring(
      comp.start,
      comp.start + comp.length
    );
  }

  return dateObj;
}

export default function isDate(input, options) {
  // Allow backward compatibility for old format isDate(input [, format])
  if (typeof options === 'string') {
    options = merge({ format: options }, default_date_options);
  } else {
    options = merge(options, default_date_options);
  }

  // Handle non-string input
  if (typeof input !== 'string' || !isValidFormat(options.format)) {
    if (!options.strictMode) {
      return (
        Object.prototype.toString.call(input) === '[object Date]' &&
        isFinite(input)
      );
    }
    return false;
  }

  if (options.strictMode && input.length !== options.format.length) {
    return false;
  }

  let dateObj;

  // Check if format has no delimiters (e.g., YYYYMMDD)
  if (hasNoDelimiter(options.format, options.delimiters)) {
    // Delimiter-less format parsing
    if (input.length !== options.format.length) {
      return false;
    }
    dateObj = extractDatePartsWithoutDelimiter(input, options.format);
  } else {
    // Original delimiter-based parsing
    const formatDelimiter = options.delimiters
      .find(delimiter => options.format.indexOf(delimiter) !== -1);
    const dateDelimiter = options.strictMode
      ? formatDelimiter
      : options.delimiters.find(delimiter => input.indexOf(delimiter) !== -1);
    const dateAndFormat = zip(
      input.split(dateDelimiter),
      options.format.toLowerCase().split(formatDelimiter)
    );
    dateObj = {};

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (!dateWord || !formatWord || dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }
  }

  let fullYear = dateObj.y;

  // Check if the year starts with a hyphen
  if (fullYear.startsWith('-')) {
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

  const month = dateObj.m.length === 1 ? `0${dateObj.m}` : dateObj.m;
  const day = dateObj.d.length === 1 ? `0${dateObj.d}` : dateObj.d;

  const dateString = `${fullYear}-${month}-${day}T00:00:00.000Z`;
  return new Date(dateString).getUTCDate() === +dateObj.d;
}
