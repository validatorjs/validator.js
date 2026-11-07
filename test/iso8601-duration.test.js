import assert from 'assert';
import validator from '../src/index';
import test from './testFunctions';

describe('ISO 8601 durations', () => {
  it('validates ordered date and time components with omitted zero units', () => {
    test({
      validator: 'isISO8601Duration',
      valid: [
        'P3Y6M4DT12H30M5S', 'P1Y', 'P1M', 'P1D', 'PT1H', 'PT1M', 'PT1S',
        'P1Y1D', 'P1Y1MT1H1S', 'P1DT1S', 'PT1H1S', 'P0D', 'PT0S',
        'P0Y0M0DT0H0M0S', 'P0001Y02M03DT04H05M06S',
        'P10000Y', 'P13M', 'P40D', 'PT24H', 'PT60M', 'PT60S',
      ],
      invalid: [
        '', 'P', 'PT', 'P1YT', 'P1DT', 'P1', 'PT1', '1Y', '1H',
        'P1H', 'P1S', 'PT1Y', 'PT1D', 'P1D1M', 'P1M1Y', 'PT1S1M',
        'P1Y1Y', 'P1M1M', 'P1D1D', 'PT1H1H', 'PT1M1M', 'PT1S1S',
        'P1DT1HT1M', 'PT1H1DT1M', 'P1Q', 'PT1MS', 'P1M2',
      ],
    });
  });

  it('allows a decimal fraction only on the smallest represented unit', () => {
    test({
      validator: 'isISO8601Duration',
      valid: [
        'P0.5Y', 'P1,5M', 'P1Y2.5M', 'P1Y2M3,5D',
        'PT1.5H', 'PT1H30.5M', 'PT1H30M5.123456789123456789S',
        'P1DT0,00000000000001S', 'P0.0D', 'PT0001,50S',
      ],
      invalid: [
        'P.5Y', 'PT,5S', 'P1.Y', 'PT1,S', 'PT1.2.3S', 'PT1,2.3S',
        'P1.5Y2M', 'P1,5M2D', 'P1.5DT1H', 'PT1.5H1M', 'PT1,5M1S',
        'P1.0Y0M', 'P1.5Y0M0D', 'PT1.0H0S', 'PT1e3S', 'PTInfinityS',
      ],
    });
  });

  it('accepts standalone weeks and rejects mixing weeks with other units', () => {
    test({
      validator: 'isISO8601Duration',
      valid: ['P1W', 'P0W', 'P001W', 'P52W', 'P0.5W', 'P1,25W'],
      invalid: [
        'PW', 'P1WW', 'PT1W', 'P1W1D', 'P1Y1W', 'P1M1W',
        'P1WT1H', 'P1WT', 'P1.5W1D', 'P1W2W',
      ],
    });
  });

  it('accepts calendar and ordinal alternative formats consistently', () => {
    test({
      validator: 'isISO8601Duration',
      valid: [
        'P00030604T123005', 'P0003-06-04T12:30:05',
        'P00021015T103020', 'P0002-10-15T10:30:20',
        'P0002178T223355', 'P0002-178T22:33:55',
        'P00000000T000000', 'P0000-00-00T00:00:00',
        'P0000000T000000', 'P0000-000T00:00:00',
        'P0001-02-30T00:00:00', 'P0001-366T00:00:00',
        'P99991230T246060', 'P9999-12-30T24:60:60',
      ],
      invalid: [
        'P0003-06-04T123005', 'P00030604T12:30:05',
        'P0002-178T223355', 'P0002178T22:33:55',
        'P0003-0604T12:30:05', 'P000306-04T12:30:05',
        'P0003-06-04T1230:05', 'P0003-06-04T12:3005',
        'P0003-06-04T1:30:05', 'P0003-6-4T12:30:05',
        'P003-06-04T12:30:05', 'P10000-06-04T12:30:05',
        'P0003-13-00T00:00:00', 'P0003-00-31T00:00:00',
        'P0003-367T00:00:00', 'P0003367T000000',
        'P0000-00-00T25:00:00', 'P00000000T250000',
        'P0000-00-00T00:61:00', 'P00000000T006100',
        'P0000-00-00T00:00:61', 'P00000000T000061',
        'P0003-W06-4T12:30:05', 'P0003W064T123005',
        'P0003-06T12:30:05', 'P0003T12:30:05',
        'P0003-06-04T', 'P0003-06-04T12:30:05Z',
        'P0003-06-04T12:30:05+01:00', 'P0003-06-04T12:30:05\n',
      ],
    });
  });

  it('accepts reduced time precision and fractions in alternative formats', () => {
    test({
      validator: 'isISO8601Duration',
      valid: [
        'P00030604T12', 'P0003-06-04T12',
        'P00030604T1230', 'P0003-06-04T12:30',
        'P0002178T22', 'P0002-178T22:33',
        'P00030604T12.5', 'P0003-06-04T12,5',
        'P00030604T1230.5', 'P0003-06-04T12:30,5',
        'P0002178T223355.5', 'P0002-178T22:33:55,5',
        'P0000-00-00T23.999999999999999999',
        'P0000-00-00T24.000', 'P0000-00-00T00:60,0',
        'P0000-00-00T00:00:60.000',
      ],
      invalid: [
        'P00030604T123', 'P00030604T12305',
        'P0003-06-04T12:', 'P0003-06-04T12:30:',
        'P0003-06-04T12.5:30', 'P0003-06-04T12:30,5:05',
        'P0003-06.5-04T12:30:05', 'P0003-06-04.5T12:30:05',
        'P0003-06-04T12.', 'P0003-06-04T12,',
        'P0000-00-00T24.000000000000000001',
        'P0000-00-00T00:60.000000000000000001',
        'P0000-00-00T00:00:60.000000000000000001',
      ],
    });
  });

  it('accepts alternative date-only and time-only representations', () => {
    test({
      validator: 'isISO8601Duration',
      valid: [
        'P00', 'P20', 'P99', 'P0000', 'P0003', 'P9999',
        'P0003-00', 'P0003-12', 'P00030604', 'P0003-06-04',
        'P0002178', 'P0002-178', 'P0000-000', 'P0001-366',
        'PT12', 'PT1230', 'PT123005', 'PT12:30', 'PT12:30:05',
        'PT00', 'PT12.5', 'PT1230,5', 'PT12:30,5',
        'PT123005.5', 'PT12:30:05.5', 'PT24', 'PT0060', 'PT00:60:60',
      ],
      invalid: [
        'P0', 'P000', 'P00000', 'P000306', 'P0003-13', 'P0003-6',
        'P0003-31', 'P0003367', 'P0000-0000', 'P0000-0',
        'P0003-06T12', 'P0003T12', 'P20T12',
        'PT1', 'PT123', 'PT12305', 'PT12300500', 'PT12:',
        'PT12:3005', 'PT1230:05', 'PT25', 'PT00:61', 'PT000061',
        'PT24.000000000000000001', 'PT00:60.000000000000000001',
        'P0003.5', 'P0003-06.5', 'P20.5', 'P0000-000.5',
        'PT12Z', 'P+00003', 'P+00003-06-04T12:30:05',
        'P0003\n', 'PT12\n', 'P0003-06-04\n',
      ],
    });
  });

  it('requires complete uppercase duration strings without signs or intervals', () => {
    test({
      validator: 'isISO8601Duration',
      valid: ['P1D', 'PT12H30M'],
      invalid: [
        'p1d', 'Pt1H', 'PT1h', '+P1D', '-P1D', 'P-1D', 'PT+1S',
        ' P1D', 'P1D ', 'P 1D', 'PT1 H', 'P1D\n', 'P1D\r\n', 'P1D\t',
        'P1D\u0000', 'P1D\u2028', 'P1D\u2029',
        'prefixP1D', 'P1Dsuffix', '2024-01-01', '2024-01-01/P1D',
        'P1D/2024-01-02', 'R5/P1D', 'PT1HZ', 'PT1H+01:00',
        'P\u0661D', 'P\uff11D',
      ],
    });
  });

  it('validates long quantities without losing precision or matching a prefix', () => {
    const digits = '9'.repeat(10000);
    test({
      validator: 'isISO8601Duration',
      valid: [`P${digits}D`, `PT0.${digits}S`, `P${digits}W`],
      invalid: [
        `P${digits}`, `P${digits}X`, `PT${digits}.S`, `PT0.${digits}Sx`,
        `P${digits}.5Y1M`,
      ],
    });
  });

  it('follows the string-only validator contract', () => {
    assert.strictEqual(typeof validator.isISO8601Duration, 'function');
    [null, undefined, 1, true, {}, [], new Date()].forEach((value) => {
      assert.throws(() => validator.isISO8601Duration(value), TypeError);
    });
  });

  it('keeps date validation separate from duration validation', () => {
    assert.strictEqual(validator.isISO8601Duration('P1D'), true);
    assert.strictEqual(validator.isISO8601('P1D'), false);
    assert.strictEqual(validator.isISO8601Duration('2024-01-01'), false);
    assert.strictEqual(validator.isISO8601('2024-01-01'), true);
  });
});
