function isValidFormat(format) {
  return /(^(y{4}|y{2})[\/-](m{1,2})[\/-](d{1,2})$)|(^(m{1,2})[\/-](d{1,2})[\/-]((y{4}|y{2})$))|(^(d{1,2})[\/-](m{1,2})[\/-]((y{4}|y{2})$))/gi.test(format);
}

function zip(date, format) {
  const zippedArr = [],
    len = Math.min(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

export default function isDate(input, format = 'YYYY/MM/DD', strictMode = false) {
  if (typeof input === 'string' && isValidFormat(format)) {
    const formatDelimiter = ['.', '-', '/'].find(delimiter => format.indexOf(delimiter) !== -1);
    const dateDelimiter = strictMode
      ? formatDelimiter
      : ['.', '-', '/'].find(delimiter => input.indexOf(delimiter) !== -1);
    const dateAndFormat = zip(
      input.split(dateDelimiter),
      format.toLowerCase().split(formatDelimiter)
    );
    const dateObj = {};

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }

    return new Date(`${dateObj.m}/${dateObj.d}/${dateObj.y}`).getDate() === +dateObj.d;
  }

  return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
}
