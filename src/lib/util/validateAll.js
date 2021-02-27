
import assertString from './assertString';

export default function validateAll(value, ...validatorFunctions) {
  assertString(value);
  const isValidatorFunctionsExist = validatorFunctions.length;

  if (!isValidatorFunctionsExist) {
    throw new Error("validator functions can'nt be empty");
  }

  for (let i = 0; i < validatorFunctions.length; i++) {
    const currentValidatorFunction = validatorFunctions[i];
    const isValid = currentValidatorFunction(value);
    if (!isValid) {
      return false;
    }
  }

  return true;
}
