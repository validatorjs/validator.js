export default function assertCurrency(input) {
  const isCurrencyFormat = Number.isInteger(input) || (Number(input) === input && input % 1 !== 0);

  if (!isCurrencyFormat) {
    let invalidType = typeof input;
    if (input === null) invalidType = 'null';
    else if (invalidType === 'object') invalidType = input.constructor.name;

    throw new TypeError(`Expected a int or float but received a ${invalidType}`);
  }
}

