/**
 * The `isPalindrome` function checks if a given string is a palindrome.
 * @param str - The `str` parameter is a string that represents the input value to check if it is a
 * palindrome.
 * @returns The function isPalindrome is returning a boolean value. It returns true if the input string
 * is a palindrome (reads the same forwards and backwards), and false otherwise.
 */
import assertString from "./util/assertString";

export default function isPalindrome(str) {
    assertString(str);
    const str0 = str.toLowerCase().replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
    const str1 = str0.split(" ").join("").split("").join("");
    const str2 = str0.split(" ").join("").split("").reverse().join("");

    return str1 === str2;
}