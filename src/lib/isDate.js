function isValidFormat(format) {
  return /(^(y{4}|y{2})[\/-](m{1,2})[\/-](d{1,2})$)|(^(m{1,2})[\/-](d{1,2})[\/-]((y{4}|y{2})$))|(^(d{1,2})[\/-](m{1,2})[\/-]((y{4}|y{2})$))/gi.test(format);
}

function zip(x, y) {
  const zippedArr = [],
    len = Math.min(x.length, y.length);
  let i = 0;

  for (; i < len; i++) {
    zippedArr.push([x[i], y[i]]);
  }

  return zippedArr;
}

export default function isDate(input, format = 'YYYY/MM/DD') {
  if (typeof input === 'string' && isValidFormat(format)) {
    const splitter = /[-/]/,
      dateAndFormat = zip(input.split(splitter), format.toLowerCase().split(splitter)),
      dateObj = {};

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
