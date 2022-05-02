import merge from './util/merge.js';
import * as ToDate from './toDate.js';

export default function isDate(input, options) {
  
  let tryToMakeDate = ToDate.makeDate(input, options);
  
  if (tryToMakeDate.success == true) {
    return tryToMakeDate;
  }

  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }

  return false;
};
  