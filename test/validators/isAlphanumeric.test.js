import { test } from '../testFunctions';

describe('isAlphanumeric', () => {
  it('should validate alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      valid: [
        'abc123',
        'ABC11',
      ],
      invalid: [
        'abc ',
        'foo!!',
        'ÄBC',
        'FÜübar',
        'Jön',
      ],
    });
  });

  it('should validate alphanumeric string with ignored characters', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'en-US', ignore: '@_- ' }], // ignore [@ space _ -]
      valid: [
        'Hello@123',
        'this is a valid alphaNumeric string',
        'En-US @ alpha_numeric',
      ],
      invalid: [
        'In*Valid',
        'hello$123',
        '{invalid}',
      ],
    });

    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'en-US', ignore: /[\s/-]/g }], // ignore [space -]
      valid: [
        'en-US',
        'this is a valid alphaNumeric string',
      ],
      invalid: [
        'INVALID$ AlphaNum Str',
        'hello@123',
        'abc*123',
      ],
    });

    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'en-US', ignore: 1234 }], // invalid ignore matcher (ignore should be instance of a String or RegExp)
      error: [
        'alpha',
      ],
    });
  });

  it('should validate defined english aliases', () => {
    test({
      validator: 'isAlphanumeric',
      args: ['en-GB'],
      valid: [
        'abc123',
        'ABC11',
      ],
      invalid: [
        'abc ',
        'foo!!',
        'ÄBC',
        'FÜübar',
        'Jön',
      ],
    });
  });

  it('should validate Azerbaijani alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'az-AZ' }],
      valid: [
        'Azərbaycan',
        'Bakı',
        'abc1',
        'abcç2',
        '3kərə4kərə',
      ],
      invalid: [
        '  foo1  ',
        '',
        'ab(cd)',
        'simvol@',
        'wəkil',
      ],
    });
  });

  it('should validate bulgarian alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'bg-BG' }],
      valid: [
        'абв1',
        '4АБ5В6',
        'жаба',
        'яГоДа2',
        'йЮя',
        '123',
      ],
      invalid: [
        ' ',
        '789  ',
        'hello000',
      ],
    });
  });

  it('should validate Bengali alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'bn-BD' }],
      valid: [
        'দ্গজ্ঞহ্রত্য১২৩',
        'দ্গগফ৮৯০',
        'চব৩৬৫ভবচ',
        '১২৩৪',
        '৩৪২৩৪দফজ্ঞদফ',
      ],
      invalid: [
        ' ',
        '১২৩  ',
        'hel৩২0',
      ],
    });
  });

  it('should validate czech alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'cs-CZ' }],
      valid: [
        'řiť123',
        'KŮŇ11',
      ],
      invalid: [
        'řiď ',
        'blé!!',
      ],
    });
  });

  it('should validate slovak alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'sk-SK' }],
      valid: [
        '1môj',
        '2ľúbím',
        '3mäkčeň',
        '4stĹp',
        '5vŕba',
        '6ňorimberk',
        '7ťava',
        '8žanéta',
        '9Ďábelské',
        '10ódy',
      ],
      invalid: [
        '1moj!',
        '你好世界',
        '  Привет мир  ',
      ],
    });
  });

  it('should validate danish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'da-DK' }],
      valid: [
        'ÆØÅ123',
        'Ære321',
        '321Øre',
        '123Åre',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        '',
      ],
    });
  });

  it('should validate dutch alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'nl-NL' }],
      valid: [
        'Kán123',
        'één354',
        'v4óór',
        'nú234',
        'hé54él',
      ],
      invalid: [
        '1äca ',
        'ab3cß',
        'Øre',
      ],
    });
  });

  it('should validate finnish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'fi-FI' }],
      valid: [
        'äiti124',
        'ÖLJY1234',
        '123Åke',
        '451åå23',
      ],
      invalid: [
        'AİıÖöÇçŞşĞğÜüZ',
        'foo!!',
        '',
      ],
    });
  });

  it('should validate german alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'de-DE' }],
      valid: [
        'äbc123',
        'ÄBC11',
      ],
      invalid: [
        'äca ',
        'föö!!',
      ],
    });
  });

  it('should validate hungarian alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'hu-HU' }],
      valid: [
        '0árvíztűrőtükörfúrógép123',
        '0ÁRVÍZTŰRŐTÜKÖRFÚRÓGÉP123',
      ],
      invalid: [
        '1időúr!',
        'äbc1',
        '  fäö  ',
        'Heiß!',
        '',
      ],
    });
  });

  it('should validate portuguese alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'pt-PT' }],
      valid: [
        'palíndromo',
        '2órgão',
        'qwértyúão9',
        'àäãcë4üïÄÏÜ',
      ],
      invalid: [
        '!abc',
        'Heiß',
        'Øre',
        'æøå',
        '',
      ],
    });
  });

  it('should validate italian alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'it-IT' }],
      valid: [
        '123àéèìîóòù',
        '123correnti',
        'DEFINIZIONE321',
        'compil123azione',
        'met23ró',
        'pès56ca',
        'PÉS45CA',
        'gen45î',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        'æøå',
        '',
      ],
    });
  });

  it('should validate spanish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'es-ES' }],
      valid: [
        'ábcó123',
        'ÁBCÓ11',
      ],
      invalid: [
        'äca ',
        'abcß',
        'föö!!',
      ],
    });
  });

  it('should validate Vietnamese alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'vi-VN' }],
      valid: [
        'Thầy3',
        '3Gà',
      ],
      invalid: [
        'toang!',
        'Cậu Vàng',
      ],
    });
  });

  it('should validate arabic alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'ar' }],
      valid: [
        'أبت123',
        'أبتَُِ١٢٣',
      ],
      invalid: [
        'äca ',
        'abcß',
        'föö!!',
      ],
    });
  });

  it('should validate Hindi alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'hi-IN' }],
      valid: [
        'अतअपनाअपनीअपनेअभीअंदरआदिआपइत्यादिइनइनकाइन्हींइन्हेंइन्होंइसइसकाइसकीइसकेइसमेंइसीइसेउनउनकाउनकीउनकेउनकोउन्हींउन्हेंउन्होंउसउसकेउसीउसेएकएवंएसऐसेऔरकईकरकरताकरतेकरनाकरनेकरेंकहतेकहाकाकाफ़ीकिकितनाकिन्हेंकिन्होंकियाकिरकिसकिसीकिसेकीकुछकुलकेकोकोईकौनकौनसागयाघरजबजहाँजाजितनाजिनजिन्हेंजिन्होंजिसजिसेजीधरजैसाजैसेजोतकतबतरहतिनतिन्हेंतिन्होंतिसतिसेतोथाथीथेदबारादियादुसरादूसरेदोद्वाराननकेनहींनानिहायतनीचेनेपरपहलेपूरापेफिरबनीबहीबहुतबादबालाबिलकुलभीभीतरमगरमानोमेमेंयदियहयहाँयहीयायिहयेरखेंरहारहेऱ्वासालिएलियेलेकिनववग़ैरहवर्गवहवहाँवहींवालेवुहवेवोसकतासकतेसबसेसभीसाथसाबुतसाभसारासेसोसंगहीहुआहुईहुएहैहैंहोहोताहोतीहोतेहोनाहोने०२३४५६७८९',
        'इन्हें४५६७८९',
      ],
      invalid: [
        'अत ०२३४५६७८९',
        ' ३४५६७८९',
        '12 ',
        ' अत ',
        'abc1',
        'abc',
        '',
      ],
    });
  });

  it('should validate farsi alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'fa-IR' }],
      valid: [
        'پارسی۱۲۳',
        '۱۴۵۶',
        'مژگان9',
      ],
      invalid: [
        'äca ',
        'abcßة',
        'föö!!',
        '٤٥٦',
      ],
    });
  });

  it('should validate Japanese alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'ja-JP' }],
      valid: [
        'あいうえお123',
        '123がぎぐげご',
        'ぁぃぅぇぉ',
        'アイウエオ',
        'ァィゥェ',
        'ｱｲｳｴｵ',
        '２０世紀少年',
        '華氏４５１度',
      ],
      invalid: [
        ' あいう123 ',
        'abcあいう',
        '生きろ!!',
      ],
    });
  });

  it('should validate kurdish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'ku-IQ' }],
      valid: [
        'ئؤڤگێ١٢٣',
      ],
      invalid: [
        'äca ',
        'abcß',
        'föö!!',
      ],
    });
  });

  it('should validate defined arabic aliases', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'ar-SY' }],
      valid: [
        'أبت123',
        'أبتَُِ١٢٣',
      ],
      invalid: [
        'abc ',
        'foo!!',
        'ÄBC',
        'FÜübar',
        'Jön',
      ],
    });
  });

  it('should validate norwegian alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'nb-NO' }],
      valid: [
        'ÆØÅ123',
        'Ære321',
        '321Øre',
        '123Åre',
      ],
      invalid: [
        'äbc123',
        'ÄBC11',
        '',
      ],
    });
  });

  it('should validate polish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'pl-PL' }],
      valid: [
        'kre123ską',
        'zam21knięte',
        'zw23ykłe',
        '123',
        'prz23yjęły',
        'świ23ęty',
        'Poz1322wól',
      ],
      invalid: [
        '12řiď ',
        'blé!!',
        'föö!2!',
      ],
    });
  });

  it('should validate serbian cyrillic alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'sr-RS' }],
      valid: [
        'ШћжЂљЕ123',
        'ЧПСТ132ЋЏ',
      ],
      invalid: [
        'řiď ',
        'blé!!',
        'föö!!',
      ],
    });
  });

  it('should validate serbian latin alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'sr-RS@latin' }],
      valid: [
        'ŠAabčšđćž123',
        'ŠATRO11Ćčđš',
      ],
      invalid: [
        'řiď ',
        'blé!!',
        'föö!!',
      ],
    });
  });

  it('should validate swedish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'sv-SE' }],
      valid: [
        'religiös13',
        'st23jäla',
        'västgöte123',
        '123Åre',
      ],
      invalid: [
        'AİıÖöÇçŞşĞğÜüZ',
        'foo!!',
        '',
      ],
    });
  });

  it('should validate turkish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'tr-TR' }],
      valid: [
        'AİıÖöÇçŞşĞğÜüZ123',
      ],
      invalid: [
        'AİıÖöÇçŞşĞğÜüZ ',
        'foo!!',
        'ÄBC',
      ],
    });
  });

  it('should validate urkrainian alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'uk-UA' }],
      valid: [
        'АБВГҐДЕЄЖЗИIЇЙКЛМНОПРСТУФХЦШЩЬЮЯ123',
      ],
      invalid: [
        'éeoc ',
        'foo!!',
        'ÄBC',
        'ЫыЪъЭэ',
      ],
    });
  });

  it('should validate greek alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'el-GR' }],
      valid: [
        'αβγδεζηθικλμνξοπρςστυφχψω',
        'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
        '20θ',
        '1234568960',
      ],
      invalid: [
        '0AİıÖöÇçŞşĞğÜüZ1',
        '  AİıÖöÇçŞşĞğÜüZ  ',
        'ÄBC',
        'Heiß',
        'ЫыЪъЭэ',
        'jαckγ',
      ],
    });
  });

  it('should validate Hebrew alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'he' }],
      valid: [
        'אבג123',
        'שלום11',
      ],
      invalid: [
        'אבג ',
        'לא!!',
        'abc',
        '  foo  ',
      ],
    });
  });

  it('should validate Thai alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'th-TH' }],
      valid: [
        'สวัสดี ๑๒๓',
        'ยินดีต้อนรับทั้ง ๒ คน',
      ],
      invalid: [
        '1.สวัสดี',
        'ยินดีต้อนรับทั้ง 2 คน',
      ],
    });
  });

  it('should validate Korea alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'ko-KR' }],
      valid: [
        '2002',
        '훈민정음',
        '1446년훈민정음반포',
      ],
      invalid: [
        '2022!',
        '2019 코로나시작',
        '1.로렘입숨',
      ],
    });
  });

  it('should validate Sinhala alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'si-LK' }],
      valid: [
        'චතුර',
        'කචට12',
        'ඎඏදාෛපසුගො2',
        '1234',
      ],
      invalid: [
        'ஆஐअतක',
        'කචට 12',
        ' ඎ ',
        'a1234',
        'abc',
        '',
      ],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isAlphanumeric',
      args: [{ locale: 'is-NOT' }],
      error: [
        '1234568960',
        'abc123',
      ],
    });
  });
});
