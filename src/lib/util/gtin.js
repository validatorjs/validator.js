/**
  * Calculate GTIN Check Digit
  * Reference: https://en.wikipedia.org/wiki/International_Article_Number#Calculation_of_checksum_digit
  *
  * @param {string} ean
  * @param {function} weightFun
  * @return {number}
  */
export default function calculateCheckDigit(gtin, weightFun) {
  const checksum = gtin
    .slice(0, -1)
    .split('')
    .map((char, index) => Number(char) * weightFun(index))
    .reduce((acc, partialSum) => acc + partialSum, 0);

  const remainder = 10 - (checksum % 10);

  return remainder < 10 ? remainder : 0;
}
