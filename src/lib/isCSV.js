import assertString from './util/assertString';

export default function isCSV(str) {
    assertString(str);
    const regex = /^(\s*[\w\d\s-]+\s*,\s*)*[\w\d\s-]+\s*$/;
    return regex.test(str);
}
