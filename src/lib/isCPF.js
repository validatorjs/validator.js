import assertString from './util/assertString';

const defaultOptions = { separators: 'optional' }; // 'require', 'none' or 'optional' (default)

const formatSeparators = /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/; // 000.000.000-00
const formatPlain = /^(\d{3})(\d{3})(\d{3})(\d{2})$/; // 00000000000
const formatBoth = /^(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})$/; // both formats above, i.e., optional separators

const weightsFirstDigit = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const weightsSecondDigit = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function calculateDigit(values, weights) {
  const sum = values.reduce((acc, cur, i) => acc + (cur * weights[i]), 0);
  const remainder = sum % 11;
  return String(remainder < 2 ? 0 : 11 - remainder);
}

export default function isCPF(str, options = defaultOptions) {
  assertString(str);
  const { separators } = { ...defaultOptions, ...options };

  let format = formatBoth;
  if (separators === 'require') format = formatSeparators;
  else if (separators === 'none') format = formatPlain;

  const match = format.exec(str);
  if (!match) return false;
  const cpf = Array.from(match[1] + match[2] + match[3]);

  const digit1 = calculateDigit(cpf, weightsFirstDigit);
  const digit2 = calculateDigit(cpf.concat(digit1), weightsSecondDigit);

  const [first, second] = match[4];
  return first === digit1 && second === digit2;
}
