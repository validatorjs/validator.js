import { repeat, test } from './testUtils';

describe('isEmail', () => {
  it('should validate email addresses', () => {
    test({
      validator: 'isEmail',
      valid: [
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans.m端ller@test.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test123+ext@gmail.com',
        'some.name.midd.leNa.me.and.locality+extension@GoogleMail.com',
        '"foobar"@example.com',
        '"  foo  m端ller "@example.com',
        '"foo\\@bar"@example.com',
        `${repeat('a', 64)}@${repeat('a', 63)}.com`,
        `${repeat('a', 64)}@${repeat('a', 63)}.com`,
        `${repeat('a', 31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
        'test@1337.com',
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'somename@ｇｍａｉｌ.com',
        'foo@bar.co.uk.',
        'z@co.c',
        'ｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌ@gmail.com',
        `${repeat('a', 64)}@${repeat('a', 251)}.com`,
        `${repeat('a', 65)}@${repeat('a', 250)}.com`,
        `${repeat('a', 64)}@${repeat('a', 64)}.com`,
        `${repeat('a', 64)}@${repeat('a', 63)}.${repeat('a', 63)}.${repeat('a', 63)}.${repeat('a', 58)}.com`,
        'test1@invalid.co m',
        'test2@invalid.co m',
        'test3@invalid.co m',
        'test4@invalid.co m',
        'test5@invalid.co m',
        'test6@invalid.co m',
        'test7@invalid.co m',
        'test8@invalid.co m',
        'test9@invalid.co m',
        'test10@invalid.co m',
        'test11@invalid.co m',
        'test12@invalid.co　m',
        'test13@invalid.co　m',
        'multiple..dots@stillinvalid.com',
        'test123+invalid! sub_address@gmail.com',
        'gmail...ignores...dots...@gmail.com',
        'ends.with.dot.@gmail.com',
        'multiple..dots@gmail.com',
        'wrong()[]",:;<>@@gmail.com',
        '"wrong()[]",:;<>@@gmail.com',
        'username@domain.com�',
        'username@domain.com©',
      ],
    });
  });

  it('should validate email addresses with domain specific validation', () => {
    test({
      validator: 'isEmail',
      args: [{ domain_specific_validation: true }],
      valid: [
        'foobar@gmail.com',
        'foo.bar@gmail.com',
        'foo.bar@googlemail.com',
        `${repeat('a', 30)}@gmail.com`,
      ],
      invalid: [
        `${repeat('a', 31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
        '.foobar@gmail.com',
      ],
    });
  });


  it('should validate email addresses without UTF8 characters in local part', () => {
    test({
      validator: 'isEmail',
      args: [{ allow_utf8_local_part: false }],
      valid: [
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test123+ext@gmail.com',
        'some.name.midd.leNa.me+extension@GoogleMail.com',
        '"foobar"@example.com',
        '"foo\\@bar"@example.com',
        '"  foo  bar  "@example.com',
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'foo@bar.co.uk.',
        'somename@ｇｍａｉｌ.com',
        'hans.m端ller@test.com',
        'z@co.c',
        'tüst@invalid.com',
      ],
    });
  });

  it('should validate email addresses with display names', () => {
    test({
      validator: 'isEmail',
      args: [{ allow_display_name: true }],
      valid: [
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans.m端ller@test.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test123+ext@gmail.com',
        'some.name.midd.leNa.me+extension@GoogleMail.com',
        'Some Name <foo@bar.com>',
        'Some Name <x@x.au>',
        'Some Name <foo@bar.com.au>',
        'Some Name <foo+bar@bar.com>',
        'Some Name <hans.m端ller@test.com>',
        'Some Name <hans@m端ller.com>',
        'Some Name <test|123@m端ller.com>',
        'Some Name <test123+ext@gmail.com>',
        '\'Foo Bar, Esq\'<foo@bar.com>',
        'Some Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Some Middle Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Name<some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Some Name <foo@gmail.com>',
        'Name🍓With🍑Emoji🚴‍♀️🏆<test@aftership.com>',
        '🍇🍗🍑<only_emoji@aftership.com>',
        '"<displayNameInBrackets>"<jh@gmail.com>',
        '"\\"quotes\\""<jh@gmail.com>',
        '"name;"<jh@gmail.com>',
        '"name;" <jh@gmail.com>',
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'foo@bar.co.uk.',
        'Some Name <invalidemail@>',
        'Some Name <invalid.com>',
        'Some Name <@invalid.com>',
        'Some Name <foo@bar.com.>',
        'Some Name <foo@bar.co.uk.>',
        'Some Name foo@bar.co.uk.>',
        'Some Name <foo@bar.co.uk.',
        'Some Name < foo@bar.co.uk >',
        'Name foo@bar.co.uk',
        'Some Name <some..name@gmail.com>',
        'Some Name<emoji_in_address🍈@aftership.com>',
        'invisibleCharacter\u001F<jh@gmail.com>',
        '<displayNameInBrackets><jh@gmail.com>',
        '\\"quotes\\"<jh@gmail.com>',
        '""quotes""<jh@gmail.com>',
        'name;<jh@gmail.com>',
        '    <jh@gmail.com>',
        '"    "<jh@gmail.com>',
      ],
    });
  });

  it('should validate email addresses with required display names', () => {
    test({
      validator: 'isEmail',
      args: [{ require_display_name: true }],
      valid: [
        'Some Name <foo@bar.com>',
        'Some Name <x@x.au>',
        'Some Name <foo@bar.com.au>',
        'Some Name <foo+bar@bar.com>',
        'Some Name <hans.m端ller@test.com>',
        'Some Name <hans@m端ller.com>',
        'Some Name <test|123@m端ller.com>',
        'Some Name <test123+ext@gmail.com>',
        'Some Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Some Middle Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        'Name<some.name.midd.leNa.me+extension@GoogleMail.com>',
      ],
      invalid: [
        'some.name.midd.leNa.me+extension@GoogleMail.com',
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans.m端ller@test.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test123+ext@gmail.com',
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'foo@bar.co.uk.',
        'Some Name <invalidemail@>',
        'Some Name <invalid.com>',
        'Some Name <@invalid.com>',
        'Some Name <foo@bar.com.>',
        'Some Name <foo@bar.co.uk.>',
        'Some Name foo@bar.co.uk.>',
        'Some Name <foo@bar.co.uk.',
        'Some Name < foo@bar.co.uk >',
        'Name foo@bar.co.uk',
      ],
    });
  });

  it('should validate email addresses with allowed IPs', () => {
    test({
      validator: 'isEmail',
      args: [{ allow_ip_domain: true }],
      valid: [
        'email@[123.123.123.123]',
        'email@255.255.255.255',
      ],
      invalid: [
        'email@0.0.0.256',
        'email@26.0.0.256',
        'email@[266.266.266.266]',
      ],
    });
  });

  it('should not validate email addresses with blacklisted chars in the name', () => {
    test({
      validator: 'isEmail',
      args: [{ blacklisted_chars: 'abc' }],
      valid: [
        'emil@gmail.com',
      ],
      invalid: [
        'email@gmail.com',
      ],
    });
  });


  it('should validate really long emails if ignore_max_length is set', () => {
    test({
      validator: 'isEmail',
      args: [{ ignore_max_length: false }],
      valid: [],
      invalid: [
        'Deleted-user-id-19430-Team-5051deleted-user-id-19430-team-5051XXXXXX@example.com',
      ],
    });

    test({
      validator: 'isEmail',
      args: [{ ignore_max_length: true }],
      valid: [
        'Deleted-user-id-19430-Team-5051deleted-user-id-19430-team-5051XXXXXX@example.com',
      ],
      invalid: [],
    });
  });

  it('should not validate email addresses with denylisted domains', () => {
    test({
      validator: 'isEmail',
      args: [{ host_blacklist: ['gmail.com', 'foo.bar.com'] }],
      valid: [
        'email@foo.gmail.com',
      ],
      invalid: [
        'foo+bar@gmail.com',
        'email@foo.bar.com',
      ],
    });
  });
});
