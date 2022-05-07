
import * as ToDate from './toDate';

export default function isDate(input, options) {
  let tryToMakeDate = ToDate.makeDate(input, options);
  if (tryToMakeDate != null) {
    return true;
  }
  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }
  return tryToMakeDate != null;
}