import test from '../testFunctions';

describe('isDuration', () => {
  it('should validate ms-compatible duration strings (default options)', () => {
    test({
      validator: 'isDuration',
      valid: [
        // Bare numbers (implicit milliseconds)
        '0',
        '100',
        '3.5',
        // Short units, no space
        '10ms',
        '1s',
        '2m',
        '3h',
        '4d',
        '5w',
        '6mo',
        '7y',
        // Short units, with space
        '10 ms',
        '1 s',
        '2 m',
        '3 h',
        '4 d',
        '5 w',
        '6 mo',
        '7 y',
        // Long units (plural), case insensitive
        '100 milliseconds',
        '1 second',
        '2 minutes',
        '3 hours',
        '4 days',
        '5 weeks',
        '6 months',
        '7 years',
        // Long units (singular)
        '1 millisecond',
        '1 hour',
        '1 minute',
        '1 day',
        '1 week',
        '1 month',
        '1 year',
        // Abbreviated aliases
        '10 msecs',
        '10 msec',
        '30 secs',
        '30 sec',
        '45 mins',
        '45 min',
        '2 hrs',
        '2 hr',
        '2 yrs',
        '2 yr',
        // Mixed case
        '2 Days',
        '5 HOURS',
        '10MS',
        // Decimal values
        '1.5h',
        '0.5 days',
        '2.75 weeks',
        // Negative values (allowed by default)
        '-1s',
        '-2 hours',
        '-3.5d',
      ],
      invalid: [
        // Empty string
        '',
        // Non-numeric strings
        'abc',
        'foo bar',
        // Unknown unit
        '10xyz',
        '5 lightyears',
        // Multiple components (not supported)
        '1h 30m',
        '2 days 5 hours',
        // Missing number
        's',
        'ms',
        ' ',
        // Just a dot
        '.',
        // Number only with trailing garbage
        '10sx',
      ],
    });
  });

  it('should reject negative durations when allowNegative is false', () => {
    test({
      validator: 'isDuration',
      args: [{ allowNegative: false }],
      valid: ['10s', '2 days', '0', '1.5h'],
      invalid: ['-1s', '-2 hours', '-0.5d'],
    });
  });

  it('should allow negative durations when allowNegative is true (explicit)', () => {
    test({
      validator: 'isDuration',
      args: [{ allowNegative: true }],
      valid: ['-1s', '-2 hours', '10ms'],
    });
  });

  it('should throw on non-string input', () => {
    test({
      validator: 'isDuration',
      error: [null, undefined, 123, [], {}],
    });
  });
});
