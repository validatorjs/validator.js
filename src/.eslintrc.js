// Library code must run on ES5 engines: package.json declares Node.js >= 0.10
// and the browser build targets IE 11. Babel only transpiles syntax, so ES2015+
// built-ins are forbidden here; no polyfills are shipped.
const message = 'validator.js supports ES5 runtimes (Node.js >= 0.10, IE 11) without polyfills; ' +
  'use an ES5 equivalent (see src/lib/util/).';

const globals = [
  'AggregateError', 'ArrayBuffer', 'Atomics', 'BigInt', 'BigInt64Array', 'BigUint64Array',
  'DataView', 'FinalizationRegistry', 'Float32Array', 'Float64Array', 'Int8Array',
  'Int16Array', 'Int32Array', 'Intl', 'Map', 'Promise', 'Proxy', 'Reflect', 'Set',
  'SharedArrayBuffer', 'Symbol', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array',
  'Uint32Array', 'WeakMap', 'WeakRef', 'WeakSet', 'globalThis',
];

const staticMembers = {
  Array: ['from', 'of'],
  Math: [
    'acosh', 'asinh', 'atanh', 'cbrt', 'clz32', 'cosh', 'expm1', 'fround', 'hypot', 'imul',
    'log10', 'log1p', 'log2', 'sign', 'sinh', 'tanh', 'trunc',
  ],
  Number: [
    'EPSILON', 'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'isFinite', 'isInteger', 'isNaN',
    'isSafeInteger', 'parseFloat', 'parseInt',
  ],
  Object: [
    'assign', 'entries', 'fromEntries', 'getOwnPropertyDescriptors', 'getOwnPropertySymbols',
    'groupBy', 'hasOwn', 'is', 'setPrototypeOf', 'values',
  ],
  String: ['fromCodePoint', 'raw'],
};

// Flagged on any object, since the receiver's type is unknown statically.
const instanceMethods = [
  'at', 'codePointAt', 'copyWithin', 'endsWith', 'fill', 'find', 'findIndex', 'findLast',
  'findLastIndex', 'flat', 'flatMap', 'includes', 'matchAll', 'normalize', 'padEnd',
  'padStart', 'repeat', 'replaceAll', 'startsWith', 'trimEnd', 'trimStart',
];

module.exports = {
  rules: {
    'no-restricted-globals': ['error'].concat(globals.map(name => ({ name, message }))),

    'no-restricted-properties': ['error',
      // Kept from eslint-config-airbnb-base (rule options are replaced, not merged),
      // except its window/self/global.isNaN and isFinite entries, which suggest
      // the ES2015 Number.isNaN and Number.isFinite.
      { object: 'arguments', property: 'callee', message: 'arguments.callee is deprecated' },
      { property: '__defineGetter__', message: 'Please use Object.defineProperty instead.' },
      { property: '__defineSetter__', message: 'Please use Object.defineProperty instead.' },
      { object: 'Math', property: 'pow', message: 'Use the exponentiation operator (**) instead.' },
    ]
      .concat(...Object.keys(staticMembers).map(object => staticMembers[object]
        .map(property => ({ object, property, message }))))
      .concat(instanceMethods.map(property => ({ property, message }))),

    'no-restricted-syntax': ['error',
      // Kept from the root .eslintrc.
      'DebuggerStatement', 'LabeledStatement', 'WithStatement',
      {
        selector: 'Literal[regex.flags=/[yd]/]',
        message: 'The y and d regular expression flags cannot be transpiled to ES5.',
      },
      {
        selector: 'Literal[regex.pattern=/(^|[^\\\\])\\(\\?</]',
        message: 'Named capture groups and lookbehind assertions need ES2015+ engines.',
      },
      {
        selector: ':function[async=true], :function[generator=true]',
        message: 'Async functions and generators need ES2015+ built-ins (Promise, Symbol).',
      },
    ],
  },
};
