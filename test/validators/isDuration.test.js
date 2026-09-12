import { describe } from 'mocha';
import test from '../testFunctions';

describe('isDuration', () => {
  it('should validate duration strings', () => {
    test({
      validator: 'isDuration',
      valid: [
        '1 week',
        '2 days',
        '1h',
        '30m',
        '15 s',
        '100ms',
        '1.5h',
        '2.5 weeks',
        '-1d',
        '-200',
      ],
      invalid: [
        '',
        'abc',
        '1 invalid',
        'week 1',
        '1.2.3h',
        '+1h', // plus sign is not allowed as in `ms` package
        '+200', // plus sign is not allowed as in `ms` package
      ],
    });
  });

  it('should accept various unit formats', () => {
    test({
      validator: 'isDuration',
      valid: [
        '1 Year',
        '2 WEEKS',
        '3 days',
        '4H',
        '5m',
      ],
    });
  });
});
