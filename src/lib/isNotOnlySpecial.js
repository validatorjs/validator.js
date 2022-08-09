import assertString from './util/assertString';
/**
 * Checks to see whether the input string is not made up of just special characters
 * 
 */
export default function isNotOnlySpecial(str) {
    const result = str.match(/^[A-Z#@,]+$/);
    assertString(str);
    if (result) {
        return true;
    }
    else {
        return false;
    }

}