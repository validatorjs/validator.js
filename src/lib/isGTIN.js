/**
 * The most commonly used EAN standard is
 * the thirteen-digit EAN-13, while the
 * less commonly used 8-digit EAN-8 barcode was
 * introduced for use on small packages.
 * Also EAN/UCC-14 is used for Grouping of individual
 * trade items above unit level(Intermediate, Carton or Pallet).
 * For more info about EAN-14 checkout: https://www.gtin.info/itf-14-barcodes/
 * EAN consists of:
 * GS1 prefix, manufacturer code, product code and check digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number
 * Reference: https://www.gtin.info/
 */
import assertString from './util/assertString';
import calculateCheckDigit from './util/gtin';
import isEAN from './isEAN';

/**
  * Define EAN Lenghts; 8 for EAN-8; 13 for EAN-13; 14 for EAN-14
  * and Regular Expression for valid EANs (EAN-8, EAN-13, EAN-14),
  * with exact numberic matching of 8 or 13 or 14 digits [0-9]
  */
const validGtinRegex = /^(\d{12}|\d{18})$/;
const LENGTH_GTIN_12 = 12;
const LENGTH_GTIN_18 = 18;
/**
  * Get position weight given:
  * GTIN digit index/position
  *
  * @param {number} index
  * @return {number}
  */
function getPositionWeightThroughIndex(index) {
  return (index % 2 === 0) ? 3 : 1;
}


/**
  * Check if string is valid EAN:
  * Matches GTIN-12/EAN-8/EAN-13/EAN-14 regex
  * Has valid check digit.
  *
  * @param {string} str
  * @return {boolean}
  */
export default function isGTIN(str) {
  assertString(str);
  const actualCheckDigit = Number(str.slice(-1));

  if (str.length !== LENGTH_GTIN_12 && str.length !== LENGTH_GTIN_18) {
    return isEAN(str);
  }

  const weightFunc = getPositionWeightThroughIndex;
  return validGtinRegex.test(str) && actualCheckDigit === calculateCheckDigit(str, weightFunc);
}
