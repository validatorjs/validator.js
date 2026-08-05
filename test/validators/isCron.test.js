import test from '../testFunctions';

describe('isCron', () => {
  it('should validate common five-field cron expressions', () => {
    test({
      validator: 'isCron',
      valid: [
        '* * * * *',
        '0 0 1 1 *',
        '*/15 0 1,15 * 1-5',
        '0-59/2 0,12 1-31 JAN-MAR MON-FRI',
        '5 4 * * sun',
        '0 0 * jan,feb mon,wed,fri',
        '00 04 01 01 0',
        '0 0 31 2 *',
        '0 0 * * 7',
        '0 0 * * SUN-SAT/2',
        '0/35 * * * *',
        '  0\t0  *  *  *  ',
      ],
      invalid: [
        '',
        '   ',
        '* * * *',
        '* * * * * *',
        '60 * * * *',
        '* 24 * * *',
        '* * 0 * *',
        '* * 32 * *',
        '* * * 0 *',
        '* * * 13 *',
        '* * * * 8',
        '* * * * MONDAY',
        '* * * FOO *',
        '* * * DEC-JAN *',
        '* * * * FRI-MON',
        '* * * * -1',
        '1.5 * * * *',
        '1foo * * * *',
        '*/0 * * * *',
        '*/ * * * *',
        '*//2 * * * *',
        '1-2-3 * * * *',
        '1, * * * *',
        '1,,2 * * * *',
        '0 0\n* * *',
        '0\u00a00 * * *',
        '? * * * *',
        '* * L * *',
        '* * * * 3#2',
        '@daily command',
      ],
    });
  });

  it('should validate standard cron aliases', () => {
    test({
      validator: 'isCron',
      valid: [
        '@reboot',
        '@yearly',
        '@annually',
        '@monthly',
        '@weekly',
        '@daily',
        '@midnight',
        '@hourly',
        ' @daily ',
      ],
      invalid: [
        '@secondly',
        '@DAILY',
        '@daily extra',
      ],
    });
  });

  it('should optionally validate expressions with a leading seconds field', () => {
    test({
      validator: 'isCron',
      args: [{ allow_seconds: true }],
      valid: [
        '* * * * *',
        '* * * * * *',
        '*/10 0 0 1 JAN MON',
        '0-59/15 0,30 8-17 * * MON-FRI',
      ],
      invalid: [
        '60 * * * * *',
        '* * * * * * *',
        '0 0 0 ? * MON',
      ],
    });

    test({
      validator: 'isCron',
      args: [null],
      valid: ['* * * * *'],
      invalid: ['* * * * * *'],
    });
  });

  it('should reject non-string inputs', () => {
    test({
      validator: 'isCron',
      error: [null, undefined, 0, {}, []],
    });
  });
});
