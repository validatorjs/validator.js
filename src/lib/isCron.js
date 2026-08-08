import assertString from './util/assertString';

const aliases = [
  '@reboot',
  '@yearly',
  '@annually',
  '@monthly',
  '@weekly',
  '@daily',
  '@midnight',
  '@hourly',
];

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const standardFields = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12, names: months },
  { min: 0, max: 7, names: days },
];

const secondsField = { min: 0, max: 59 };
const digits = /^\d+$/;

function parseValue(value, field) {
  if (digits.test(value)) {
    const number = parseInt(value, 10);
    return number >= field.min && number <= field.max ? number : null;
  }

  if (field.names) {
    const index = field.names.indexOf(value.toUpperCase());
    if (index !== -1) {
      return index + field.min;
    }
  }

  return null;
}

function isValidRange(value, field) {
  const range = value.split('-');

  if (range.length !== 2) {
    return false;
  }

  const start = parseValue(range[0], field);
  const end = parseValue(range[1], field);

  return start !== null && end !== null && start <= end;
}

function isValidItem(value, field) {
  const stepped = value.split('/');

  if (stepped.length > 2 || !stepped[0]) {
    return false;
  }

  if (stepped.length === 2 && (!digits.test(stepped[1]) || parseInt(stepped[1], 10) === 0)) {
    return false;
  }

  if (stepped[0] === '*') {
    return true;
  }

  if (stepped[0].indexOf('-') !== -1) {
    return isValidRange(stepped[0], field);
  }

  return parseValue(stepped[0], field) !== null;
}

function isValidField(value, field) {
  const items = value.split(',');
  return items.length > 0 && items.every(item => isValidItem(item, field));
}

function trimSpacesAndTabs(value) {
  let start = 0;
  let end = value.length;

  while (start < end) {
    const character = value.charAt(start);
    if (character !== ' ' && character !== '\t') {
      break;
    }
    start += 1;
  }

  while (end > start) {
    const character = value.charAt(end - 1);
    if (character !== ' ' && character !== '\t') {
      break;
    }
    end -= 1;
  }

  return value.slice(start, end);
}

export default function isCron(str, options = {}) {
  assertString(str);

  const expression = trimSpacesAndTabs(str);

  if (aliases.indexOf(expression) !== -1) {
    return true;
  }

  const fields = expression.split(/[ \t]+/);
  let fieldDefinitions = standardFields;

  if (fields.length === 6 && options && options.allow_seconds === true) {
    fieldDefinitions = [secondsField].concat(standardFields);
  }

  return fields.length === fieldDefinitions.length &&
    fields.every((field, index) => isValidField(field, fieldDefinitions[index]));
}
