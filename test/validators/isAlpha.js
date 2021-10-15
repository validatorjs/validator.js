import { test } from './testUtils';

describe('isAlpha', () => {
  it('should validate alpha strings', () => {
    test({
      validator: 'isAlpha',
      valid: [
        'abc',
        'ABC',
        'FoObar',
      ],
      invalid: [
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate alpha string with ignored characters', () => {
    test({
      validator: 'isAlpha',
      args: ['en-US', { ignore: '- /' }], // ignore [space-/]
      valid: [
        'en-US',
        'this is a valid alpha string',
        'us/usa',
      ],
      invalid: [
        '1. this is not a valid alpha string',
        'this$is also not a valid.alpha string',
        'this is also not a valid alpha string.',
      ],
    });

    test({
      validator: 'isAlpha',
      args: ['en-US', { ignore: /[\s/-]/g }], // ignore [space -]
      valid: [
        'en-US',
        'this is a valid alpha string',
      ],
      invalid: [
        '1. this is not a valid alpha string',
        'this$is also not a valid.alpha string',
        'this is also not a valid alpha string.',
      ],
    });

    test({
      validator: 'isAlpha',
      args: ['en-US', { ignore: 1234 }], // invalid ignore matcher
      error: [
        'alpha',
      ],
    });
  });

  it('should validate Azerbaijani alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['az-AZ'],
      valid: [
        'Azərbaycan',
        'Bakı',
        'üöğıəçş',
        'sizAzərbaycanlaşdırılmışlardansınızmı',
        'dahaBirDüzgünString',
        'abcçdeəfgğhxıijkqlmnoöprsştuüvyz',
      ],
      invalid: [
        'rəqəm1',
        '  foo  ',
        '',
        'ab(cd)',
        'simvol@',
        'wəkil',
      ],
    });
  });

  it('should validate bulgarian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['bg-BG'],
      valid: [
        'абв',
        'АБВ',
        'жаба',
        'яГоДа',
      ],
      invalid: [
        'abc1',
        '  foo  ',
        '',
        'ЁЧПС',
        '_аз_обичам_обувки_',
        'ехо!',
      ],
    });
  });

  it('should validate czech alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['cs-CZ'],
      valid: [
        'žluťoučký',
        'KŮŇ',
        'Pěl',
        'Ďábelské',
        'ódy',
      ],
      invalid: [
        'ábc1',
        '  fůj  ',
        '',
      ],
    });
  });

  it('should validate slovak alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['sk-SK'],
      valid: [
        'môj',
        'ľúbím',
        'mäkčeň',
        'stĹp',
        'vŕba',
        'ňorimberk',
        'ťava',
        'žanéta',
        'Ďábelské',
        'ódy',
      ],
      invalid: [
        '1moj',
        '你好世界',
        '  Привет мир  ',
        'مرحبا العا ',
      ],
    });
  });

  it('should validate danish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['da-DK'],
      valid: [
        'aøå',
        'Ære',
        'Øre',
        'Åre',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        '',
      ],
    });
  });

  it('should validate dutch alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['nl-NL'],
      valid: [
        'Kán',
        'één',
        'vóór',
        'nú',
        'héél',
      ],
      invalid: [
        'äca ',
        'abcß',
        'Øre',
      ],
    });
  });

  it('should validate german alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['de-DE'],
      valid: [
        'äbc',
        'ÄBC',
        'FöÖbär',
        'Heiß',
      ],
      invalid: [
        'äbc1',
        '  föö  ',
        '',
      ],
    });
  });

  it('should validate hungarian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['hu-HU'],
      valid: [
        'árvíztűrőtükörfúrógép',
        'ÁRVÍZTŰRŐTÜKÖRFÚRÓGÉP',
      ],
      invalid: [
        'äbc1',
        '  fäö  ',
        'Heiß',
        '',
      ],
    });
  });

  it('should validate portuguese alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['pt-PT'],
      valid: [
        'palíndromo',
        'órgão',
        'qwértyúão',
        'àäãcëüïÄÏÜ',
      ],
      invalid: [
        '12abc',
        'Heiß',
        'Øre',
        'æøå',
        '',
      ],
    });
  });

  it('should validate italian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['it-IT'],
      valid: [
        'àéèìîóòù',
        'correnti',
        'DEFINIZIONE',
        'compilazione',
        'metró',
        'pèsca',
        'PÉSCA',
        'genî',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        'æøå',
        '',
      ],
    });
  });

  it('should validate Vietnamese alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['vi-VN'],
      valid: [
        'thiến',
        'nghiêng',
        'xin',
        'chào',
        'thế',
        'giới',
      ],
      invalid: [
        'thầy3',
        'Ba gà',
        '',
      ],
    });
  });

  it('should validate arabic alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['ar'],
      valid: [
        'أبت',
        'اَبِتَثّجً',
      ],
      invalid: [
        '١٢٣أبت',
        '١٢٣',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate farsi alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['fa-IR'],
      valid: [
        'پدر',
        'مادر',
        'برادر',
        'خواهر',
      ],
      invalid: [
        'فارسی۱۲۳',
        '۱۶۴',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate finnish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['fi-FI'],
      valid: [
        'äiti',
        'Öljy',
        'Åke',
        'testÖ',
      ],
      invalid: [
        'AİıÖöÇçŞşĞğÜüZ',
        'äöå123',
        '',
      ],
    });
  });

  it('should validate kurdish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['ku-IQ'],
      valid: [
        'ئؤڤگێ',
        'کوردستان',
      ],
      invalid: [
        'ئؤڤگێ١٢٣',
        '١٢٣',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate norwegian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['nb-NO'],
      valid: [
        'aøå',
        'Ære',
        'Øre',
        'Åre',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        '',
      ],
    });
  });

  it('should validate polish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['pl-PL'],
      valid: [
        'kreską',
        'zamknięte',
        'zwykłe',
        'kropką',
        'przyjęły',
        'święty',
        'Pozwól',
      ],
      invalid: [
        '12řiď ',
        'blé!!',
        'föö!2!',
      ],
    });
  });

  it('should validate serbian cyrillic alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['sr-RS'],
      valid: [
        'ШћжЂљЕ',
        'ЧПСТЋЏ',
      ],
      invalid: [
        'řiď ',
        'blé33!!',
        'föö!!',
      ],
    });
  });

  it('should validate serbian latin alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['sr-RS@latin'],
      valid: [
        'ŠAabčšđćž',
        'ŠATROĆčđš',
      ],
      invalid: [
        '12řiď ',
        'blé!!',
        'föö!2!',
      ],
    });
  });

  it('should validate spanish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['es-ES'],
      valid: [
        'ábcó',
        'ÁBCÓ',
        'dormís',
        'volvés',
        'español',
      ],
      invalid: [
        'äca ',
        'abcß',
        'föö!!',
      ],
    });
  });

  it('should validate swedish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['sv-SE'],
      valid: [
        'religiös',
        'stjäla',
        'västgöte',
        'Åre',
      ],
      invalid: [
        'AİıÖöÇçŞşĞğÜüZ',
        'religiös23',
        '',
      ],
    });
  });

  it('should validate defined arabic locales alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['ar-SY'],
      valid: [
        'أبت',
        'اَبِتَثّجً',
      ],
      invalid: [
        '١٢٣أبت',
        '١٢٣',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'FÜübar',
        'Jön',
        'Heiß',
      ],
    });
  });

  it('should validate turkish alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['tr-TR'],
      valid: [
        'AİıÖöÇçŞşĞğÜüZ',
      ],
      invalid: [
        '0AİıÖöÇçŞşĞğÜüZ1',
        '  AİıÖöÇçŞşĞğÜüZ  ',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'Heiß',
      ],
    });
  });

  it('should validate urkrainian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['uk-UA'],
      valid: [
        'АБВГҐДЕЄЖЗИIЇЙКЛМНОПРСТУФХЦШЩЬЮЯ',
      ],
      invalid: [
        '0AİıÖöÇçŞşĞğÜüZ1',
        '  AİıÖöÇçŞşĞğÜüZ  ',
        'abc1',
        '  foo  ',
        '',
        'ÄBC',
        'Heiß',
        'ЫыЪъЭэ',
      ],
    });
  });

  it('should validate greek alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['el-GR'],
      valid: [
        'αβγδεζηθικλμνξοπρςστυφχψω',
        'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
        'άέήίΰϊϋόύώ',
        'ΆΈΉΊΪΫΎΏ',
      ],
      invalid: [
        '0AİıÖöÇçŞşĞğÜüZ1',
        '  AİıÖöÇçŞşĞğÜüZ  ',
        'ÄBC',
        'Heiß',
        'ЫыЪъЭэ',
        '120',
        'jαckγ',
      ],
    });
  });

  it('should validate Hebrew alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['he'],
      valid: [
        'בדיקה',
        'שלום',
      ],
      invalid: [
        'בדיקה123',
        '  foo  ',
        'abc1',
        '',
      ],
    });
  });

  it('should validate Hindi alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['hi-IN'],
      valid: [
        'अतअपनाअपनीअपनेअभीअंदरआदिआपइत्यादिइनइनकाइन्हींइन्हेंइन्होंइसइसकाइसकीइसकेइसमेंइसीइसेउनउनकाउनकीउनकेउनकोउन्हींउन्हेंउन्होंउसउसकेउसीउसेएकएवंएसऐसेऔरकईकरकरताकरतेकरनाकरनेकरेंकहतेकहाकाकाफ़ीकिकितनाकिन्हेंकिन्होंकियाकिरकिसकिसीकिसेकीकुछकुलकेकोकोईकौनकौनसागयाघरजबजहाँजाजितनाजिनजिन्हेंजिन्होंजिसजिसेजीधरजैसाजैसेजोतकतबतरहतिनतिन्हेंतिन्होंतिसतिसेतोथाथीथेदबारादियादुसरादूसरेदोद्वाराननकेनहींनानिहायतनीचेनेपरपहलेपूरापेफिरबनीबहीबहुतबादबालाबिलकुलभीभीतरमगरमानोमेमेंयदियहयहाँयहीयायिहयेरखेंरहारहेऱ्वासालिएलियेलेकिनववग़ैरहवर्गवहवहाँवहींवालेवुहवेवोसकतासकतेसबसेसभीसाथसाबुतसाभसारासेसोसंगहीहुआहुईहुएहैहैंहोहोताहोतीहोतेहोनाहोने',
        'इन्हें',
      ],
      invalid: [
        'अत०२३४५६७८९',
        'अत 12',
        ' अत ',
        'abc1',
        'abc',
        '',
      ],
    });
  });

  it('should validate persian alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['fa-IR'],
      valid: [
        'تست',
        'عزیزم',
        'ح',
      ],
      invalid: [
        'تست 1',
        '  عزیزم  ',
        '',
      ],
    });
  });

  it('should validate Thai alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['th-TH'],
      valid: [
        'สวัสดี',
        'ยินดีต้อนรับ เทสเคส',
      ],
      invalid: [
        'สวัสดีHi',
        '123 ยินดีต้อนรับ',
        'ยินดีต้อนรับ-๑๒๓',
      ],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isAlpha',
      args: ['is-NOT'],
      error: [
        'abc',
        'ABC',
      ],
    });
  });
});
