const opts = ['yes', 'no', 'y', 'n'];
const convertToBoolean = (value) => {
  const parsedValue = typeof value === 'string' ? value.toLowerCase() : value;
  if (opts.includes(parsedValue)) {
    if (parsedValue.startsWith('n')) { return false; }
    return true;
  }
  return Boolean(parsedValue);
};
export default function isTruthy(value) {
  return convertToBoolean(value);
}
