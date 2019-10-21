import assertString from './util/assertString';

const creditCardNumber_19 = /[0-9]{19}/;

export default function is19DigitCreditCard(str) {
  assertString(str);
  return creditCardNumber_19.test(str);
}
