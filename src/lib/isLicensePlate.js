import assertString from './util/assertString';

const validators = {
  'de-LI': str => /^FL[- ]?\d{1-5}[UZ]?$/.test(str),
  'de-DE': (str) => {
    // Rule 1: License plate must match regex
    const regex = /^[A-Z]{1,3}[- ]?[A-Z]{1,2}[- ]?[0-9]{1,4}$/;
    const plateSections = str.split(/[ -]/g);
    const validFormat = regex.test(str);
    // Rule 2: First section (1-3 letters until sepatator) must be a valid county code
    const countyCodes = [
      'AW', 'AIC', 'FDB', 'UL', 'ABG', 'SLN', 'AK', 'SAW', 'GA', 'KLZ', 'AÖ',
      'LF', 'AZ', 'AM', 'AS', 'BUL', 'ESB', 'NAB', 'SUL', 'WST', 'ABI', 'AZE',
      'BTF', 'KÖT', 'ZE', 'AN', 'DKB', 'FEU', 'ROT', 'AB', 'ALZ', 'A', 'SMÜ',
      'WER', 'AUR', 'NOR', 'DÜW', 'KG', 'BRK', 'HAB', 'KH', 'TÖL', 'WOR', 'BAD',
      'BA', 'BAR', 'BER', 'EW', 'BZ', 'BIW', 'HY', 'KM', 'BT', 'EBS', 'KEM',
      'MÜB', 'PEG', 'BGL', 'BGD', 'REI', 'HP', 'B', 'WIL', 'BKS', 'BC', 'BI',
      'BIR', 'BO', 'WAT', 'FN', 'TT', 'ÜB', 'BN', 'BOR', 'AH', 'BOH', 'BOT',
      'BRB', 'BS', 'FR', 'HB', 'BLK', 'HHM', 'NEB', 'NMB', 'WSF', 'ZZ', 'BB',
      'LEO', 'BK', 'BÖ', 'HDL', 'OC', 'OK', 'WMS', 'WZL', 'BÜS', 'CW', 'CE',
      'CHA', 'KÖZ', 'ROD', 'WÜM', 'C', 'CLP', 'CO', 'NEC', 'COC', 'ZEL', 'COE',
      'LH', 'CB', 'CUX', 'DAH', 'LDS', 'KW', 'LC', 'LN', 'DA', 'DI', 'DEG',
      'DEL', 'DE', 'RSL', 'DH', 'SY', 'DLG', 'DGF', 'LAN', 'HEI', 'MED', 'DON',
      'NÖ', 'KIB', 'ROK', 'DO', 'DD', 'DU', 'DN', 'JÜL', 'MON', 'SLE', 'D',
      'EBE', 'EIC', 'HIG', 'WBS', 'EI', 'BIT', 'PRÜ', 'EA', 'EE', 'FI', 'LIB',
      'EMD', 'EM', 'EL', 'EN', 'WIT', 'PF', 'ED', 'EF', 'ER', 'ERH', 'HÖS',
      'ERZ', 'ANA', 'ASZ', 'AU', 'MAB', 'MEK', 'STL', 'SZB', 'ZP', 'E', 'ES',
      'NT', 'EU', 'FL', 'FO', 'FT', 'FF', 'F', 'FS', 'FDS', 'HCH', 'HOR',
      'WOL', 'FRG', 'GRA', 'WOS', 'FRI', 'FD', 'FFB', 'FÜ', 'GAP', 'GE', 'G',
      'GER', 'GI', 'GF', 'GS', 'BRL', 'CLZ', 'GTH', 'NOH', 'HGW', 'GRZ', 'ZR',
      'GG', 'GP', 'GR', 'LÖB', 'NOL', 'NY', 'WSW', 'ZI', 'GÖ', 'DUD', 'HMÜ',
      'OHA', 'GZ', 'KRU', 'GT', 'HA', 'HAL', 'HH', 'HM', 'HAM', 'HU', 'WL',
      'HZ', 'HBS', 'QLB', 'WR', 'HVL', 'NAU', 'RN', 'HAS', 'EBN', 'GEO', 'HOH',
      'HK', 'HD', 'HDH', 'HN', 'HS', 'ERK', 'GK', 'HE', 'HF', 'HER', 'WAN',
      'HEF', 'ROF', 'RZ', 'HBN', 'HI', 'ALF', 'HSK', 'HG', 'USI', 'HO', 'NAI',
      'REH', 'SAN', 'KÜN', 'ÖHR', 'HOL', 'HX', 'WAR', 'IK', 'ARN', 'IL', 'IN',
      'J', 'JL', 'BRG', 'GNT', 'KL', 'KA', 'KS', 'HOG', 'WOH', 'KF', 'KEH',
      'MAI', 'PAR', 'RID', 'ROL', 'KE', 'KI', 'KT', 'KLE', 'GEL', 'KO', 'KN',
      'KR', 'KC', 'KU', 'KUS', 'KYF', 'ART', 'SDH', 'K', 'LDK', 'DIL', 'LD',
      'LL', 'LA', 'MAL', 'VIB', 'LER', 'L', 'BNA', 'GHA', 'GRM', 'MTL', 'WUR',
      'LEV', 'OP', 'LIF', 'STE', 'LM', 'WEL', 'LI', 'LIP', 'LB', 'VAI', 'LU',
      'LUP', 'HGN', 'LBZ', 'LWL', 'PCH', 'STB', 'LÖ', 'HL', 'DAN', 'LG', 'MD',
      'MKK', 'GN', 'SLÜ', 'MSP', 'TBB', 'MGH', 'MTK', 'MZ', 'BIN', 'MA', 'MSH',
      'EIL', 'HET', 'ML', 'SGH', 'MR', 'BID', 'MYK', 'MY', 'MSE', 'AT', 'DM',
      'MC', 'MST', 'MÜR', 'NZ', 'RM', 'WRN', 'MEI', 'GRH', 'RG', 'RIE', 'MM',
      'MZG', 'ME', 'MB', 'MIL', 'OBB', 'MI', 'FG', 'BED', 'DL', 'FLÖ', 'HC',
      'MW', 'RL', 'MOL', 'FRW', 'SEE', 'SRB', 'MK', 'MG', 'MÜ', 'WS', 'MH',
      'M', 'AIB', 'MS', 'MOS', 'BCH', 'NU', 'ILL', 'NB', 'ND', 'SOB', 'NM',
      'NMS', 'NK', 'NEA', 'SEF', 'UFF', 'NEW', 'VOH', 'NW', 'NR', 'NI', 'NF',
      'NDH', 'TDO', 'DZ', 'EB', 'OZ', 'TG', 'TO', 'NWM', 'GDB', 'GVM', 'WIS',
      'NOM', 'EIN', 'GAN', 'N', 'LAU', 'HEB', 'OA', 'GM', 'OB', 'OHV', 'OSL',
      'CA', 'SFB', 'ERB', 'LOS', 'BSK', 'EH', 'FW', 'OF', 'OL', 'OE', 'OG',
      'BH', 'KEL', 'LR', 'OS', 'BSB', 'MEL', 'WTL', 'AA', 'GD', 'OAL', 'FÜS',
      'MOD', 'OHZ', 'OH', 'OPR', 'KY', 'NP', 'WK', 'PB', 'BÜR', 'PA', 'PE',
      'PAF', 'PI', 'PS', 'PLÖ', 'P', 'PM', 'PR', 'RA', 'RV', 'RE', 'CAS',
      'GLA', 'REG', 'VIT', 'R', 'H', 'SB', 'WN', 'RS', 'RD', 'ECK', 'RT',
      'BM', 'SIM', 'GOA', 'NE', 'GV', 'EMS', 'DIZ', 'GOH', 'RP', 'SU', 'RÜD',
      'SWA', 'GL', 'NES', 'KÖN', 'MET', 'RO', 'LRO', 'BÜZ', 'DBR', 'GÜ', 'ROS',
      'TET', 'HRO', 'ROW', 'BRV', 'RH', 'HIP', 'PAN', 'EG', 'GRI', 'RW', 'SHK',
      'EIS', 'SRO', 'SOK', 'LBS', 'PN', 'SCZ', 'SK', 'MER', 'MQ', 'QFT', 'SLF',
      'RU', 'SLS', 'HOM', 'SZ', 'SLK', 'ASL', 'BBG', 'SBK', 'SFT', 'SHG', 'RI',
      'SL', 'SM', 'MGN', 'SC', 'HR', 'FZ', 'MEG', 'ZIG', 'SAD', 'NEN', 'OVI',
      'VS', 'SW', 'SN', 'SHA', 'CR', 'SE', 'SI', 'BLB', 'SIG', 'SO', 'LP',
      'SG', 'SON', 'NH', 'SP', 'SPN', 'FOR', 'GUB', 'SPB', 'IGB', 'WND', 'STD',
      'STA', 'IZ', 'ST', 'BF', 'TE', 'SDL', 'HV', 'OBG', 'OD', 'HST', 'SR',
      'BOG', 'S', 'AC', 'SHL', 'PIR', 'DW', 'FTL', 'SEB', 'SÖM', 'SÜW', 'ZW',
      'TF', 'TIR', 'TS', 'TR', 'SAB', 'TUT', 'TÜ', 'UM', 'ANG', 'PZ', 'SDT',
      'TP', 'UE', 'UN', 'LÜN', 'UH', 'LSZ', 'MHL', 'MN', 'VEC', 'VER', 'VIE',
      'KK', 'VB', 'V', 'AE', 'OVL', 'PL', 'RC', 'VG', 'ANK', 'GW', 'OVP',
      'PW', 'SBG', 'UEM', 'UER', 'WLG', 'VR', 'GMN', 'NVP', 'RDG', 'RÜG', 'DAU',
      'VK', 'KB', 'FKB', 'WA', 'WT', 'WAF', 'BE', 'WAK', 'SLZ', 'WEN', 'WM',
      'SOG', 'WE', 'AP', 'APD', 'WUG', 'GUN', 'ESW', 'WIZ', 'WES', 'DIN', 'MO',
      'BRA', 'WW', 'FB', 'BÜD', 'WZ', 'WI', 'WHV', 'HWI', 'WB', 'GHC', 'JE',
      'WTM', 'WF', 'WOB', 'WO', 'WUN', 'MAK', 'SEL', 'W', 'WÜ', 'OCH', 'BL',
      'Z', 'GC', 'HOT', 'WDA',
    ];
    const validCountyCode = countyCodes.includes(plateSections[0]);
    // Rule 3: Certain letter combinations are forbidden in the middle section
    const forbiddenMiddleSections = ['KZ', 'HJ', 'NS', 'SA', 'SS'];
    const noForbiddenMiddleSection = !forbiddenMiddleSections.includes(plateSections[1]);
    // Rule 4: No license plate must be longer then 8 characters.
    const validLength = `${plateSections[0]}${plateSections[1]}${plateSections[2]}`.length <= 8;
    return validFormat && validCountyCode && noForbiddenMiddleSection && validLength;
  },
};

export default function isLicensePlate(str, locale) {
  assertString(str);
  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (const key in validators) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (validators.hasOwnProperty(key)) {
        const validator = validators[key];
        if (validator(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error(`Invalid locale '${locale}'`);
}
