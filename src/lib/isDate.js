import merge from "./util/merge";

const default_date_options = {
  format: "YYYY/MM/DD",
  delimiters: ["/", "-"],
  strictMode: false,
};

function isValidFormat(format) {
  return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(
    format
  );
}

function zip(date, format) {
  const zippedArr = [],
    len = Math.max(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

export default function isDate(input, options) {
  if (typeof options === "string") {
    // Allow backward compatibility for old format isDate(input [, format])
    options = merge({ format: options }, default_date_options);
  } else {
    options = merge(options, default_date_options);
  }
  if (typeof input === "string" && isValidFormat(options.format)) {
    // Ensure the input contains at least one valid delimiter
    const hasValidDelimiter = options.delimiters.some((delimiter) =>
      input.includes(delimiter)
    );
    if (!hasValidDelimiter) {
      return false;
    }

    const formatDelimiter = options.delimiters.find(
      (delimiter) => options.format.indexOf(delimiter) !== -1
    );
    const dateDelimiter = options.strictMode
      ? formatDelimiter
      : options.delimiters.find((delimiter) => input.indexOf(delimiter) !== -1);

    // Split input and format by the delimiters
    const inputParts = input.split(dateDelimiter);
    const formatParts = options.format.toLowerCase().split(formatDelimiter);

    // Check if splitting produced the same number of parts
    if (inputParts.length !== formatParts.length) {
      return false;
    }

    const dateAndFormat = zip(inputParts, formatParts);
    const dateObj = {};

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (!dateWord || !formatWord || dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }

    let fullYear = dateObj.y;

    // Check if the year starts with a hyphen
    if (fullYear.startsWith("-")) {
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

    // Construct a date string in the format YYYY-MM-DD and validate
    const parsedDate = new Date(`${fullYear}-${month}-${day}T00:00:00.000Z`);
    return parsedDate.getUTCDate() === +dateObj.d; // Check if the day matches
  }

  if (!options.strictMode) {
    return (
      Object.prototype.toString.call(input) === "[object Date]" &&
      isFinite(input)
    );
  }

  return false;
}
