import test from '../testFunctions';

describe('isPostalCode', () => {
  it('should validate postal code', () => {
    const fixtures = [
      {
        locale: 'AU',
        valid: ['4000', '2620', '3000', '2017', '0800'],
      },
      {
        locale: 'BY',
        valid: ['225320', '211120', '247710', '231960'],
        invalid: ['test 225320', '211120 test', '317543', '267946'],
      },
      {
        locale: 'CA',
        valid: [
          'L4T 0A5',
          'G1A-0A2',
          'A1A 1A1',
          'X0A-0H0',
          'V5K 0A1',
          'A1C 3S4',
          'A1C3S4',
          'a1c 3s4',
          'V9A 7N2',
          'B3K 5X5',
          'K8N 5W6',
          'K1A 0B1',
          'B1Z 0B9',
        ],
        invalid: [
          '        ',
          'invalid value',
          'a1a1a',
          'A1A  1A1',
          'K1A 0D1',
          'W1A 0B1',
          'Z1A 0B1',
        ],
      },
      {
        locale: 'CO',
        valid: ['050034', '110221', '441029', '910001'],
        invalid: ['11001', '000000', '109999', '329999'],
      },
      {
        locale: 'ES',
        valid: ['01001', '52999', '27880'],
        invalid: ['123', '1234', '53000', '052999', '0123', 'abcde'],
      },
      {
        locale: 'JP',
        valid: ['135-0000', '874-8577', '669-1161', '470-0156', '672-8031'],
      },
      {
        locale: 'GR',
        valid: ['022 93', '29934', '90293', '299 42', '94944'],
      },
      {
        locale: 'GB',
        valid: [
          'TW8 9GS',
          'BS98 1TL',
          'DE99 3GG',
          'DE55 4SW',
          'DH98 1BT',
          'DH99 1NS',
          'GIR0aa',
          'SA99',
          'W1N 4DJ',
          'AA9A 9AA',
          'AA99 9AA',
          'BS98 1TL',
          'DE993GG',
        ],
      },
      {
        locale: 'FR',
        valid: ['75008', '44522', '38499', '39940', '01000'],
        invalid: ['44 522', '38 499', '96000', '98025'],
      },
      {
        locale: 'ID',
        valid: ['10210', '40181', '55161', '60233'],
      },
      {
        locale: 'IE',
        valid: ['A65 TF12', 'A6W U9U9'],
        invalid: [
          '123',
          '75690HG',
          'AW5  TF12',
          'AW5 TF12',
          '756  90HG',
          'A65T F12',
          'O62 O1O2',
        ],
      },
      {
        locale: 'IN',
        valid: ['364240', '360005'],
        invalid: [
          '123',
          '012345',
          '011111',
          '101123',
          '291123',
          '351123',
          '541123',
          '551123',
          '651123',
          '661123',
          '861123',
          '871123',
          '881123',
          '891123',
        ],
      },
      {
        locale: 'IL',
        valid: [
          '10200',
          '10292',
          '10300',
          '10329',
          '3885500',
          '4290500',
          '4286000',
          '7080000',
        ],
        invalid: [
          '123',
          '012345',
          '011111',
          '101123',
          '291123',
          '351123',
          '541123',
          '551123',
          '651123',
          '661123',
          '861123',
          '871123',
          '881123',
          '891123',
        ],
      },
      {
        locale: 'BG',
        valid: ['1000'],
      },
      {
        locale: 'IR',
        valid: ['4351666456', '5614736867'],
        invalid: [
          '43516 6456',
          '123443516 6456',
          '891123',
          'test 4351666456',
          '4351666456 test',
          'test 4351666456 test',
        ],
      },
      {
        locale: 'CZ',
        valid: ['20134', '392 90', '39919', '938 29', '39949'],
      },
      {
        locale: 'NL',
        valid: ['1012 SZ', '3432FE', '1118 BH', '3950IO', '3997 GH'],
        invalid: ['1234', '0603 JV', '5194SA', '9164 SD', '1841SS'],
      },
      {
        locale: 'NP',
        valid: ['10811', '32600', '56806', '977'],
        invalid: ['11977', 'asds', '13 32', '-977', '97765'],
      },
      {
        locale: 'PL',
        valid: [
          '47-260',
          '12-930',
          '78-399',
          '39-490',
          '38-483',
          '05-800',
          '54-060',
        ],
      },
      {
        locale: 'TW',
        valid: ['360', '90312', '399', '935', '38842', '546023'],
      },
      {
        locale: 'LI',
        valid: ['9485', '9497', '9491', '9489', '9496'],
      },
      {
        locale: 'PT',
        valid: ['4829-489', '0294-348', '8156-392'],
      },
      {
        locale: 'SE',
        valid: ['12994', '284 39', '39556', '489 39', '499 49'],
      },
      {
        locale: 'AD',
        valid: ['AD100', 'AD200', 'AD300', 'AD400', 'AD500', 'AD600', 'AD700'],
      },
      {
        locale: 'UA',
        valid: ['65000', '65080', '01000', '51901', '51909', '49125'],
      },
      {
        locale: 'BR',
        valid: [
          '39100-000',
          '22040-020',
          '39400-152',
          '39100000',
          '22040020',
          '39400152',
        ],
        invalid: [
          '79800A12',
          '13165-00',
          '38175-abc',
          '81470-2763',
          '78908',
          '13010|111',
        ],
      },
      {
        locale: 'NZ',
        valid: ['7843', '3581', '0449', '0984', '4144'],
      },
      {
        locale: 'PK',
        valid: ['25000', '44000', '54810', '74200'],
        invalid: ['5400', '540000', 'NY540', '540CA', '540-0'],
      },
      {
        locale: 'MG',
        valid: ['101', '303', '407', '512'],
      },
      {
        locale: 'MT',
        valid: ['VLT2345', 'VLT 2345', 'ATD1234', 'MSK8723'],
      },
      {
        locale: 'MY',
        valid: ['56000', '12000', '79502'],
      },
      {
        locale: 'PR',
        valid: ['00979', '00631', '00786', '00987'],
      },
      {
        locale: 'AZ',
        valid: ['AZ0100', 'AZ0121', 'AZ3500'],
        invalid: ['', ' AZ0100', 'AZ100', 'AZ34340', 'EN2020', 'AY3030'],
      },
      {
        locale: 'DO',
        valid: ['12345'],
        invalid: ['A1234', '123', '123456'],
      },
      {
        locale: 'HT',
        valid: ['HT1234'],
        invalid: ['HT123', 'HT12345', 'AA1234'],
      },
      {
        locale: 'TH',
        valid: ['10250', '72170', '12140'],
        invalid: ['T1025', 'T72170', '12140TH'],
      },
      {
        locale: 'SG',
        valid: ['308215', '546080'],
      },
      {
        locale: 'CN',
        valid: ['150237', '100000'],
        invalid: ['141234', '386789', 'ab1234'],
      },
      {
        locale: 'KR',
        valid: ['17008', '339012'],
        invalid: ['1412347', 'ab1234'],
      },
      {
        locale: 'LK',
        valid: ['11500', '22200', '10370', '43000'],
        invalid: ['1234', '789389', '982'],
      },
      {
        locale: 'BA',
        valid: ['76300', '71000', '75412', '76100', '88202', '88313'],
        invalid: ['1234', '789389', '98212', '11000'],
      },
    ];

    let allValid = [];

    // Test fixtures
    fixtures.forEach((fixture) => {
      if (fixture.valid) allValid = allValid.concat(fixture.valid);
      test({
        validator: 'isPostalCode',
        valid: fixture.valid,
        invalid: fixture.invalid,
        args: [fixture.locale],
      });
    });

    // Test generics
    test({
      validator: 'isPostalCode',
      valid: [
        ...allValid,
        '1234',
        '6900',
        '1292',
        '9400',
        '27616',
        '90210',
        '10001',
        '21201',
        '33142',
        '060623',
        '123456',
        '293940',
        '002920',
      ],
      invalid: [
        'asdf',
        '1',
        'ASDFGJKLmZXJtZtesting123',
        'Vml2YW11cyBmZXJtZtesting123',
        '48380480343',
        '29923-329393-2324',
        '4294924224',
        '13',
      ],
      args: ['any'],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isPostalCode',
      args: ['is-NOT'],
      error: ['293940', '1234'],
    });
  });
});
