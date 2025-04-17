import test from '../testFunctions';

describe('isIBAN', () => {
  it('should validate IBAN', () => {
    test({
      validator: 'isIBAN',
      valid: [
        'SC52BAHL01031234567890123456USD',
        'LC14BOSL123456789012345678901234',
        'MT31MALT01100000000000000000123',
        'SV43ACAT00000000000000123123',
        'EG800002000156789012345180002',
        'BE71 0961 2345 6769',
        'FR76 3000 6000 0112 3456 7890 189',
        'DE91 1000 0000 0123 4567 89',
        'GR96 0810 0010 0000 0123 4567 890',
        'RO09 BCYP 0000 0012 3456 7890',
        'SA44 2000 0001 2345 6789 1234',
        'ES79 2100 0813 6101 2345 6789',
        'CH56 0483 5012 3456 7800 9',
        'GB98 MIDL 0700 9312 3456 78',
        'IL170108000000012612345',
        'IT60X0542811101000000123456',
        'JO71CBJO0000000000001234567890',
        'TR320010009999901234567890',
        'BR1500000000000010932840814P2',
        'LB92000700000000123123456123',
        'IR200170000000339545727003',
        'MZ97123412341234123412341',
        'MA64011519000001205000534921',
        'VG96VPVG0000012345678901',
        'DZ580002100001113000000570',
        'IE29AIBK93115212345678',
        'PS92PALS000000000400123456702',
        'PS92PALS00000000040012345670O',
      ],
      invalid: [
        'XX22YYY1234567890123',
        'FR14 2004 1010 0505 0001 3',
        'FR7630006000011234567890189@',
        'FR7630006000011234567890189😅',
        'FR763000600001123456!!🤨7890189@',
        'VG46H07Y0223060094359858',
        'IE95TE8270900834048660',
        'PS072435171802145240705922007',
      ],
    });
    test({
      validator: 'isIBAN',
      args: [{ whitelist: ['DK', 'GB'] }],
      valid: ['DK5000400440116243', 'GB29NWBK60161331926819'],
      invalid: [
        'BE71 0961 2345 6769',
        'FR76 3000 6000 0112 3456 7890 189',
        'DE91 1000 0000 0123 4567 89',
        'GR96 0810 0010 0000 0123 4567 890',
        'RO09 BCYP 0000 0012 3456 7890',
        'SA44 2000 0001 2345 6789 1234',
        'ES79 2100 0813 6101 2345 6789',
        'XX22YYY1234567890123',
        'FR14 2004 1010 0505 0001 3',
        'FR7630006000011234567890189@',
        'FR7630006000011234567890189😅',
        'FR763000600001123456!!🤨7890189@',
      ],
    });
    test({
      validator: 'isIBAN',
      args: [{ whitelist: ['XX', 'AA'] }],
      invalid: [
        'DK5000400440116243',
        'GB29NWBK60161331926819',
        'BE71 0961 2345 6769',
        'FR76 3000 6000 0112 3456 7890 189',
        'DE91 1000 0000 0123 4567 89',
        'GR96 0810 0010 0000 0123 4567 890',
        'RO09 BCYP 0000 0012 3456 7890',
        'SA44 2000 0001 2345 6789 1234',
        'ES79 2100 0813 6101 2345 6789',
        'XX22YYY1234567890123',
        'FR14 2004 1010 0505 0001 3',
        'FR7630006000011234567890189@',
        'FR7630006000011234567890189😅',
        'FR763000600001123456!!🤨7890189@',
      ],
    });
    test({
      validator: 'isIBAN',
      args: [{ blacklist: ['IT'] }],
      valid: [
        'SC52BAHL01031234567890123456USD',
        'LC14BOSL123456789012345678901234',
        'MT31MALT01100000000000000000123',
        'SV43ACAT00000000000000123123',
        'EG800002000156789012345180002',
        'BE71 0961 2345 6769',
        'FR76 3000 6000 0112 3456 7890 189',
        'DE91 1000 0000 0123 4567 89',
        'GR96 0810 0010 0000 0123 4567 890',
        'RO09 BCYP 0000 0012 3456 7890',
        'SA44 2000 0001 2345 6789 1234',
        'ES79 2100 0813 6101 2345 6789',
        'CH56 0483 5012 3456 7800 9',
        'GB98 MIDL 0700 9312 3456 78',
        'IL170108000000012612345',
        'JO71CBJO0000000000001234567890',
        'TR320010009999901234567890',
        'BR1500000000000010932840814P2',
        'LB92000700000000123123456123',
        'IR200170000000339545727003',
        'MZ97123412341234123412341',
      ],
      invalid: [
        'XX22YYY1234567890123',
        'FR14 2004 1010 0505 0001 3',
        'FR7630006000011234567890189@',
        'FR7630006000011234567890189😅',
        'FR763000600001123456!!🤨7890189@',
        'IT60X0542811101000000123456',
      ],
    });
  });
});
