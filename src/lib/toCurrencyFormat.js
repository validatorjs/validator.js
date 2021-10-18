/* eslint-disable indent */
import assertCurrency from './util/assertCurrency';

export default function toCurrencyFormat(inputCurrency, currencyType) {
    assertCurrency(inputCurrency);
    let type = `en-${currencyType}`;
    let formatter = new Intl.NumberFormat(type, {
        style: 'currency',
        currency: currencyType,
    });

    return formatter.format(inputCurrency);
}
