/*
 * The subset of Node.js' `util` API that the test files use (`format`, for
 * failure messages), for the browser test bundle built by test/browser/run.mjs.
 */

function formatValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
}

// Supports %s, %d, %i, %f, %j, %o, %O and %%, plus extra arguments appended
// with a space, like util.format().
export function format(template, ...args) {
  let index = 0;
  let result = String(template).replace(/%([sdifjoO%])/g, (match, type) => {
    if (type === '%') return '%';
    if (index >= args.length) return match;
    const value = args[index];
    index += 1;
    switch (type) {
      case 's': return typeof value === 'object' && value !== null ? formatValue(value) : String(value);
      case 'd': return String(Number(value));
      case 'i': return String(parseInt(value, 10));
      case 'f': return String(parseFloat(value));
      default: return formatValue(value);
    }
  });
  while (index < args.length) {
    result += ` ${formatValue(args[index])}`;
    index += 1;
  }
  return result;
}

export default { format };
