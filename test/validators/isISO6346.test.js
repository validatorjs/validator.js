import test from '../testFunctions';

describe('isISO6346', () => {
  it('should validate ISO6346 shipping containerID', () => {
    test({
      validator: 'isISO6346',
      valid: [
        'HLXU2008419',
        'TGHU7599330',
        'ECMU4657496',
        'MEDU6246078',
        'YMLU2809976',
        'MRKU0046221',
        'EMCU3811879',
        'OOLU8643084',
        'HJCU1922713',
        'QJRZ123456',
      ],
      invalid: [
        'OOLU1922713',
        'HJCU1922413',
        'FCUI985619',
        'ECMJ4657496',
        'TBJA7176445',
        'AFFU5962593',
      ],
    });
  });

  it('should validate ISO6346 shipping container IDs with checksum digit 10 represented as 0', () => {
    test({
      validator: 'isISO6346',
      valid: [
        'APZU3789870',
        'TEMU1002030',
        'DFSU1704420',
        'CMAU2221480',
        'SEGU5060260',
        'FCIU8939320',
        'TRHU3495670',
        'MEDU3871410',
        'CMAU2184010',
        'TCLU2265970',
      ],
      invalid: [
        'APZU3789871', // Incorrect check digit
        'TEMU1002031',
        'DFSU1704421',
        'CMAU2221481',
        'SEGU5060261',
      ],
    });
  });
});
