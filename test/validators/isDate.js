import { test } from './testUtils';

describe('isDate', () => {
  it('should validate date', () => {
    test({
      validator: 'isDate',
      valid: [
        new Date(),
        new Date([2014, 2, 15]),
        new Date('2014-03-15'),
        '2020/02/29',
      ],
      invalid: [
        '',
        '15072002',
        null,
        undefined,
        { year: 2002, month: 7, day: 15 },
        42,
        { toString() { return '[object Date]'; } }, // faking
        '2020-02-30', // invalid date
        '2019-02-29', // non-leap year
        '2020-04-31', // invalid date
        '2020/03-15', // mixed delimiter
      ],
    });
    test({
      validator: 'isDate',
      args: ['DD/MM/YYYY'], // old format for backward compatibility
      valid: [
        '15-07-2002',
        '15/07/2002',
      ],
      invalid: [
        '15/7/2002',
        '15-7-2002',
        '15/7/02',
        '15-7-02',
        '15-07/2002',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ format: 'DD/MM/YYYY' }],
      valid: [
        '15-07-2002',
        '15/07/2002',
      ],
      invalid: [
        '15/7/2002',
        '15-7-2002',
        '15/7/02',
        '15-7-02',
        '15-07/2002',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ format: 'DD/MM/YY' }],
      valid: [
        '15-07-02',
        '15/07/02',
      ],
      invalid: [
        '15/7/2002',
        '15-7-2002',
        '15/07-02',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ format: 'D/M/YY' }],
      valid: [
        '5-7-02',
        '5/7/02',
      ],
      invalid: [
        '5/07/02',
        '15/7/02',
        '15-7-02',
        '5/7-02',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ format: 'DD/MM/YYYY', strictMode: true }],
      valid: [
        '15/07/2002',
      ],
      invalid: [
        '15-07-2002',
        '15/7/2002',
        '15-7-2002',
        '15/7/02',
        '15-7-02',
        '15-07/2002',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ strictMode: true }],
      valid: [
        '2020/01/15',
        '2014/02/15',
        '2014/03/15',
        '2020/02/29',
      ],
      invalid: [
        '2014-02-15',
        '2020-02-29',
        '15-07/2002',
        new Date(),
        new Date([2014, 2, 15]),
        new Date('2014-03-15'),
      ],
    });
    test({
      validator: 'isDate',
      args: [{ delimiters: ['/', ' '] }],
      valid: [
        new Date(),
        new Date([2014, 2, 15]),
        new Date('2014-03-15'),
        '2020/02/29',
        '2020 02 29',
      ],
      invalid: [
        '2020-02-29',
        '',
        '15072002',
        null,
        undefined,
        { year: 2002, month: 7, day: 15 },
        42,
        { toString() { return '[object Date]'; } },
        '2020/02/30',
        '2019/02/29',
        '2020/04/31',
        '2020/03-15',
      ],
    });
    test({
      validator: 'isDate',
      args: [{ format: 'MM.DD.YYYY', delimiters: ['.'], strictMode: true }],
      valid: [
        '01.15.2020',
        '02.15.2014',
        '03.15.2014',
        '02.29.2020',
      ],
      invalid: [
        '2014-02-15',
        '2020-02-29',
        '15-07/2002',
        new Date(),
        new Date([2014, 2, 15]),
        new Date('2014-03-15'),
        '29.02.2020',
      ],
    });
  });
});
