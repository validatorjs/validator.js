import assertString from './util/assertString';
import merge from './util/merge.js';

export const default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false,
};

function zip(date, format) {
  const zippedArr = [],
  len = Math.min(date.length, format.length);
  
  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }
  return zippedArr;
};

function isValidFormat(format) {
  return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(format);
}





export default function toDate(date, options) {
  assertString(date);
  return makeDate(date, options);
}
  
  
  
  /**
  
  The original `isDate` had a handy little bit of code that made a `Date` object and then
  used that to test for validity. i.e. if the `Date` was successfully made then the original
  input string must be a valid date.
  
  However, to offer max versitility, why not take that code - which is constructing a `Date` anyway -
  and make a function from it. This way either a string can be input to simply check if it
  is a date or actually grab the constructed `Date`.
  
  So this function now accepts the same parameters as the `isDate.js` and returns:
  
  { success: Boolean, date: Date }
  
  Where `success` is true if the `String` correctly describes a valid date and
  `date` is either a `Date` object or `null` if it's not able to make a date from the `String`.
  
  */
  export function makeDate(input, options) {
    
    if (typeof options === 'string') { // Allow backward compatbility for old format isDate(input [, format])
      options = merge({ format: options }, default_date_options);
    } else {
      options = merge(options, default_date_options);
    }
    if (typeof input === 'string' && isValidFormat(options.format)) {
      // Requires this check so Browser now knows what type `options` is
      if (typeof options !== typeof default_date_options) { return null; };
      
      const formatDelimiter = options.delimiters.find(delimiter => options.format.indexOf(delimiter) !== -1);
      const dateDelimiter = options.strictMode ? formatDelimiter : options.delimiters.find(delimiter => input.indexOf(delimiter) !== -1);
      const dateAndFormat = zip(input.split(dateDelimiter), options.format.toLowerCase().split(formatDelimiter));
      const dateObj = {};
      
      for (const [dateWord, formatWord] of dateAndFormat) {
        if (dateWord.length !== formatWord.length) {
          return null;
        }
        
        dateObj[formatWord.charAt(0)] = dateWord;
      }
      
      let returnDate = new Date(`${dateObj.m}/${dateObj.d}/${dateObj.y}`);
      
      if (returnDate.getDate() === +dateObj.d) {
        return returnDate;
      }
    }
    
    return null;
  };