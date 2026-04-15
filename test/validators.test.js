import assert from 'assert';
import fs from 'fs';
import timezone_mock from 'timezone-mock';
import vm from 'vm';
import test from './testFunctions';

let validator_js = fs.readFileSync(require.resolve('../validator.js')).toString();

describe('Validators', () => {
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
