import assertString from './util/assertString';

const upperCaseRegex = /^[A-Z]$/;
const lowerCaseRegex = /^[a-z]$/;
const numberRegex = /^[0-9]$/;
const symbolRegex = /^[-#!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/;

/* Counts number of occurances of each char in a string
 * could be moved to util/ ?
*/
function countFrom(str) {
  let result = {};
  Array.from(str).forEach((char) => {
    let curVal = result[char];
    if (curVal) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  });
  return result;
}

/* Return information about a password */
function analyzePassword(password) {
  let charMap = countFrom(password);
  let analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0,
  };
  Object.keys(charMap).forEach((char) => {
    if (upperCaseRegex.test(char)) {
      analysis.uppercaseCount += charMap[char];
    } else if (lowerCaseRegex.test(char)) {
      analysis.lowercaseCount += charMap[char];
    } else if (numberRegex.test(char)) {
      analysis.numberCount += charMap[char];
    } else if (symbolRegex.test(char)) {
      analysis.symbolCount += charMap[char];
    }
  });
  return analysis;
}

/* Scores passwords
 * Optional Parameters for isStrongPassword:
 * score           : if true, will return the calculated score rather than true/false
 * strongThreshold : replace the default threshold for what score a strong password receives
*/

export default function isStrongPassword(password, score = false, strongThreshold = 50) {
  assertString(password);
  let analysis = analyzePassword(password);
  let points = analysis.uniqueChars;
  points += (analysis.length - analysis.uniqueChars) * 0.2;
  if (analysis.lowercaseCount > 0) {
    points += 10;
  }
  if (analysis.uppercaseCount > 0) {
    points += 10;
  }
  if (analysis.numberCount > 0) {
    points += 10;
  }
  if (analysis.symbolCount > 0) {
    points += 10;
  }
  return score ? points : points >= strongThreshold;
}
