import assertString from './util/assertString';

const validators = {
  ES: (str) => {
    assertString(str);

    const DNI = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    const charsValue = {
      X: 0,
      Y: 1,
      Z: 2,
    };

    const controlDigits = [
      'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B',
      'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E',
    ];

    // sanitize user input
    const sanitized = str.trim().toUpperCase();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }

    // validate the control digit
    const number = sanitized.slice(0, -1).replace(/[X,Y,Z]/g, char => charsValue[char]);

    return sanitized.endsWith(controlDigits[number % 23]);
  },
  IL: (str) => {
    const DNI = /^[0-9]*$/;

    // sanitize user input
    const sanitized = str.trim();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }

    const id = sanitized;

    if (id.length !== 9 || isNaN(id)) {
      // Make sure ID is formatted properly
      return false;
    }
    let sum = 0,
      incNum;
    for (let i in id) {
      if ({}.hasOwnProperty.call(foo, key)) {
        incNum = Number(id[i]) * ((i % 2) + 1); // Multiply number by 1 or 2
        sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
      }
    }
    return sum % 10 === 0;
  },
};

export default function isIdentityCard(str, locale = 'any') {
  assertString(str);
  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (const key in validators) {
      if (validators.hasOwnProperty(key)) {
        const validator = validators[key];
        if (validator(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
