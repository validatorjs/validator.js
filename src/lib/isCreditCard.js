import assertString from './util/assertString';
import isLuhnValid from './isLuhnNumber';

const cards = {
  amex: /^3[47][0-9]{13}$/,
  dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  mastercard: /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, // /^[25][1-7][0-9]{14}$/;
  unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
  visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/,
};

const allCards = (() => {
  const tmpCardsArray = [];
  for (const cardProvider in cards) {
    // istanbul ignore else
    if (cards.hasOwnProperty(cardProvider)) {
      tmpCardsArray.push(cards[cardProvider]);
    }
  }
  return tmpCardsArray;
})();

export default function isCreditCard(card, options = {}) {
  assertString(card);
  const { provider } = options;
  const sanitized = card.replace(/[- ]+/g, '');
  if (provider && provider.toLowerCase() in cards) {
    // specific provider in the list
    if (!(cards[provider.toLowerCase()].test(sanitized))) {
      return false;
    }
  } else if (provider && !(provider.toLowerCase() in cards)) {
    /* specific provider not in the list */
    throw new Error(`${provider} is not a valid credit card provider.`);
  } else if (!allCards.some(cardProvider => cardProvider.test(sanitized))) {
    // no specific provider
    return false;
  }
  return isLuhnValid(card);
}
