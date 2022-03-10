import assertString from './assertString';

export default function isExact(str) {
  assertString(str);
  let match = false;
  for(let i = 1; i <= arguments.length-1; i++){
    const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    const len = str.length - surrogatePairs.length;
    if(len === arguments[i]){
        match = true;
    }
  }
  return match;
}