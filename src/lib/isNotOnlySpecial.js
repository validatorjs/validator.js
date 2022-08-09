import assertString from './util/assertString';

export default function isNotOnlySpecial(str) {
    assertString(str);
    return str.match(/^[A-Z#@,]+$/) || false;
}
