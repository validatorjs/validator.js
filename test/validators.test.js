import assert from 'assert';
import fs from 'fs';
import timezone_mock from 'timezone-mock';
import vm from 'vm';
import test from './testFunctions';

let validator_js = fs.readFileSync(require.resolve('../validator.js')).toString();

describe('Validators', () => {
  it('should validate FQDN', () => {
    test({
      validator: 'isFQDN',
      valid: [
        'domain.com',
        'dom.plato',
        'a.domain.co',
        'foo--bar.com',
        'xn--froschgrn-x9a.com',
        'rebecca.blackfriday',
        '1337.com',
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '_.com',
        '*.some.com',
        's!ome.com',
        'domain.com/',
        '/more.com',
        'domain.com�',
        'domain.co\u00A0m',
        'domain.co\u1680m',
        'domain.co\u2006m',
        'domain.co\u2028m',
        'domain.co\u2029m',
        'domain.co\u202Fm',
        'domain.co\u205Fm',
        'domain.co\u3000m',
        'domain.com\uDC00',
        'domain.co\uEFFFm',
        'domain.co\uFDDAm',
        'domain.co\uFFF4m',
        'domain.com©',
        'example.0',
        '192.168.0.9999',
        '192.168.0',
      ],
    });
  });

  it('should validate FQDN with trailing dot option', () => {
    test({
      validator: 'isFQDN',
      args: [
        { allow_trailing_dot: true },
      ],
      valid: [
        'example.com.',
      ],
    });
  });

  it('should invalidate FQDN when not require_tld', () => {
    test({
      validator: 'isFQDN',
      args: [
        { require_tld: false },
      ],
      invalid: [
        'example.0',
        '192.168.0',
        '192.168.0.9999',
      ],
    });
  });

  it('should validate FQDN when not require_tld but allow_numeric_tld', () => {
    test({
      validator: 'isFQDN',
      args: [
        { allow_numeric_tld: true, require_tld: false },
      ],
      valid: [
        'example.0',
        '192.168.0',
        '192.168.0.9999',
      ],
    });
  });

  it('should validate FQDN with wildcard option', () => {
    test({
      validator: 'isFQDN',
      args: [
        { allow_wildcard: true },
      ],
      valid: [
        '*.example.com',
        '*.shop.example.com',
      ],
    });
  });

  it('should validate FQDN with required allow_trailing_dot, allow_underscores and allow_numeric_tld options', () => {
    test({
      validator: 'isFQDN',
      args: [
        { allow_trailing_dot: true, allow_underscores: true, allow_numeric_tld: true },
      ],
      valid: [
        'abc.efg.g1h.',
        'as1s.sad3s.ssa2d.',
      ],
    });
  });

  it('should define the module using an AMD-compatible loader', () => {
    let window = {
      validator: null,
      define(module) {
        window.validator = module();
      },
    };
    window.define.amd = true;

    let sandbox = vm.createContext(window);
    vm.runInContext(validator_js, sandbox);
    assert.strictEqual(window.validator.trim('  foobar '), 'foobar');
  });

  it('should bind validator to the window if no module loaders are available', () => {
    let window = {};
    let sandbox = vm.createContext(window);
    vm.runInContext(validator_js, sandbox);
    assert.strictEqual(window.validator.trim('  foobar '), 'foobar');
  });

  it('should validate RFC 3339 dates', () => {
    test({
      validator: 'isRFC3339',
      valid: [
        '2009-05-19 14:39:22-06:00',
        '2009-05-19 14:39:22+06:00',
        '2009-05-19 14:39:22Z',
        '2009-05-19T14:39:22-06:00',
        '2009-05-19T14:39:22Z',
        '2010-02-18T16:23:48.3-06:00',
        '2010-02-18t16:23:33+06:00',
        '2010-02-18t16:23:33+06:00',
        '2010-02-18t16:12:23.23334444z',
        '2010-02-18T16:23:55.2283Z',
        '2009-05-19 14:39:22.500Z',
        '2009-05-19 14:39:55Z',
        '2009-05-31 14:39:55Z',
        '2009-05-31 14:53:60Z',
        '2010-02-18t00:23:23.33+06:00',
        '2010-02-18t00:23:32.33+00:00',
        '2010-02-18t00:23:32.33+23:00',
      ],
      invalid: [
        '2010-02-18t00:23:32.33+24:00',
        '2009-05-31 14:60:55Z',
        '2010-02-18t24:23.33+0600',
        '2009-05-00 1439,55Z',
        '2009-13-19 14:39:22-06:00',
        '2009-05-00 14:39:22+0600',
        '2009-00-1 14:39:22Z',
        '2009-05-19T14:39:22',
        'nonsense2021-01-01T00:00:00Z',
        '2021-01-01T00:00:00Znonsense',
      ],
    });
  });

  it('should validate ISO 3166-1 numeric country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_numeric
    test({
      validator: 'isISO31661Numeric',
      valid: [
        '076',
        '208',
        '276',
        '348',
        '380',
        '410',
        '440',
        '528',
        '554',
        '826',
      ],
      invalid: [
        '',
        'NL',
        'NLD',
        '002',
        '197',
        '249',
        '569',
        '810',
        '900',
        '999',
      ],
    });
  });

  it('should validate ISO 4217 corrency codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_4217
    test({
      validator: 'isISO4217',
      valid: [
        'AED',
        'aed',
        'AUD',
        'CUP',
        'EUR',
        'GBP',
        'LYD',
        'MYR',
        'SGD',
        'SLE',
        'USD',
        'VED',
        'SLE',
      ],
      invalid: [
        '',
        '$',
        'US',
        'us',
        'AAA',
        'aaa',
        'RWA',
        'EURO',
        'euro',
        'HRK',
        'CUC',
      ],
    });
  });

  it('should validate whitelisted characters', () => {
    test({
      validator: 'isWhitelisted',
      args: ['abcdefghijklmnopqrstuvwxyz-'],
      valid: ['foo', 'foobar', 'baz-foo'],
      invalid: ['foo bar', 'fo.bar', 'türkçe'],
    });
  });

  it('should validate dataURI', () => {
    /* eslint-disable max-len */
    test({
      validator: 'isDataURI',
      valid: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
        'data:application/media_control+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
        '   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC   ',
        'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
        ' data:,Hello%2C%20World!',
        ' data:,Hello World!',
        ' data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
        ' data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
        'data:,A%20brief%20note',
        'data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E',
        'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,dGVzdC5kb2N4',
      ],
      invalid: [
        'dataxbase64',
        'data:HelloWorld',
        'data:,A%20brief%20invalid%20[note',
        'file:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
        'data:text/html;charset=,%3Ch1%3EHello!%3C%2Fh1%3E',
        'data:text/html;charset,%3Ch1%3EHello!%3C%2Fh1%3E', 'data:base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
        '',
        'http://wikipedia.org',
        'base64',
        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
      ],
    });
    /* eslint-enable max-len */
  });

  it('should validate magnetURI', () => {
    /* eslint-disable max-len */
    test({
      validator: 'isMagnetURI',
      valid: [
        'magnet:?xt.1=urn:sha1:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456&xt.2=urn:sha1:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
        'magnet:?xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234&dn=helloword2000&tr=udp://helloworld:1337/announce',
        'magnet:?xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234&dn=foo',
        'magnet:?xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234&dn=&tr=&nonexisting=hello world',
        'magnet:?xt=urn:md5:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
        'magnet:?xt=urn:tree:tiger:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
        'magnet:?xt=urn:ed2k:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?tr=udp://helloworld:1337/announce&xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?xt=urn:btmh:1220caf1e1c30e81cb361b9ee167c4aa64228a7fa4fa9f6105232b28ad099f3a302e',
      ],
      invalid: [
        ':?xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magneta:?xt=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?xt=uarn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?xt=urn:btihz',
        'magnet::?xt=urn:btih:UHWY2892JNEJ2GTEYOMDNU67E8ICGICYE92JDUGH',
        'magnet:?xt:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'magnet:?xt:urn:nonexisting:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?xt.2=urn:btih:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234',
        'magnet:?xt=urn:ed2k:ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890123456789ABCD',
        'magnet:?xt=urn:btmh:1120caf1e1c30e81cb361b9ee167c4aa64228a7fa4fa9f6105232b28ad099f3a302e',
        'magnet:?ttxt=urn:btmh:1220caf1e1c30e81cb361b9ee167c4aa64228a7fa4fa9f6105232b28ad099f3a302e',
      ],
    });
    /* eslint-enable max-len */
  });

  it('should validate LatLong', () => {
    test({
      validator: 'isLatLong',
      valid: [
        '(-17.738223, 85.605469)',
        '(-12.3456789, +12.3456789)',
        '(-60.978437, -0.175781)',
        '(77.719772, -37.529297)',
        '(7.264394, 165.058594)',
        '0.955766, -19.863281',
        '(31.269161,164.355469)',
        '+12.3456789, -12.3456789',
        '-15.379543, -137.285156',
        '(11.770570, -162.949219)',
        '-55.034319, 113.027344',
        '58.025555, 36.738281',
        '55.720923,-28.652344',
        '-90.00000,-180.00000',
        '(-71, -146)',
        '(-71.616864, -146.616864)',
        '-0.55, +0.22',
        '90, 180',
        '+90, -180',
        '-90,+180',
        '90,180',
        '0, 0',
      ],
      invalid: [
        '(020.000000, 010.000000000)',
        '89.9999999989, 360.0000000',
        '90.1000000, 180.000000',
        '+90.000000, -180.00001',
        '090.0000, 0180.0000',
        '126, -158',
        '(-126.400010, -158.400010)',
        '-95, -96',
        '-95.738043, -96.738043',
        '137, -148',
        '(-137.5942, -148.5942)',
        '(-120, -203)',
        '(-119, -196)',
        '+119.821728, -196.821728',
        '(-110, -223)',
        '-110.369532, 223.369532',
        '(-120.969949, +203.969949)',
        '-116, -126',
        '-116.894222, -126.894222',
        '-112, -160',
        '-112.96381, -160.96381',
        '-90., -180.',
        '+90.1, -180.1',
        '(-17.738223, 85.605469',
        '0.955766, -19.863281)',
        '+,-',
        '(,)',
        ',',
        ' ',
      ],
    });

    test({
      validator: 'isLatLong',
      args: [{
        checkDMS: true,
      }],
      valid: [
        '40° 26′ 46″ N, 79° 58′ 56″ W',
        '40° 26′ 46″ S, 79° 58′ 56″ E',
        '90° 0′ 0″ S, 180° 0′ 0″ E',
        '40° 26′ 45.9996″ N, 79° 58′ 55.2″ E',
        '40° 26′ 46″ n, 79° 58′ 56″ w',
        '40°26′46″s, 79°58′56″e',
        '11° 0′ 0.005″ S, 180° 0′ 0″ E',
        '40°26′45.9996″N, 79°58′55.2″E',

      ],
      invalid: [
        '100° 26′ 46″ N, 79° 70′ 56″ W',
        '40° 89′ 46″ S, 79° 58′ 100″ E',
        '40° 26.445′ 45″ N, 79° 58′ 55.2″ E',
        '40° 46″ N, 79° 58′ 56″ W',
      ],
    });
  });

  it('should validate postal code', () => {
    const fixtures = [
      {
        locale: 'AU',
        valid: [
          '4000',
          '2620',
          '3000',
          '2017',
          '0800',
        ],
      },
      {
        locale: 'BD',
        valid: [
          '1000',
          '1200',
          '1300',
          '1400',
          '1500',
          '2000',
          '3000',
          '4000',
          '5000',
          '6000',
          '7000',
          '8000',
          '9000',
          '9400',
          '9499',
        ],
        invalid: [
          '0999',
          '9500',
          '10000',
          '12345',
          '123',
          '123456',
          'abcd',
          '123a',
          'a123',
          '12 34',
          '12-34',
        ],
      },
      {
        locale: 'BY',
        valid: [
          '225320',
          '211120',
          '247710',
          '231960',
        ],
        invalid: [
          'test 225320',
          '211120 test',
          '317543',
          '267946',
        ],
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
        valid: [
          '050034',
          '110221',
          '441029',
          '910001',
        ],
        invalid: [
          '11001',
          '000000',
          '109999',
          '329999',
        ],
      },
      {
        locale: 'ES',
        valid: [
          '01001',
          '52999',
          '27880',
        ],
        invalid: [
          '123',
          '1234',
          '53000',
          '052999',
          '0123',
          'abcde',
        ],
      },
      {
        locale: 'JP',
        valid: [
          '135-0000',
          '874-8577',
          '669-1161',
          '470-0156',
          '672-8031',
        ],
      },
      {
        locale: 'GR',
        valid: [
          '022 93',
          '29934',
          '90293',
          '299 42',
          '94944',
        ],
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
        valid: [
          '75008',
          '44522',
          '38499',
          '39940',
          '01000',
        ],
        invalid: [
          '44 522',
          '38 499',
          '96000',
          '98025',
        ],
      },
      {
        locale: 'ID',
        valid: [
          '10210',
          '40181',
          '55161',
          '60233',
        ],
      },
      {
        locale: 'IE',
        valid: [
          'A65 TF12',
          'A6W U9U9',
        ],
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
        valid: [
          '364240',
          '360005',
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
        valid: [
          '1000',
        ],
      },
      {
        locale: 'IR',
        valid: [
          '4351666456',
          '5614736867',
        ],
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
        valid: [
          '20134',
          '392 90',
          '39919',
          '938 29',
          '39949',
        ],
      },
      {
        locale: 'NL',
        valid: [
          '1012 SZ',
          '3432FE',
          '1118 BH',
          '3950IO',
          '3997 GH',
        ],
        invalid: [
          '1234',
          '0603 JV',
          '5194SA',
          '9164 SD',
          '1841SS',
        ],
      },
      {
        locale: 'NP',
        valid: [
          '10811',
          '32600',
          '56806',
          '977',
        ],
        invalid: [
          '11977',
          'asds',
          '13 32',
          '-977',
          '97765',
        ],
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
        valid: [
          '360',
          '90312',
          '399',
          '935',
          '38842',
          '546023',
        ],
      },
      {
        locale: 'LI',
        valid: [
          '9485',
          '9497',
          '9491',
          '9489',
          '9496',
        ],
      },
      {
        locale: 'PT',
        valid: [
          '4829-489',
          '0294-348',
          '8156-392',
        ],
      },
      {
        locale: 'SE',
        valid: [
          '12994',
          '284 39',
          '39556',
          '489 39',
          '499 49',
        ],
      },
      {
        locale: 'AD',
        valid: [
          'AD100',
          'AD200',
          'AD300',
          'AD400',
          'AD500',
          'AD600',
          'AD700',
        ],
      },
      {
        locale: 'UA',
        valid: [
          '65000',
          '65080',
          '01000',
          '51901',
          '51909',
          '49125',
        ],
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
        valid: [
          '7843',
          '3581',
          '0449',
          '0984',
          '4144',
        ],
      },
      {
        locale: 'PK',
        valid: [
          '25000',
          '44000',
          '54810',
          '74200',
        ],
        invalid: [
          '5400',
          '540000',
          'NY540',
          '540CA',
          '540-0',
        ],
      },
      {
        locale: 'MG',
        valid: [
          '101',
          '303',
          '407',
          '512',
        ],
      },
      {
        locale: 'MT',
        valid: [
          'VLT2345',
          'VLT 2345',
          'ATD1234',
          'MSK8723',
        ],
      },
      {
        locale: 'MY',
        valid: [
          '56000',
          '12000',
          '79502',
        ],
      },
      {
        locale: 'PR',
        valid: [
          '00979',
          '00631',
          '00786',
          '00987',
        ],
      },
      {
        locale: 'AZ',
        valid: [
          'AZ0100',
          'AZ0121',
          'AZ3500',
        ],
        invalid: [
          '',
          ' AZ0100',
          'AZ100',
          'AZ34340',
          'EN2020',
          'AY3030',
        ],
      },
      {
        locale: 'DO',
        valid: [
          '12345',
        ],
        invalid: [
          'A1234',
          '123',
          '123456',
        ],
      },
      {
        locale: 'HT',
        valid: [
          'HT1234',
        ],
        invalid: [
          'HT123',
          'HT12345',
          'AA1234',
        ],
      },
      {
        locale: 'TH',
        valid: [
          '10250',
          '72170',
          '12140',
        ],
        invalid: [
          'T1025',
          'T72170',
          '12140TH',
        ],
      },
      {
        locale: 'SG',
        valid: [
          '308215',
          '546080',
        ],
      },
      {
        locale: 'CN',
        valid: [
          '150237',
          '100000',
        ],
        invalid: [
          '141234',
          '386789',
          'ab1234',
        ],
      },
      {
        locale: 'KR',
        valid: [
          '17008',
          '339012',
        ],
        invalid: [
          '1412347',
          'ab1234',
        ],
      },
      {
        locale: 'LK',
        valid: [
          '11500',
          '22200',
          '10370',
          '43000',
        ],
        invalid: [
          '1234',
          '789389',
          '982',
        ],
      },
      {
        locale: 'BA',
        valid: [
          '76300',
          '71000',
          '75412',
          '76100',
          '88202',
          '88313',
        ],
        invalid: [
          '1234',
          '789389',
          '98212',
          '11000',
        ],
      },
      {
        locale: 'MC',
        valid: [
          '98000',
          '98025',
        ],
        invalid: [
          '123412',
          'ab1234',
        ],
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
      error: [
        '293940',
        '1234',
      ],
    });
  });

  it('should validate MIME types', () => {
    test({
      validator: 'isMimeType',
      valid: [
        'application/json',
        'application/xhtml+xml',
        'audio/mp4',
        'image/bmp',
        'font/woff2',
        'message/http',
        'model/vnd.gtw',
        'application/media_control+xml',
        'multipart/form-data',
        'multipart/form-data; boundary=something',
        'multipart/form-data; charset=utf-8; boundary=something',
        'multipart/form-data; boundary=something; charset=utf-8',
        'multipart/form-data; boundary=something; charset="utf-8"',
        'multipart/form-data; boundary="something"; charset=utf-8',
        'multipart/form-data; boundary="something"; charset="utf-8"',
        'text/css',
        'text/plain; charset=utf8',
        'Text/HTML;Charset="utf-8"',
        'text/html;charset=UTF-8',
        'Text/html;charset=UTF-8',
        'text/html; charset=us-ascii',
        'text/html; charset=us-ascii (Plain text)',
        'text/html; charset="us-ascii"',
        'video/mp4',
      ],
      invalid: [
        '',
        ' ',
        '/',
        'f/b',
        'application',
        'application\\json',
        'application/json/text',
        'application/json; charset=utf-8',
        'audio/mp4; charset=utf-8',
        'image/bmp; charset=utf-8',
        'font/woff2; charset=utf-8',
        'message/http; charset=utf-8',
        'model/vnd.gtw; charset=utf-8',
        'video/mp4; charset=utf-8',
      ],
    });
  });

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

  it('should validate ISO6346 shipping containerID', () => {
    test({
      validator: 'isFreightContainerID',
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

  it('should validate ISO6346 shipping container IDs with checksum digit 10 represented as 0', () => {
    test({
      validator: 'isFreightContainerID',
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

  // EU-UK valid numbers sourced from https://ec.europa.eu/taxation_customs/tin/specs/FS-TIN%20Algorithms-Public.docx or constructed by @tplessas.

  it('should validate taxID', () => {
    test({
      validator: 'isTaxID',
      args: ['bg-BG'],
      valid: [
        '7501010010',
        '0101010012',
        '0111010010',
        '7521010014',
        '7541010019'],
      invalid: [
        '750101001',
        '75010100101',
        '75-01010/01 0',
        '7521320010',
        '7501010019'],
    });
    test({
      validator: 'isTaxID',
      args: ['cs-CZ'],
      valid: [
        '530121999',
        '530121/999',
        '530121/9990',
        '5301219990',
        '1602295134',
        '5451219994',
        '0424175466',
        '0532175468',
        '7159079940'],
      invalid: [
        '53-0121 999',
        '530121000',
        '960121999',
        '0124175466',
        '0472301754',
        '1975116400',
        '7159079945'],
    });
    test({
      validator: 'isTaxID',
      args: ['de-AT'],
      valid: [
        '931736581',
        '93-173/6581',
        '93--173/6581'],
      invalid: [
        '999999999',
        '93 173 6581',
        '93-173/65811',
        '93-173/658'],
    });
    test({
      validator: 'isTaxID',
      args: ['de-DE'],
      valid: [
        '26954371827',
        '86095742719',
        '65929970489',
        '79608434120',
        '659/299/7048/9'],
      invalid: [
        '26954371828',
        '86095752719',
        '8609575271',
        '860957527190',
        '65299970489',
        '65999970489',
        '6592997048-9'],
    });
    test({
      validator: 'isTaxID',
      args: ['dk-DK'],
      valid: [
        '010111-1113',
        '0101110117',
        '2110084008',
        '2110489008',
        '2110595002',
        '2110197007',
        '0101110117',
        '0101110230'],
      invalid: [
        '010111/1113',
        '010111111',
        '01011111133',
        '2110485008',
        '2902034000',
        '0101110630'],
    });
    test({
      validator: 'isTaxID',
      args: ['el-CY'],
      valid: [
        '00123123T',
        '99652156X'],
      invalid: [
        '99652156A',
        '00124123T',
        '00123123',
        '001123123T',
        '00 12-3123/T'],
    });
    test({
      validator: 'isTaxID',
      args: ['el-GR'],
      valid: [
        '758426713',
        '032792320',
        '054100004'],
      invalid: [
        '054100005',
        '05410000',
        '0541000055',
        '05 4100005',
        '05-410/0005',
        '658426713',
        '558426713'],
    });
    test({
      validator: 'isTaxID',
      args: ['en-CA'],
      valid: [
        '000000000',
        '521719666',
        '469317481',
        '120217450',
        '480534858',
        '325268597',
        '336475660',
        '744797853',
        '130692544',
        '046454286',
      ],
      invalid: [
        '        ',
        'any value',
        '012345678',
        '111111111',
        '999999999',
        '657449110',
        '74 47 978 53',
        '744 797 853',
        '744-797-853',
        '981062432',
        '267500713',
        '2675o0713',
        '70597312',
        '7058973122',
        '069437151',
        '046454281',
        '146452286',
        '30x92544',
        '30692544',
      ],
    });
    test({
      validator: 'isTaxID',
      args: ['en-GB'],
      valid: [
        '1234567890',
        'AA123456A',
        'AA123456 '],
      invalid: [
        'GB123456A',
        '123456789',
        '12345678901',
        'NK123456A',
        'TN123456A',
        'ZZ123456A',
        'GB123456Z',
        'DM123456A',
        'AO123456A',
        'GB-123456A',
        'GB 123456 A',
        'GB123456  '],
    });
    test({
      validator: 'isTaxID',
      args: ['en-IE'],
      valid: [
        '1234567T',
        '1234567TW',
        '1234577W',
        '1234577WW',
        '1234577IA'],
      invalid: [
        '1234567',
        '1234577WWW',
        '1234577A',
        '1234577JA'],
    });
    test({
      validator: 'isTaxID',
      args: ['en-US'],
      valid: [
        '01-1234567',
        '01 1234567',
        '011234567',
        '10-1234567',
        '02-1234567',
        '67-1234567',
        '15-1234567',
        '31-1234567',
        '99-1234567'],
      invalid: [
        '0-11234567',
        '01#1234567',
        '01  1234567',
        '01 1234 567',
        '07-1234567',
        '28-1234567',
        '96-1234567'],
    });
    test({
      validator: 'isTaxID',
      args: ['es-AR'],
      valid: [
        '20271633638',
        '23274986069',
        '27333234519',
        '30678561165',
        '33693450239',
        '30534868460',
        '23111111129',
        '34557619099'],
      invalid: [
        '20-27163363-8',
        '20.27163363.8',
        '33693450231',
        '69345023',
        '693450233123123',
        '3369ew50231',
        '34557619095'],
    });
    test({
      validator: 'isTaxID',
      args: ['es-ES'],
      valid: [
        '00054237A',
        '54237A',
        'X1234567L',
        'Z1234567R',
        'M2812345C',
        'Y2812345B'],
      invalid: [
        'M2812345CR',
        'A2812345C',
        '0/005 423-7A',
        '00054237U'],
    });
    test({
      validator: 'isTaxID',
      args: ['et-EE'],
      valid: [
        '10001010080',
        '46304280206',
        '37102250382',
        '32708101201'],
      invalid: [
        '46304280205',
        '61002293333',
        '4-6304 28/0206',
        '4630428020',
        '463042802066'],
    });
    test({
      validator: 'isTaxID',
      args: ['fi-FI'],
      valid: [
        '131052-308T',
        '131002+308W',
        '131019A3089'],
      invalid: [
        '131052308T',
        '131052-308TT',
        '131052S308T',
        '13 1052-308/T',
        '290219A1111'],
    });
    test({
      validator: 'isTaxID',
      args: ['fr-BE'],
      valid: [
        '00012511119'],
    });
    test({
      validator: 'isTaxID',
      args: ['fr-FR'],
      valid: [
        '30 23 217 600 053',
        '3023217600053'],
      invalid: [
        '30 2 3 217 600 053',
        '3 023217-600/053',
        '3023217600052',
        '3023217500053',
        '30232176000534',
        '302321760005'],
    });
    test({
      validator: 'isTaxID',
      args: ['nl-BE'],
      valid: [
        '00012511148',
        '00/0125-11148',
        '00000011115'],
      invalid: [
        '00 01 2511148',
        '01022911148',
        '00013211148',
        '0001251114',
        '000125111480',
        '00012511149'],
    });
    test({
      validator: 'isTaxID',
      args: ['fr-LU'],
      valid: [
        '1893120105732'],
      invalid: [
        '189312010573',
        '18931201057322',
        '1893 12-01057/32',
        '1893120105742',
        '1893120105733'],
    });
    test({
      validator: 'isTaxID',
      args: ['lb-LU'],
      invalid: [
        '2016023005732'],
    });
    test({
      validator: 'isTaxID',
      args: ['hr-HR'],
      valid: [
        '94577403194'],
      invalid: [
        '94 57-7403/194',
        '9457740319',
        '945774031945',
        '94577403197',
        '94587403194'],
    });
    test({
      validator: 'isTaxID',
      args: ['hu-HU'],
      valid: [
        '8071592153'],
      invalid: [
        '80 71-592/153',
        '80715921534',
        '807159215',
        '8071592152',
        '8071582153'],
    });
    test({
      validator: 'isTaxID',
      args: ['lt-LT'],
      valid: [
        '33309240064'],
    });
    test({
      validator: 'isTaxID',
      args: ['it-IT'],
      valid: [
        'DMLPRY77D15H501F',
        'AXXFAXTTD41H501D'],
      invalid: [
        'DML PRY/77D15H501-F',
        'DMLPRY77D15H501',
        'DMLPRY77D15H501FF',
        'AAPPRY77D15H501F',
        'DMLAXA77D15H501F',
        'AXXFAX90A01Z001F',
        'DMLPRY77B29H501F',
        'AXXFAX3TD41H501E'],
    });
    test({
      validator: 'isTaxID',
      args: ['lv-LV'],
      valid: [
        '01011012344',
        '32579461005',
        '01019902341',
        '325794-61005'],
      invalid: [
        '010110123444',
        '0101101234',
        '01001612345',
        '290217-22343'],
    });
    test({
      validator: 'isTaxID',
      args: ['mt-MT'],
      valid: [
        '1234567A',
        '882345608',
        '34581M',
        '199Z'],
      invalid: [
        '812345608',
        '88234560',
        '8823456088',
        '11234567A',
        '12/34-567 A',
        '88 23-456/08',
        '1234560A',
        '0000000M',
        '3200100G'],
    });
    test({
      validator: 'isTaxID',
      args: ['nl-NL'],
      valid: [
        '174559434'],
      invalid: [
        '17455943',
        '1745594344',
        '17 455-94/34'],
    });
    test({
      validator: 'isTaxID',
      args: ['pl-PL'],
      valid: [
        '2234567895',
        '02070803628',
        '02870803622',
        '02670803626',
        '01510813623'],
      invalid: [
        '020708036285',
        '223456789',
        '22 345-678/95',
        '02 070-8036/28',
        '2234567855',
        '02223013623'],
    });
    test({
      validator: 'isTaxID',
      args: ['pt-BR'],
      valid: [
        // CPF (persons)
        '35161990910',
        '74407265027',
        '12345678909',
        '11144477735',
        '52998224725',
        // CPF formatted (XXX.XXX.XXX-XX)
        '123.456.789-09',
        '111.444.777-35',
        '529.982.247-25',
        // CNPJ numeric (legacy format)
        '05423994000172',
        '11867044000130',
        // CNPJ alphanumeric (new format starting July 2026)
        '12ABC34501DE35', // Example from official SERPRO documentation
        '12abc34501de35', // Lowercase should also work
      ],
      invalid: [
        'ABCDEFGH',
        '170.691.440-72',
        '000.000.000-00',
        '111.111.111-11',
        '123.456.789-00',
        '12345678900',
        '123',
        '123456789012',
        '11494282142',
        '74405265037',
        '11111111111',
        '48469799384',
        '94.592.973/0001-82',
        '28592361000192',
        '11111111111111',
        '111111111111112',
        '61938188550993',
        '82168365502729',
        // Invalid alphanumeric CNPJs
        '12ABC34501DE00', // Wrong check digits
        '12ABC34501DE99', // Wrong check digits
        'AAAAAAAAAAAAAA', // All same characters
        '00000000000000', // All zeros
        '12.ABC.345/01DE-35', // Formatted (not accepted)
      ],
    });
    test({
      validator: 'isTaxID',
      args: ['pt-PT'],
      valid: [
        '299999998',
        '299992020'],
      invalid: [
        '2999999988',
        '29999999',
        '29 999-999/8'],
    });
    test({
      validator: 'isTaxID',
      args: ['ro-RO'],
      valid: [
        '8001011234563',
        '9000123456789',
        '1001011234560',
        '3001011234564',
        '5001011234568'],
      invalid: [
        '5001011234569',
        '500 1011-234/568',
        '500101123456',
        '50010112345688',
        '5001011504568',
        '8000230234563',
        '6000230234563'],
    });
    test({
      validator: 'isTaxID',
      args: ['sk-SK'],
      valid: [
        '530121999',
        '536221/999',
        '031121999',
        '520229999',
        '1234567890'],
      invalid: [
        '53012199999',
        '990101999',
        '530121000',
        '53012199',
        '53-0121 999',
        '535229999'],
    });
    test({
      validator: 'isTaxID',
      args: ['sl-SI'],
      valid: [
        '15012557',
        '15012590'],
      invalid: [
        '150125577',
        '1501255',
        '15 01-255/7'],
    });
    test({
      validator: 'isTaxID',
      args: ['sv-SE'],
      valid: [
        '640823-3234',
        '640883-3231',
        '6408833231',
        '19640823-3233',
        '196408233233',
        '19640883-3230',
        '200228+5266',
        '20180101-5581'],
      invalid: [
        '640823+3234',
        '160230-3231',
        '160260-3231',
        '160260-323',
        '160260323',
        '640823+323',
        '640823323',
        '640823+32344',
        '64082332344',
        '19640823-32333',
        '1964082332333'],
    });
    test({
      validator: 'isTaxID',
      args: ['uk-UA'],
      valid: [
        '3006321856',
        '3003102490',
        '2164212906'],
      invalid: [
        '2565975632',
        '256597563287',
        'КС00123456',
        '2896235845'],
    });
    test({
      validator: 'isTaxID',
      valid: [
        '01-1234567'],
    });
    test({
      validator: 'isTaxID',
      args: ['is-NOT'],
      error: [
        '01-1234567',
        '01 1234567',
        '011234567',
        '0-11234567',
        '01#1234567',
        '01  1234567',
        '01 1234 567',
        '07-1234567',
        '28-1234567',
        '96-1234567',
      ],
    });
  });

  it('should validate slug', () => {
    test({
      validator: 'isSlug',
      valid: [
        'f',
        'fo',
        'foo',
        'foo-bar',
        'foo_bar',
        'foo-bar-foo',
        'foo-bar_foo',
        'foo-75-b4r-foo',
        'a1-b2_c3',
      ],
      invalid: [
        'not-----------slug',
        '@#_$@',
        '-not-slug',
        'not-slug-',
        '_not-slug',
        'not-slug_',
        'not slug',
        'i.am.not.a.slug',
        'slug.is.cool',
        'foo-bar_foo*75-b4r-**_foo',
        'foo-bar_foo*75-b4r-**_foo-&&',
        'Foo-Bar',
        'a:b',
      ],
    });
  });

  it('should validate strong passwords', () => {
    test({
      validator: 'isStrongPassword',
      args: [{
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }],
      valid: [
        '%2%k{7BsL"M%Kd6e',
        'EXAMPLE of very long_password123!',
        'mxH_+2vs&54_+H3P',
        '+&DxJ=X7-4L8jRCD',
        'etV*p%Nr6w&H%FeF',
        '£3.ndSau_7',
        'VaLIDWith\\Symb0l',
      ],
      invalid: [
        '',
        'password',
        'hunter2',
        'hello world',
        'passw0rd',
        'password!',
        'PASSWORD!',
      ],
    });
  });

  it('should validate date', () => {
    test({
      validator: 'isDate',
      valid: [
        new Date(),
        new Date([2014, 2, 15]),
        new Date('2014-03-15'),
        '2020/02/29',
        '2020-02-19',
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
        '-2020-04-19',
        '-2023/05/24',
        'abc-2023/05/24',
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
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
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '15/',
        '15/07',
        '15/07/',
        '15/07/2024/',
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
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '15/',
        '15/07',
        '15/07/',
        '15/07/2024/',
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
        '30/04/--',
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '15/',
        '15/07',
        '15/07/',
        '15/07/2024/',
        '15/07/24/',
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
        '3/4/aa',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '15/',
        '15/07',
        '15/07/',
        '15/07/2024/',
        '15/07/24/',
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
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '15/',
        '15/07',
        '15/07/',
        '15/07/2024/',
        '15/07/24/',
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
        '-2020-04-19',
        '-2023/05/24',
        'abc-2023/05/24',
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
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
        '-2020-04-19',
        '-2023/05/24',
        'abc-2023/05/24',
        '2024',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01-',
        '2024-05-01-abc',
        '2024/',
        '2024/05',
        '2024/05/',
        '2024/05/01/',
        '2024/05/01/abc',
        '2024 05 01 abc',
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
        '02.29.2020.20',
        '2024-',
        '2024-05',
        '2024-05-',
        '2024-05-01',
        '-2020-04-19',
        '-2023/05/24',
        'abc-2023/05/24',
        '04.05.2024.',
        '04.05.2024.abc',
        'abc.04.05.2024',
      ],
    });
    // emulating Pacific time zone offset & time
    // which could potentially result in UTC conversion issues
    timezone_mock.register('US/Pacific');
    test({
      validator: 'isDate',
      valid: [
        new Date(2016, 2, 29),
        '2017-08-04',
      ],
    });
    timezone_mock.unregister();
  });

  it('should validate time', () => {
    test({
      validator: 'isTime',
      valid: [
        '00:00',
        '23:59',
        '9:00',
      ],
      invalid: [
        '',
        null,
        undefined,
        0,
        '07:00 PM',
        '23',
        '00:60',
        '00:',
        '01:0 ',
        '001:01',
      ],
    });
    test({
      validator: 'isTime',
      args: [{ hourFormat: 'hour24', mode: 'withSeconds' }],
      valid: [
        '23:59:59',
        '00:00:00',
        '9:50:01',
      ],
      invalid: [
        '',
        null,
        undefined,
        23,
        '01:00:01 PM',
        '13:00:',
        '00',
        '26',
        '00;01',
        '0 :09',
        '59:59:59',
        '24:00:00',
        '00:59:60',
        '99:99:99',
        '009:50:01',
      ],
    });
    test({
      validator: 'isTime',
      args: [{ hourFormat: 'hour24', mode: 'withOptionalSeconds' }],
      valid: [
        '23:59:59',
        '00:00:00',
        '9:50:01',
        '00:00',
        '23:59',
        '9:00',
      ],
      invalid: [
        '',
        null,
        undefined,
        23,
        '01:00:01 PM',
        '13:00:',
        '00',
        '26',
        '00;01',
        '0 :09',
        '59:59:59',
        '24:00:00',
        '00:59:60',
        '99:99:99',
        '009:50:01',
      ],
    });
    test({
      validator: 'isTime',
      args: [{ hourFormat: 'hour12' }],
      valid: [
        '12:59 PM',
        '12:59 AM',
        '01:00 PM',
        '01:00 AM',
        '7:00 AM',
      ],
      invalid: [
        '',
        null,
        undefined,
        0,
        '12:59 MM',
        '12:59 MA',
        '12:59 PA',
        '12:59 A M',
        '13:00 PM',
        '23',
        '00:60',
        '00:',
        '9:00',
        '01:0 ',
        '001:01',
        '12:59:00 PM',
        '12:59:00 A M',
        '12:59:00 ',
      ],
    });
    test({
      validator: 'isTime',
      args: [{ hourFormat: 'hour12', mode: 'withSeconds' }],
      valid: [
        '12:59:59 PM',
        '2:34:45 AM',
        '7:00:00 AM',
      ],
      invalid: [
        '',
        null,
        undefined,
        23,
        '01:00: 1 PM',
        '13:00:',
        '13:00:00 PM',
        '00',
        '26',
        '00;01',
        '0 :09',
        '59:59:59',
        '24:00:00',
        '00:59:60',
        '99:99:99',
        '9:50:01',
        '009:50:01',
      ],
    });
    test({
      validator: 'isTime',
      args: [{ hourFormat: 'hour12', mode: 'withOptionalSeconds' }],
      valid: [
        '12:59:59 PM',
        '2:34:45 AM',
        '7:00:00 AM',
        '12:59 PM',
        '12:59 AM',
        '01:00 PM',
        '01:00 AM',
        '7:00 AM',
      ],
      invalid: [
        '',
        null,
        undefined,
        23,
        '01:00: 1 PM',
        '13:00:',
        '00',
        '26',
        '00;01',
        '0 :09',
        '59:59:59',
        '24:00:00',
        '00:59:60',
        '99:99:99',
        '9:50:01',
        '009:50:01',
      ],
    });
  });

  it('should be valid license plate', () => {
    test({
      validator: 'isLicensePlate',
      args: ['es-AR'],
      valid: [
        'AB 123 CD',
        'AB123CD',
        'ABC 123',
        'ABC123',
      ],
      invalid: [
        '',
        'notalicenseplate',
        'AB-123-CD',
        'ABC-123',
        'AABC 123',
        'AB CDE FG',
        'ABC DEF',
        '12 ABC 34',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['pt-PT'],
      valid: [
        'AA-12-34',
        '12-AA-34',
        '12-34-AA',
        'AA-12-AA',
        'AA·12·34',
        '12·AB·34',
        '12·34·AB',
        'AB·34·AB',
        'AA 12 34',
        '12 AA 34',
        '12 34 AA',
        'AB 12 CD',
        'AA1234',
        '12AA34',
        '1234AA',
        'AB12CD',
      ],
      invalid: [
        '',
        'notalicenseplate',
        'AA-AA-00',
        '00-AA-AA',
        'AA-AA-AA',
        '00-00-00',
        'AA·AA·00',
        '00·AA·AA',
        'AA·AA·AA',
        '00·00·00',
        'AA AA 00',
        '00 AA AA',
        'AA AA AA',
        '00 00 00',
        'A1-B2-C3',
        '1A-2B-3C',
        'ABC-1-EF',
        'AB-C1D-EF',
        'AB-C1-DEF',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['de-LI'],
      valid: [
        'FL 1',
        'FL 99999',
        'FL 1337',
      ],
      invalid: [
        '',
        'FL 999999',
        'AB 12345',
        'FL -1',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['de-DE'],
      valid: [
        'M A 1',
        'M A 12',
        'M A 123',
        'M A 1234',
        'M AB 1',
        'M AB 12',
        'M AB 123',
        'M AB 1234',
        'FS A 1',
        'FS A 12',
        'FS A 123',
        'FS A 1234',
        'FS AB 1',
        'FS AB 12',
        'FS AB 123',
        'FS AB 1234',
        'FSAB1234',
        'FS-AB-1234',
        'FS AB 1234 H',
        'FS AB 1234 E',
        'FSAB1234E',
        'FS-AB-1234-E',
        'FS AB-1234-E',
        'FSAB1234 E',
        'FS AB1234E',
        'LRO AB 123',
        'LRO-AB-123-E',
        'LRO-AB-123E',
        'LRO-AB-123 E',
        'LRO-AB-123-H',
        'LRO-AB-123H',
        'LRO-AB-123 H',
      ],
      invalid: [
        'YY AB 123',
        'PAF AB 1234',
        'M ABC 123',
        'M AB 12345',
        'FS AB 1234 A',
        'LRO-AB-1234',
        'HRO ABC 123',
        'HRO ABC 1234',
        'LDK-AB-1234-E',
        'ÖHR FA 123D',
        'MZG-AB-123X',
        'OBG-ABD-123',
        'PAF-AB2-123',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['fi-FI'],
      valid: [
        'ABC-123',
        'ABC 123',
        'ABC123',
        'A100',
        'A 100',
        'A-100',
        'C10001',
        'C 10001',
        'C-10001',
        '123-ABC',
        '123 ABC',
        '123ABC',
        '123-A',
        '123 A',
        '123A',
        '199AA',
        '199 AA',
        '199-AA',
      ],
      invalid: [
        ' ',
        'A-1',
        'A1A-100',
        '1-A-2',
        'C1234567',
        'A B C 1 2 3',
        'abc-123',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['sq-AL'],
      valid: [
        'AA 000 AA',
        'ZZ 999 ZZ',
      ],
      invalid: [
        '',
        'AA 0 A',
        'AAA 00 AAA',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['cs-CZ'],
      valid: [
        'ALA4011',
        '4A23000',
        'DICTAT0R',
        'VETERAN',
        'AZKVIZ8',
        '2A45876',
        'DIC-TAT0R',
      ],
      invalid: [
        '',
        'invalidlicenseplate',
        'LN5758898',
        'X-|$|-X',
        'AE0F-OP4',
        'GO0MER',
        '2AAAAAAAA',
        'FS AB 1234 E',
        'GB999 9999 00',
      ],
    });

    test({
      validator: 'isLicensePlate',
      args: ['pt-BR'],
      valid: [
        'ABC1234',
        'ABC 1234',
        'ABC-1234',
        'ABC1D23',
        'ABC1K23',
        'ABC1Z23',
        'ABC 1D23',
        'ABC-1D23',
      ],
      invalid: [
        '',
        'AA 0 A',
        'AAA 00 AAA',
        'ABCD123',
        'AB12345',
        'AB123DC',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['hu-HU'],
      valid: [
        'AAB-001',
        'AVC-987',
        'KOC-124',
        'JCM-871',
        'AWQ-777',
        'BPO-001',
        'BPI-002',
        'UCO-342',
        'UDO-385',
        'XAO-987',
        'AAI-789',
        'ABI-789',
        'ACI-789',
        'AAO-789',
        'ABO-789',
        'ACO-789',
        'YAA-123',
        'XAA-123',
        'WAA-258',
        'XZZ-784',
        'M123456',
        'CK 12-34',
        'DT 12-34',
        'CD 12-34',
        'HC 12-34',
        'HB 12-34',
        'HK 12-34',
        'MA 12-34',
        'OT 12-34',
        'RR 17-87',
        'CD 124-348',
        'C-C 2021',
        'C-X 2458',
        'X-A 7842',
        'E-72345',
        'Z-07458',
        'S ACF 83',
        'SP 04-68',
      ],
      invalid: [
        'AAA-547',
        'aab-001',
        'AAB 001',
        'AB34',
        '789-LKJ',
        'BBO-987',
        'BBI-987',
        'BWQ-777',
        'BQW-987',
        'BAI-789',
        'BBI-789',
        'BCI-789',
        'BAO-789',
        'BBO-789',
        'BCO-789',
        'ADI-789',
        'ADO-789',
        'KOC-1234',
        'M1234567',
        'W-12345',
        'S BCF 83',
        'X-D 1234',
        'C-D 1234',
        'HU 12-34',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['any'],
      valid: [
        'FL 1',
        'FS AB 123',
      ],
      invalid: [
        '',
        'FL 999999',
        'FS AB 1234 A',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['asdfasdf'],
      error: [
        'FL 1',
        'FS AB 123',
        'FL 999999',
        'FS AB 1234 A',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['sv-SE'],
      valid: [
        'ABC 123',
        'ABC 12A',
        'ABC123',
        'ABC12A',
        'A WORD',
        'WORD',
        'ÅSNA',
        'EN VARG',
        'CERISE',
        'AA',
        'ABCDEFG',
        'ÅÄÖ',
        'ÅÄÖ ÅÄÖ',
      ],
      invalid: [
        '',
        '    ',
        'IQV 123',
        'IQV123',
        'ABI 12Q',
        'ÅÄÖ 123',
        'ÅÄÖ 12A',
        'AB1 A23',
        'AB1 12A',
        'lower',
        'abc 123',
        'abc 12A',
        'abc 12a',
        'AbC 12a',
        'WORDLONGERTHANSEVENCHARACTERS',
        'A',
        'ABC-123',
      ],
    });
    test({
      validator: 'isLicensePlate',
      args: ['en-IN'],
      valid: [
        'MH 04 AD 0001',
        'HR26DQ0001',
        'WB-04-ZU-2001',
        'KL 18 X 5800',
        'DL 4 CAF 4856',
        'KA-41CE-5289',
        'GJ 04-AD 5822',
      ],
      invalid: ['mh04ad0045', 'invalidlicenseplate', '4578', '', 'GJ054GH4785'],
    });
    test({
      validator: 'isLicensePlate',
      args: ['en-SG'],
      valid: [
        'SGX 1234 A',
        'SGX-1234-A',
        'SGB1234Z',
      ],
      invalid: [
        'sg1234a',
        'invalidlicenseplate',
        '4578',
        '',
        'GJ054GH4785',
      ],
    });
  });

  it('should validate VAT numbers', () => {
    test({
      validator: 'isVAT',
      args: ['AT'],
      valid: [
        'ATU12345678',
        'U12345678',
      ],
      invalid: [
        'AT 12345678',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['BE'],
      valid: [
        'BE1234567890',
        '1234567890',
      ],
      invalid: [
        'BE 1234567890',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['BG'],
      valid: [
        'BG1234567890',
        '1234567890',
        'BG123456789',
        '123456789',
      ],
      invalid: [
        'BG 1234567890',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['HR'],
      valid: [
        'HR12345678901',
        '12345678901',
      ],
      invalid: [
        'HR 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CY'],
      valid: [
        'CY123456789',
        '123456789',
      ],
      invalid: [
        'CY 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CZ'],
      valid: [
        'CZ1234567890',
        'CZ123456789',
        'CZ12345678',
        '1234567890',
        '123456789',
        '12345678',
      ],
      invalid: [
        'CZ 123456789',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['DK'],
      valid: [
        'DK12345678',
        '12345678',
      ],
      invalid: [
        'DK 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['EE'],
      valid: [
        'EE123456789',
        '123456789',
      ],
      invalid: [
        'EE 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['FI'],
      valid: [
        'FI12345678',
        '12345678',
      ],
      invalid: [
        'FI 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['FR'],
      valid: [
        'FRAA123456789',
        'FR83404833048',
        'FR40123456789',
        'FRA1123456789',
        'FR1A123456789',
      ],
      invalid: [
        'FR AA123456789',
        '123456789',
        'FRAA123456789A',
        'FR123456789',
        'FR 83404833048',
        'FRaa123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['DE'],
      valid: [
        'DE123456789',
        '123456789',
      ],
      invalid: [
        'DE 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['EL'],
      valid: [
        'EL123456789',
        '123456789',
      ],
      invalid: [
        'EL 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['HU'],
      valid: [
        'HU12345678',
        '12345678',
      ],
      invalid: [
        'HU 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['IE'],
      valid: [
        'IE1234567AW',
        '1234567AW',
      ],
      invalid: [
        'IE 1234567',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['IT'],
      valid: [
        'IT12345678910',
        '12345678910',
      ],
      invalid: [
        'IT12345678 910',
        'IT 123456789101',
        'IT123456789101',
        'GB12345678910',
        'IT123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['LV'],
      valid: [
        'LV12345678901',
        '12345678901',
      ],
      invalid: [
        'LV 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['LT'],
      valid: [
        'LT123456789012',
        '123456789012',
        'LT12345678901',
        '12345678901',
        'LT1234567890',
        '1234567890',
        'LT123456789',
        '123456789',
      ],
      invalid: [
        'LT 123456789012',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['LU'],
      valid: [
        'LU12345678',
        '12345678',
      ],
      invalid: [
        'LU 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['MT'],
      valid: [
        'MT12345678',
        '12345678',
      ],
      invalid: [
        'MT 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['NL'],
      valid: [
        'NL123456789B10',
        '123456789B10',
      ],
      invalid: [
        'NL12345678 910',
        'NL 123456789101',
        'NL123456789B1',
        'GB12345678910',
        'NL123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PL'],
      valid: [
        'PL1234567890',
        '1234567890',
        'PL123-456-78-90',
        '123-456-78-90',
        'PL123-45-67-890',
        '123-45-67-890',
      ],
      invalid: [
        'PL 1234567890',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PT'],
      valid: [
        'PT123456789',
        '123456789',
      ],
      invalid: [
        'PT 123456789',
        '000000001',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['RO'],
      valid: [
        'RO1234567890',
        '1234567890',
        'RO12',
        '12',
      ],
      invalid: [
        'RO 12',
        '1',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SK'],
      valid: [
        'SK1234567890',
        '1234567890',
      ],
      invalid: [
        'SK 1234567890',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SI'],
      valid: [
        'SI12345678',
        '12345678',
      ],
      invalid: [
        'SI 12345678',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['ES'],
      valid: [
        'ESA1234567A',
        'A1234567A',
      ],
      invalid: [
        'ES 1234567A',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SE'],
      valid: [
        'SE123456789012',
        '123456789012',
      ],
      invalid: [
        'SE 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['AL'],
      valid: [
        'AL123456789A',
        '123456789A',
      ],
      invalid: [
        'AL 123456789A',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['MK'],
      valid: [
        'MK1234567890123',
        '1234567890123',
      ],
      invalid: [
        'MK 1234567890123',
        '123456789012',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['AU'],
      valid: [
        'AU53004085616',
        '53004085616',
        'AU65613309809',
        '65613309809',
        'AU34118972998',
        '34118972998',
      ],
      invalid: [
        'AU65613309808',
        '65613309808',
        'AU55613309809',
        '55613309809',
        'AU65613319809',
        '65613319809',
        'AU34117972998',
        '34117972998',
        'AU12345678901',
        '12345678901',
        'AU 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['BY'],
      valid: [
        'УНП 123456789',
        '123456789',
      ],
      invalid: [
        'BY 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CA'],
      valid: [
        'CA123456789',
        '123456789',
      ],
      invalid: [
        'CA 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['IS'],
      valid: [
        'IS123456',
        '12345',
      ],
      invalid: [
        'IS 12345',
        '1234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['IN'],
      valid: [
        'IN123456789012345',
        '123456789012345',
      ],
      invalid: [
        'IN 123456789012345',
        '12345678901234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['ID'],
      valid: [
        'ID123456789012345',
        '123456789012345',
        'ID12.345.678.9-012.345',
        '12.345.678.9-012.345',
      ],
      invalid: [
        'ID 123456789012345',
        '12345678901234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['IL'],
      valid: [
        'IL123456789',
        '123456789',
      ],
      invalid: [
        'IL 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['KZ'],
      valid: [
        'KZ123456789012',
        '123456789012',
      ],
      invalid: [
        'KZ 123456789012',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['NZ'],
      valid: [
        'NZ123456789',
        '123456789',
      ],
      invalid: [
        'NZ 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['NG'],
      valid: [
        'NG123456789012',
        '123456789012',
        'NG12345678-9012',
        '12345678-9012',
      ],
      invalid: [
        'NG 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['NO'],
      valid: [
        'NO123456789MVA',
        '123456789MVA',
      ],
      invalid: [
        'NO 123456789MVA',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PH'],
      valid: [
        'PH123456789012',
        '123456789012',
        'PH123 456 789 012',
        '123 456 789 012',
      ],
      invalid: [
        'PH 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['RU'],
      valid: [
        'RU1234567890',
        '1234567890',
        'RU123456789012',
        '123456789012',
      ],
      invalid: [
        'RU 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SM'],
      valid: [
        'SM12345',
        '12345',
      ],
      invalid: [
        'SM 12345',
        '1234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SA'],
      valid: [
        'SA123456789012345',
        '123456789012345',
      ],
      invalid: [
        'SA 123456789012345',
        '12345678901234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['RS'],
      valid: [
        'RS123456789',
        '123456789',
      ],
      invalid: [
        'RS 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CH'],
      valid: [
        // strictly valid
        'CHE-116.281.710 MWST',
        'CHE-116.281.710 IVA',
        'CHE-116.281.710 TVA',
        // loosely valid presentation variants
        'CHE 116 281 710 IVA', // all separators are spaces
        'CHE-191.398.369MWST', // no space before suffix
        'CHE-116281710 MWST', // no number separators
        'CHE-116281710MWST', // no number separators and no space before suffix
        'CHE105854263MWST', // no separators
        'CHE-116.285.524', // no suffix (vat abbreviation)
        'CHE116281710', // no suffix and separators
        '116.281.710 TVA', // no prefix (CHE, ISO-3166-1 Alpha-3)
        '116281710MWST', // no prefix and separators
        '100.218.485', // no prefix and suffix
        '123456788', // no prefix, separators and suffix
      ],
      invalid: [
        'CH-116.281.710 MWST', // invalid prefix (should be CHE)
        'CHE-116.281 MWST', // invalid number of digits (should be 9)
        'CHE-123.456.789 MWST', // invalid last digit (should match the calculated check-number 8)
        'CHE-123.356.780 MWST', // invalid check-number (there are no swiss UIDs with the calculated check number 10)
        'CH-116.281.710 VAT', // invalid suffix (should be MWST, IVA or TVA)
        'CHE-116/281/710 IVA', // invalid number separators (should be all dots or all spaces)
      ],
    });
    test({
      validator: 'isVAT',
      args: ['TR'],
      valid: [
        'TR1234567890',
        '1234567890',
      ],
      invalid: [
        'TR 1234567890',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['UA'],
      valid: [
        'UA123456789012',
        '123456789012',
      ],
      invalid: [
        'UA 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['GB'],
      valid: [
        'GB999 9999 00',
        'GB999 9999 96',
        'GB999999999 999',
        'GBGD000',
        'GBGD499',
        'GBHA500',
        'GBHA999',
      ],
      invalid: [
        'GB999999900',
        'GB999999996',
        'GB999 9999 97',
        'GB999999999999',
        'GB999999999 9999',
        'GB9999999999 999',
        'GBGD 000',
        'GBGD 499',
        'GBHA 500',
        'GBHA 999',
        'GBGD500',
        'GBGD999',
        'GBHA000',
        'GBHA499',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['UZ'],
      valid: [
        'UZ123456789',
        '123456789',
      ],
      invalid: [
        'UZ 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['AR'],
      valid: [
        'AR12345678901',
        '12345678901',
      ],
      invalid: [
        'AR 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['BO'],
      valid: [
        'BO1234567',
        '1234567',
      ],
      invalid: [
        'BO 1234567',
        '123456',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['BR'],
      valid: [
        'BR12.345.678/9012-34',
        '12.345.678/9012-34',
        'BR123.456.789-01',
        '123.456.789-01',
      ],
      invalid: [
        'BR 12.345.678/9012-34',
        '12345678901234',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CL'],
      valid: [
        'CL12345678-9',
        '12345678-9',
      ],
      invalid: [
        'CL 12345678-9',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CO'],
      valid: [
        'CO1234567890',
        '1234567890',
      ],
      invalid: [
        'CO 1234567890',
        '123456789',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['CR'],
      valid: [
        'CR123456789012',
        '123456789012',
        'CR123456789',
        '123456789',
      ],
      invalid: [
        'CR 123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['EC'],
      valid: [
        'EC1234567890123',
        '1234567890123',
      ],
      invalid: [
        'EC 1234567890123',
        '123456789012',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['SV'],
      valid: [
        'SV1234-567890-123-1',
        '1234-567890-123-1',
      ],
      invalid: [
        'SV 1234-567890-123-1',
        '1234567890123',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['GT'],
      valid: [
        'GT1234567-8',
        '1234567-8',
      ],
      invalid: [
        'GT 1234567-8',
        '1234567',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['HN'],
      valid: [
        'HN',
      ],
      invalid: [
        'HN ',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['MX'],
      valid: [
        'MXABCD123456EFG',
        'ABCD123456EFG',
        'MXABC123456DEF',
        'ABC123456DEF',
      ],
      invalid: [
        'MX ABC123456EFG',
        '123456',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['NI'],
      valid: [
        'NI123-456789-0123A',
        '123-456789-0123A',
      ],
      invalid: [
        'NI 123-456789-0123A',
        '1234567890123',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PA'],
      valid: [
        'PA',
      ],
      invalid: [
        'PA ',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PY'],
      valid: [
        'PY12345678-9',
        '12345678-9',
        'PY123456-7',
        '123456-7',
      ],
      invalid: [
        'PY 123456-7',
        '123456',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['PE'],
      valid: [
        'PE12345678901',
        '12345678901',
      ],
      invalid: [
        'PE 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['DO'],
      valid: [
        'DO12345678901',
        '12345678901',
        'DO123-4567890-1',
        '123-4567890-1',
        'DO123456789',
        '123456789',
        'DO1-23-45678-9',
        '1-23-45678-9',
      ],
      invalid: [
        'DO 12345678901',
        '1234567890',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['UY'],
      valid: [
        'UY123456789012',
        '123456789012',
      ],
      invalid: [
        'UY 123456789012',
        '12345678901',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['VE'],
      valid: [
        'VEJ-123456789',
        'J-123456789',
        'VEJ-12345678-9',
        'J-12345678-9',
      ],
      invalid: [
        'VE J-123456789',
        '12345678',
      ],
    });
    test({
      validator: 'isVAT',
      args: ['invalidCountryCode'],
      error: [
        'GB999 9999 00',
      ],
    });
  });

  it('should validate mailto URI', () => {
    test({
      validator: 'isMailtoURI',
      valid: [
        'mailto:?subject=something&cc=valid@mail.com',
        'mailto:?subject=something&cc=valid@mail.com,another@mail.com,',
        'mailto:?subject=something&bcc=valid@mail.com',
        'mailto:?subject=something&bcc=valid@mail.com,another@mail.com',
        'mailto:?bcc=valid@mail.com,another@mail.com',
        'mailto:?cc=valid@mail.com,another@mail.com',
        'mailto:?cc=valid@mail.com',
        'mailto:?bcc=valid@mail.com',
        'mailto:?subject=something&body=something else',
        'mailto:?subject=something&body=something else&cc=hello@mail.com,another@mail.com',
        'mailto:?subject=something&body=something else&bcc=hello@mail.com,another@mail.com',
        'mailto:?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com',
        'mailto:hello@mail.com',
        'mailto:info@mail.com?',
        'mailto:hey@mail.com?subject=something',
        'mailto:info@mail.com?subject=something&cc=valid@mail.com',
        'mailto:info@mail.com?subject=something&cc=valid@mail.com,another@mail.com,',
        'mailto:info@mail.com?subject=something&bcc=valid@mail.com',
        'mailto:info@mail.com?subject=something&bcc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?bcc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?cc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?cc=valid@mail.com',
        'mailto:info@mail.com?bcc=valid@mail.com&',
        'mailto:info@mail.com?subject=something&body=something else',
        'mailto:info@mail.com?subject=something&body=something else&cc=hello@mail.com,another@mail.com',
        'mailto:info@mail.com?subject=something&body=something else&bcc=hello@mail.com,another@mail.com',
        'mailto:info@mail.com?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com',
        'mailto:',
      ],
      invalid: [
        '',
        'something',
        'valid@gmail.com',
        'mailto:?subject=okay&subject=444',
        'mailto:?subject=something&wrong=888',
        'mailto:somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?cc=somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?bcc=somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?bcc=somename@ｇｍａｉｌ.com&bcc',
        'mailto:valid@gmail.com?subject=anything&body=nothing&cc=&bcc=&key=',
        'mailto:hello@world.com?cc=somename',
        'mailto:somename',
        'mailto:info@mail.com?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com&',
        'mailto:?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com&',
      ],
    });
  });
});
