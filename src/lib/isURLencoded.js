//isURLencoded.js
import assertString from './util/assertString';

function isURLencoded(str) {
 return /\%/i.test(str)
}
