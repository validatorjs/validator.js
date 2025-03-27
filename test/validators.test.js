import assert from 'assert';
import fs from 'fs';
import timezone_mock from 'timezone-mock';
import vm from 'vm';
import test from './testFunctions';

let validator_js = fs.readFileSync(require.resolve('../validator.js')).toString();

describe('Validators', () => {
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
        `${'a'.repeat(64)}@${'a'.repeat(63)}.com`,
        `${'a'.repeat(64)}@${'a'.repeat(63)}.com`,
        `${'a'.repeat(31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
        'test@1337.com',
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'foo@_bar.com',
        'somename@ｇｍａｉｌ.com',
        'foo@bar.co.uk.',
        'z@co.c',
        'ｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌ@gmail.com',
        `${'a'.repeat(64)}@${'a'.repeat(251)}.com`,
        `${'a'.repeat(65)}@${'a'.repeat(250)}.com`,
        `${'a'.repeat(64)}@${'a'.repeat(64)}.com`,
        `${'a'.repeat(64)}@${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(58)}.com`,
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
        'nbsp test@test.com',
        'nbsp_test@te st.com',
        'nbsp_test@test.co m',
        '"foobar@gmail.com',
        '"foo"bar@gmail.com',
        'foo"bar"@gmail.com',
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
        `${'a'.repeat(30)}@gmail.com`,
      ],
      invalid: [
        `${'a'.repeat(31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
        '.foobar@gmail.com',
      ],
    });
  });

  it('should validate email addresses with underscores in the domain', () => {
    test({
      validator: 'isEmail',
      args: [{ allow_underscores: true }],
      valid: [
        'foobar@my_sarisari_store.typepad.com',
      ],
      invalid: [],
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
        'nbsp test@test.com',
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
      args: [{ blacklisted_chars: 'abc"' }],
      valid: [
        'emil@gmail.com',
      ],
      invalid: [
        'email@gmail.com',
        '"foobr"@example.com',
        '" foo m端ller "@example.com',
        '"foo\@br"@example.com',
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

    test({
      validator: 'isEmail',
      args: [{ ignore_max_length: true }],
      valid: [
        'Deleted-user-id-19430-Team-5051deleted-user-id-19430-team-5051XXXXXX@Deleted-user-id-19430-Team-5051deleted-user-id-19430-team-5051XXXXXX.com',
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

  it('should allow regular expressions in the host blacklist of isEmail', () => {
    test({
      validator: 'isEmail',
      args: [{
        host_blacklist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'email@foobar.com',
        'email@foo.bar.com',
        'email@qux.com',
      ],
      invalid: [
        'email@bar.com',
        'email@foo.com',
        'email@a.b.c.foo.com',
      ],
    });
  });

  it('should validate only email addresses with whitelisted domains', () => {
    test({
      validator: 'isEmail',
      args: [{ host_whitelist: ['gmail.com', 'foo.bar.com'] }],
      valid: [
        'email@gmail.com',
        'test@foo.bar.com',
      ],
      invalid: [
        'foo+bar@test.com',
        'email@foo.com',
        'email@bar.com',
      ],
    });
  });

  it('should allow regular expressions in the host whitelist of isEmail', () => {
    test({
      validator: 'isEmail',
      args: [{
        host_whitelist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'email@bar.com',
        'email@foo.com',
        'email@a.b.c.foo.com',
      ],
      invalid: [
        'email@foobar.com',
        'email@foo.bar.com',
        'email@qux.com',
      ],
    });
  });

  it('should validate URLs', () => {
    test({
      validator: 'isURL',
      valid: [
        'foobar.com',
        'www.foobar.com',
        'foobar.com/',
        'valid.au',
        'http://www.foobar.com/',
        'HTTP://WWW.FOOBAR.COM/',
        'https://www.foobar.com/',
        'HTTPS://WWW.FOOBAR.COM/',
        'http://www.foobar.com:23/',
        'http://www.foobar.com:65535/',
        'http://www.foobar.com:5/',
        'https://www.foobar.com/',
        'ftp://www.foobar.com/',
        'http://www.foobar.com/~foobar',
        'http://user:pass@www.foobar.com/',
        'http://user:@www.foobar.com/',
        'http://:pass@www.foobar.com/',
        'http://user@www.foobar.com',
        'http://127.0.0.1/',
        'http://10.0.0.0/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
        'http://foobar.com/t$-_.+!*\'(),',
        'http://foobar.com/?foo=bar#baz=qux',
        'http://foobar.com?foo=bar',
        'http://foobar.com#baz=qux',
        'http://www.xn--froschgrn-x9a.net/',
        'http://xn--froschgrn-x9a.com/',
        'http://foo--bar.com',
        'http://høyfjellet.no',
        'http://xn--j1aac5a4g.xn--j1amh',
        'http://xn------eddceddeftq7bvv7c4ke4c.xn--p1ai',
        'http://кулік.укр',
        'test.com?ref=http://test2.com',
        'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html',
        'http://[1080:0:0:0:8:800:200C:417A]/index.html',
        'http://[3ffe:2a00:100:7031::1]',
        'http://[1080::8:800:200C:417A]/foo',
        'http://[::192.9.5.5]/ipng',
        'http://[::FFFF:129.144.52.38]:80/index.html',
        'http://[2010:836B:4179::836B:4179]',
        'http://example.com/example.json#/foo/bar',
        'http://1337.com',
      ],
      invalid: [
        'http://localhost:3000/',
        '//foobar.com',
        'xyz://foobar.com',
        'invalid/',
        'invalid.x',
        'invalid.',
        '.com',
        'http://com/',
        'http://300.0.0.1/',
        'mailto:foo@bar.com',
        'rtmp://foobar.com',
        'http://www.xn--.com/',
        'http://xn--.com/',
        'http://www.foobar.com:0/',
        'http://www.foobar.com:70000/',
        'http://www.foobar.com:99999/',
        'http://www.-foobar.com/',
        'http://www.foobar-.com/',
        'http://foobar/# lol',
        'http://foobar/? lol',
        'http://foobar/ lol/',
        'http://lol @foobar.com/',
        'http://lol:lol @foobar.com/',
        'http://lol:lol:lol@foobar.com/',
        'http://lol: @foobar.com/',
        'http://www.foo_bar.com/',
        'http://www.foobar.com/\t',
        'http://@foobar.com',
        'http://:@foobar.com',
        'http://\n@www.foobar.com/',
        '',
        `http://foobar.com/${new Array(2083).join('f')}`,
        'http://*.foo.com',
        '*.foo.com',
        '!.foo.com',
        'http://example.com.',
        'http://localhost:61500this is an invalid url!!!!',
        '////foobar.com',
        'http:////foobar.com',
        'https://example.com/foo/<script>alert(\'XSS\')</script>/',
      ],
    });
  });

  it('should validate URLs with custom protocols', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['rtmp'],
      }],
      valid: [
        'rtmp://foobar.com',
      ],
      invalid: [
        'http://foobar.com',
      ],
    });
  });

  it('should validate file URLs without a host', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['file'],
        require_host: false,
        require_tld: false,
      }],
      valid: [
        'file://localhost/foo.txt',
        'file:///foo.txt',
        'file:///',
      ],
      invalid: [
        'http://foobar.com',
        'file://',
      ],
    });
  });

  it('should validate postgres URLs without a host', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['postgres'],
        require_host: false,
      }],
      valid: [
        'postgres://user:pw@/test',
      ],
      invalid: [
        'http://foobar.com',
        'postgres://',
      ],
    });
  });


  it('should validate URLs with any protocol', () => {
    test({
      validator: 'isURL',
      args: [{
        require_valid_protocol: false,
      }],
      valid: [
        'rtmp://foobar.com',
        'http://foobar.com',
        'test://foobar.com',
      ],
      invalid: [
        'mailto:test@example.com',
      ],
    });
  });

  it('should validate URLs with underscores', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_underscores: true,
      }],
      valid: [
        'http://foo_bar.com',
        'http://pr.example_com.294.example.com/',
        'http://foo__bar.com',
        'http://_.example.com',
      ],
      invalid: [],
    });
  });

  it('should validate URLs that do not have a TLD', () => {
    test({
      validator: 'isURL',
      args: [{
        require_tld: false,
      }],
      valid: [
        'http://foobar.com/',
        'http://foobar/',
        'http://localhost/',
        'foobar/',
        'foobar',
      ],
      invalid: [],
    });
  });

  it('should validate URLs with a trailing dot option', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_trailing_dot: true,
        require_tld: false,
      }],
      valid: [
        'http://example.com.',
        'foobar.',
      ],
    });
  });

  it('should validate URLs with column and no port', () => {
    test({
      validator: 'isURL',
      valid: [
        'http://example.com:',
        'ftp://example.com:',
      ],
      invalid: [
        'https://example.com:abc',
      ],
    });
  });

  it('should validate sftp protocol URL containing column and no port', () => {
    test({
      validator: 'isURL',
      args: [{
        protocols: ['sftp'],
      }],
      valid: [
        'sftp://user:pass@terminal.aws.test.nl:/incoming/things.csv',
      ],
    });
  });

  it('should validate protocol relative URLs', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_protocol_relative_urls: true,
      }],
      valid: [
        '//foobar.com',
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        '://foobar.com',
        '/foobar.com',
        '////foobar.com',
        'http:////foobar.com',
      ],
    });
  });

  it('should not validate URLs with fragments when allow fragments is false', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_fragments: false,
      }],
      valid: [
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        'http://foobar.com#part',
        'foobar.com#part',
      ],
    });
  });

  it('should not validate URLs with query components when allow query components is false', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_query_components: false,
      }],
      valid: [
        'http://foobar.com',
        'foobar.com',
      ],
      invalid: [
        'http://foobar.com?foo=bar',
        'http://foobar.com?foo=bar&bar=foo',
        'foobar.com?foo=bar',
        'foobar.com?foo=bar&bar=foo',
      ],
    });
  });

  it('should not validate protocol relative URLs when require protocol is true', () => {
    test({
      validator: 'isURL',
      args: [{
        allow_protocol_relative_urls: true,
        require_protocol: true,
      }],
      valid: [
        'http://foobar.com',
      ],
      invalid: [
        '//foobar.com',
        '://foobar.com',
        '/foobar.com',
        'foobar.com',
      ],
    });
  });

  it('should let users specify whether URLs require a protocol', () => {
    test({
      validator: 'isURL',
      args: [{
        require_protocol: true,
      }],
      valid: [
        'http://foobar.com/',
      ],
      invalid: [
        'http://localhost/',
        'foobar.com',
        'foobar',
      ],
    });
  });

  it('should let users specify a host whitelist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_whitelist: ['foo.com', 'bar.com'],
      }],
      valid: [
        'http://bar.com/',
        'http://foo.com/',
      ],
      invalid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
    });
  });

  it('should allow regular expressions in the host whitelist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_whitelist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'http://bar.com/',
        'http://foo.com/',
        'http://images.foo.com/',
        'http://cdn.foo.com/',
        'http://a.b.c.foo.com/',
      ],
      invalid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
    });
  });

  it('should let users specify a host blacklist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_blacklist: ['foo.com', 'bar.com'],
      }],
      valid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
      invalid: [
        'http://bar.com/',
        'http://foo.com/',
      ],
    });
  });

  it('should allow regular expressions in the host blacklist', () => {
    test({
      validator: 'isURL',
      args: [{
        host_blacklist: ['bar.com', 'foo.com', /\.foo\.com$/],
      }],
      valid: [
        'http://foobar.com',
        'http://foo.bar.com/',
        'http://qux.com',
      ],
      invalid: [
        'http://bar.com/',
        'http://foo.com/',
        'http://images.foo.com/',
        'http://cdn.foo.com/',
        'http://a.b.c.foo.com/',
      ],
    });
  });

  it('should allow rejecting urls containing authentication information', () => {
    test({
      validator: 'isURL',
      args: [{ disallow_auth: true }],
      valid: [
        'doe.com',
      ],
      invalid: [
        'john@doe.com',
        'john:john@doe.com',
      ],
    });
  });

  it('should accept urls containing authentication information', () => {
    test({
      validator: 'isURL',
      args: [{ disallow_auth: false }],
      valid: [
        'user@example.com',
        'user:@example.com',
        'user:password@example.com',
      ],
      invalid: [
        'user:user:password@example.com',
        '@example.com',
        ':@example.com',
        ':example.com',
      ],
    });
  });

  it('should allow user to skip URL length validation', () => {
    test({
      validator: 'isURL',
      args: [{ validate_length: false }],
      valid: [
        'http://foobar.com/f',
        `http://foobar.com/${new Array(2083).join('f')}`,
      ],
      invalid: [],
    });
  });

  it('should allow user to configure the maximum URL length', () => {
    test({
      validator: 'isURL',
      args: [{ max_allowed_length: 20 }],
      valid: [
        'http://foobar.com/12', // 20 characters
        'http://foobar.com/',
      ],
      invalid: [
        'http://foobar.com/123', // 21 characters
        'http://foobar.com/1234567890',
      ],
    });
  });

  it('should validate URLs with port present', () => {
    test({
      validator: 'isURL',
      args: [{ require_port: true }],
      valid: [
        'http://user:pass@www.foobar.com:1',
        'http://user:@www.foobar.com:65535',
        'http://127.0.0.1:23',
        'http://10.0.0.0:256',
        'http://189.123.14.13:256',
        'http://duckduckgo.com:65535?q=%2F',
      ],
      invalid: [
        'http://user:pass@www.foobar.com/',
        'http://user:@www.foobar.com/',
        'http://127.0.0.1/',
        'http://10.0.0.0/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
      ],
    });
  });

  it('should validate MAC addresses', () => {
    test({
      validator: 'isMACAddress',
      valid: [
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
        'A9 C5 D4 9F EB D3',
        '01 02 03 04 05 ab',
        '01-02-03-04-05-ab',
        '0102.0304.05ab',
        'ab:ab:ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:06:07:ab',
        '01:AB:03:04:05:06:07:08',
        'A9 C5 D4 9F EB D3 B6 65',
        '01 02 03 04 05 06 07 ab',
        '01-02-03-04-05-06-07-ab',
        '0102.0304.0506.07ab',
      ],
      invalid: [
        'abc',
        '01:02:03:04:05',
        '01:02:03:04:05:z0',
        '01:02:03:04::ab',
        '1:2:3:4:5:6',
        'AB:CD:EF:GH:01:02',
        'A9C5 D4 9F EB D3',
        '01-02 03:04 05 ab',
        '0102.03:04.05ab',
        '900f/dffs/sdea',
        '01:02:03:04:05:06:07',
        '01:02:03:04:05:06:07:z0',
        '01:02:03:04:05:06::ab',
        '1:2:3:4:5:6:7:8',
        'AB:CD:EF:GH:01:02:03:04',
        'A9C5 D4 9F EB D3 B6 65',
        '01-02 03:04 05 06 07 ab',
        '0102.03:04.0506.07ab',
        '900f/dffs/sdea/54gh',
      ],
    });
    test({
      validator: 'isMACAddress',
      args: [{
        eui: '48',
      }],
      valid: [
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
        'A9 C5 D4 9F EB D3',
        '01 02 03 04 05 ab',
        '01-02-03-04-05-ab',
        '0102.0304.05ab',
      ],
      invalid: [
        'ab:ab:ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:06:07:ab',
        '01:AB:03:04:05:06:07:08',
        'A9 C5 D4 9F EB D3 B6 65',
        '01 02 03 04 05 06 07 ab',
        '01-02-03-04-05-06-07-ab',
        '0102.0304.0506.07ab',
      ],
    });
    test({
      validator: 'isMACAddress',
      args: [{
        eui: '64',
      }],
      valid: [
        'ab:ab:ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:06:07:ab',
        '01:AB:03:04:05:06:07:08',
        'A9 C5 D4 9F EB D3 B6 65',
        '01 02 03 04 05 06 07 ab',
        '01-02-03-04-05-06-07-ab',
        '0102.0304.0506.07ab',
      ],
      invalid: [
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
        'A9 C5 D4 9F EB D3',
        '01 02 03 04 05 ab',
        '01-02-03-04-05-ab',
        '0102.0304.05ab',
      ],
    });
  });

  it('should validate MAC addresses without separator', () => {
    test({
      validator: 'isMACAddress',
      args: [{
        no_separators: true,
      }],
      valid: [
        'abababababab',
        'FFFFFFFFFFFF',
        '0102030405ab',
        '01AB03040506',
        'abababababababab',
        'FFFFFFFFFFFFFFFF',
        '01020304050607ab',
        '01AB030405060708',
      ],
      invalid: [
        'abc',
        '01:02:03:04:05',
        '01:02:03:04::ab',
        '1:2:3:4:5:6',
        'AB:CD:EF:GH:01:02',
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
        '0102030405',
        '01020304ab',
        '123456',
        'ABCDEFGH0102',
        '01:02:03:04:05:06:07',
        '01:02:03:04:05:06::ab',
        '1:2:3:4:5:6:7:8',
        'AB:CD:EF:GH:01:02:03:04',
        'ab:ab:ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:06:07:ab',
        '01:AB:03:04:05:06:07:08',
        '01020304050607',
        '010203040506ab',
        '12345678',
        'ABCDEFGH01020304',
      ],
    });
    test({
      validator: 'isMACAddress',
      args: [{
        no_separators: true,
        eui: '48',
      }],
      valid: [
        'abababababab',
        'FFFFFFFFFFFF',
        '0102030405ab',
        '01AB03040506',
      ],
      invalid: [
        'abababababababab',
        'FFFFFFFFFFFFFFFF',
        '01020304050607ab',
        '01AB030405060708',
      ],
    });
    test({
      validator: 'isMACAddress',
      args: [{
        no_separators: true,
        eui: '64',
      }],
      valid: [
        'abababababababab',
        'FFFFFFFFFFFFFFFF',
        '01020304050607ab',
        '01AB030405060708',
      ],
      invalid: [
        'abababababab',
        'FFFFFFFFFFFF',
        '0102030405ab',
        '01AB03040506',
      ],
    });
  });

  it('should validate isIPRange', () => {
    test({
      validator: 'isIPRange',
      valid: [
        '127.0.0.1/24',
        '0.0.0.0/0',
        '255.255.255.0/32',
        '::/0',
        '::/128',
        '2001::/128',
        '2001:800::/128',
        '::ffff:127.0.0.1/128',
      ],
      invalid: [
        'abc',
        '127.200.230.1/35',
        '127.200.230.1/-1',
        '1.1.1.1/011',
        '1.1.1/24.1',
        '1.1.1.1/01',
        '1.1.1.1/1.1',
        '1.1.1.1/1.',
        '1.1.1.1/1/1',
        '1.1.1.1',
        '::1',
        '::1/164',
        '2001::/240',
        '2001::/-1',
        '2001::/001',
        '2001::/24.1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1',
      ],
    });
    test({
      validator: 'isIPRange',
      args: [4],
      valid: [
        '127.0.0.1/1',
        '0.0.0.0/1',
        '255.255.255.255/1',
        '1.2.3.4/1',
        '255.0.0.1/1',
        '0.0.1.1/1',
      ],
      invalid: [
        'abc',
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1',
        '137.132.10.01',
        '0.256.0.256',
        '255.256.255.256',
      ],
    });
    test({
      validator: 'isIPRange',
      args: [6],
      valid: [
        '::1/1',
        '2001:db8:0000:1:1:1:1:1/1',
        '::ffff:127.0.0.1/1',
      ],
      invalid: [
        'abc',
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::ffff:287.0.0.1',
        '::ffff:287.0.0.1/254',
        '%',
        'fe80::1234%',
        'fe80::1234%1%3%4',
        'fe80%fe80%',
      ],
    });
    test({
      validator: 'isIPRange',
      args: [10],
      valid: [],
      invalid: [
        'abc',
        '127.0.0.1/1',
        '0.0.0.0/1',
        '255.255.255.255/1',
        '1.2.3.4/1',
        '::1/1',
        '2001:db8:0000:1:1:1:1:1/1',
      ],
    });
  });

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

  it('should validate Bengali alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['bn-BD'],
      valid: [
        'অয়াওর',
        'ফগফদ্রত',
        'ফদ্ম্যতভ',
        'বেরেওভচনভন',
        'আমারবাসগা',
      ],
      invalid: [
        'দাস২৩৪',
        '  দ্গফহ্নভ  ',
        '',
        '(গফদ)',
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

  it('should validate Japanese alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['ja-JP'],
      valid: [
        'あいうえお',
        'がぎぐげご',
        'ぁぃぅぇぉ',
        'アイウエオ',
        'ァィゥェ',
        'ｱｲｳｴｵ',
        '吾輩は猫である',
        '臥薪嘗胆',
        '新世紀エヴァンゲリオン',
        '天国と地獄',
        '七人の侍',
        'シン・ウルトラマン',
      ],
      invalid: [
        'あいう123',
        'abcあいう',
        '１９８４',
      ],
    });
  });

  it('should validate kazakh alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['kk-KZ'],
      valid: [
        'Сәлем',
        'қанағаттандырылмағандықтарыңыздан',
        'Кешіріңіз',
        'Өкінішке',
        'Қайталаңызшы',
        'ағылшынша',
        'түсінбедім',
      ],
      invalid: [
        'Кешіріңіз1',
        '  Кет бар  ',
        'مرحبا العا',
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

  it('should validate Korea alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['ko-KR'],
      valid: [
        'ㄱ',
        'ㅑ',
        'ㄱㄴㄷㅏㅕ',
        '세종대왕',
        '나랏말싸미듕귁에달아문자와로서르사맛디아니할쎄',
      ],
      invalid: [
        'abc',
        '123',
        '흥선대원군 문호개방',
        '1592년임진왜란',
        '대한민국!',
      ],
    });
  });

  it('should validate Sinhala alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['si-LK'],
      valid: [
        'චතුර',
        'කචටදබ',
        'ඎඏදාෛපසුගො',
      ],
      invalid: [
        'ஆஐअतක',
        'කචට 12',
        ' ඎ ',
        'abc1',
        'abc',
        '',
      ],
    });
  });

  it('should validate Esperanto alpha strings', () => {
    test({
      validator: 'isAlpha',
      args: ['eo'],
      valid: [
        'saluton',
        'eĥoŝanĝoĉiuĵaŭde',
        'EĤOŜANĜOĈIUĴAŬDE',
        'Esperanto',
        'LaŭLudovikoZamenhofBongustasFreŝaĈeĥaManĝaĵoKunSpicoj',
      ],
      invalid: [
        'qwxyz',
        '1887',
        'qwxyz 1887',
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
      args: ['en-US', { ignore: '@_- ' }], // ignore [@ space _ -]
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
      args: ['en-US', { ignore: /[\s/-]/g }], // ignore [space -]
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
      args: ['en-US', { ignore: 1234 }], // invalid ignore matcher (ignore should be instance of a String or RegExp)
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
      args: ['az-AZ'],
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
      args: ['bg-BG'],
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
      args: ['bn-BD'],
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
      args: ['cs-CZ'],
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
      args: ['sk-SK'],
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
      args: ['da-DK'],
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
      args: ['nl-NL'],
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
      args: ['fi-FI'],
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
      args: ['de-DE'],
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
      args: ['hu-HU'],
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
      args: ['pt-PT'],
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
      args: ['it-IT'],
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
      args: ['es-ES'],
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
      args: ['vi-VN'],
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
      args: ['ar'],
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
      args: ['hi-IN'],
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
      args: ['fa-IR'],
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
      args: ['ja-JP'],
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

  it('should validate kazakh alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: ['kk-KZ'],
      valid: [
        'Сәлем777',
        '123Бәсе',
        'солай',
        'Жиенсу',
        '90тоқсан',
        'жалғыз',
        '570бердім',
      ],
      invalid: [
        ' кешіріңіз ',
        'abcағылшынша',
        'мүмкін!!',
      ],
    });
  });

  it('should validate kurdish alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: ['ku-IQ'],
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
      args: ['ar-SY'],
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
      args: ['nb-NO'],
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
      args: ['pl-PL'],
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
      args: ['sr-RS'],
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
      args: ['sr-RS@latin'],
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
      args: ['sv-SE'],
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
      args: ['tr-TR'],
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
      args: ['uk-UA'],
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
      args: ['el-GR'],
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
      args: ['he'],
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
      args: ['th-TH'],
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
      args: ['ko-KR'],
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
      args: ['si-LK'],
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

  it('should validate Esperanto alphanumeric strings', () => {
    test({
      validator: 'isAlphanumeric',
      args: ['eo'],
      valid: [
        'saluton',
        'eĥoŝanĝoĉiuĵaŭde0123456789',
        'EĤOŜANĜOĈIUĴAŬDE0123456789',
        'Esperanto1887',
        'LaŭLudovikoZamenhofBongustasFreŝaĈeĥaManĝaĵoKunSpicoj',
      ],
      invalid: [
        'qwxyz',
        'qwxyz 1887',
      ],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isAlphanumeric',
      args: ['is-NOT'],
      error: [
        '1234568960',
        'abc123',
      ],
    });
  });

  it('should validate numeric strings', () => {
    test({
      validator: 'isNumeric',
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '123.123',
        '+000000',
      ],
      invalid: [
        ' ',
        '',
        '.',
      ],
    });
  });

  it('should validate numeric strings without symbols', () => {
    test({
      validator: 'isNumeric',
      args: [{
        no_symbols: true,
      }],
      valid: [
        '123',
        '00123',
        '0',
      ],
      invalid: [
        '-0',
        '+000000',
        '',
        '+123',
        '123.123',
        '-00123',
        ' ',
        '.',
      ],
    });
  });

  it('should validate numeric strings with locale', () => {
    test({
      validator: 'isNumeric',
      args: [{
        locale: 'fr-FR',
      }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '123,123',
        '+000000',
      ],
      invalid: [
        ' ',
        '',
        ',',
      ],
    });
  });

  it('should validate numeric strings with locale', () => {
    test({
      validator: 'isNumeric',
      args: [{
        locale: 'fr-CA',
      }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '123,123',
        '+000000',
      ],
      invalid: [
        ' ',
        '',
        '.',
      ],
    });
  });

  it('should validate ports', () => {
    test({
      validator: 'isPort',
      valid: [
        '0',
        '22',
        '80',
        '443',
        '3000',
        '8080',
        '65535',
      ],
      invalid: [
        '',
        '-1',
        '65536',
        '0080',
      ],
    });
  });

  it('should validate passport number', () => {
    test({
      validator: 'isPassportNumber',
      args: ['AM'],
      valid: [
        'AF0549358',
      ],
      invalid: [
        'A1054935',
      ],
    });


    test({
      validator: 'isPassportNumber',
      args: ['ID'],
      valid: [
        'C1253473',
        'B5948378',
        'A4859472',
      ],
      invalid: [
        'D39481728',
        'A-3847362',
        '324132132',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['AR'],
      valid: [
        'AAC811035',
      ],
      invalid: [
        'A11811035',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['AT'],
      valid: [
        'P 1630837',
        'P 4366918',
      ],
      invalid: [
        '0 1630837',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['AU'],
      valid: [
        'N0995852',
        'L4819236',
      ],
      invalid: [
        '1A012345',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['AZ'],
      valid: [
        'A16175905',
        'A16175958',
      ],
      invalid: [
        'AZ1234584',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['BE'],
      valid: [
        'EM000000',
        'LA080402',
      ],
      invalid: [
        '00123456',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['BG'],
      valid: [
        '346395366',
        '039903356',
      ],
      invalid: [
        'ABC123456',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['BR'],
      valid: [
        'FZ973689',
        'GH231233',
      ],
      invalid: [
        'ABX29332',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['BY'],
      valid: [
        'MP3899901',
      ],
      invalid: [
        '345333454',
        'FG53334542',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['CA'],
      valid: [
        'GA302922',
        'ZE000509',
        'A123456AB',
        'Z556378HG',
      ],
      invalid: [
        'AB0123456',
        'AZ556378H',
        '556378HCX',
        '556378432',
        '5563784',
        '#B12345FD',
        'A43F12354',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['CH'],
      valid: [
        'S1100409',
        'S5200073',
        'X4028791',
      ],
      invalid: [
        'AB123456',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['CN'],
      valid: [
        'G25352389',
        'E00160027',
        'EA1234567',
      ],
      invalid: [
        'K0123456',
        'E-1234567',
        'G.1234567',
        'GA1234567',
        'EI1234567',
        'GO1234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['CY'],
      valid: [
        'K00000413',
      ],
      invalid: [
        'K10100',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['CZ'],
      valid: [
        '99003853',
        '42747260',
      ],
      invalid: [
        '012345678',
        'AB123456',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['DE'],
      valid: [
        'C01X00T47',
        'C26VMVVC3',
      ],
      invalid: [
        'AS0123456',
        'A012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['DK'],
      valid: [
        '900010172',
      ],
      invalid: [
        '01234567',
        'K01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['DZ'],
      valid: [
        '855609385',
        '154472412',
        '197025599',
      ],
      invalid: [
        'AS0123456',
        'A012345678',
        '0123456789',
        '12345678',
        '98KK54321',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['EE'],
      valid: [
        'K4218285',
        'K3295867',
        'KB0167630',
        'VD0023777',
      ],
      invalid: [
        'K01234567',
        'KB00112233',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['ES'],
      valid: [
        'AF238143',
        'ZAB000254',
      ],
      invalid: [
        'AF01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['FI'],
      valid: [
        'XP8271602',
        'XD8500003',
      ],
      invalid: [
        'A01234567',
        'ABC012345',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['FR'],
      valid: [
        '10CV28144',
        '60RF19342',
        '05RP34083',
      ],
      invalid: [
        '012345678',
        'AB0123456',
        '01C234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['GB'],
      valid: [
        '925076473',
        '107182890',
        '104121156',
      ],
      invalid: [
        'A012345678',
        'K000000000',
        '0123456789',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['GR'],
      valid: [
        'AE0000005',
        'AK0219304',
      ],
      invalid: [
        'A01234567',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['HR'],
      valid: [
        '007007007',
        '138463188',
      ],
      invalid: [
        'A01234567',
        '00112233',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['HU'],
      valid: [
        'ZA084505',
        'BA0006902',
      ],
      invalid: [
        'A01234567',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['IE'],
      valid: [
        'D23145890',
        'X65097105',
        'XN0019390',
      ],
      invalid: [
        'XND012345',
        '0123456789',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['IN'],
      valid: [
        'A-1234567',
        'A1234567',
        'X0019390',
      ],
      invalid: [
        'AB-1234567',
        '0123456789',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['IR'],
      valid: [
        'J97634522',
        'A01234567',
        'Z11977831',
      ],
      invalid: [
        'A0123456',
        'A0123456Z',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['IS'],
      valid: [
        'A2040611',
        'A1197783',
      ],
      invalid: [
        'K0000000',
        '01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['IT'],
      valid: [
        'YA8335453',
        'KK0000000',
      ],
      invalid: [
        '01234567',
        'KAK001122',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['JM'],
      valid: [
        'A0123456',
      ],
      invalid: [
        's0123456',
        'a01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['JP'],
      valid: [
        'NH1106002',
        'TE3180251',
        'XS1234567',
      ],
      invalid: [
        'X12345678',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['KR'],
      valid: [
        'M35772699',
        'M70689098',
      ],
      invalid: [
        'X12345678',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['KZ'],
      valid: [
        'A0123456',
        'b0123456',
      ],
      invalid: [
        '01234567',
        'bb0123456',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['LI'],
      valid: [
        'a01234',
        'f01234',
      ],
      invalid: [
        '012345',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['LT'],
      valid: [
        '20200997',
        'LB311756',
      ],
      invalid: [
        'LB01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['LU'],
      valid: [
        'JCU9J4T2',
        'JC4E7L2H',
      ],
      invalid: [
        'JCU9J4T',
        'JC4E7L2H0',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['LV'],
      valid: [
        'LV9000339',
        'LV4017173',
      ],
      invalid: [
        'LV01234567',
        '4017173LV',
      ],
    });
    test({
      validator: 'isPassportNumber',
      args: ['LY'],
      valid: [
        'P79JF34X',
        'RJ45H4V2',
      ],
      invalid: [
        'P79JF34',
        'RJ45H4V2C',
        'RJ4-H4V2',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['MT'],
      valid: [
        '1026564',
      ],
      invalid: [
        '01234567',
        'MT01234',
      ],
    });
    test({
      validator: 'isPassportNumber',
      args: ['MZ'],
      valid: [
        'AB0808212',
        '08AB12123',
      ],
      invalid: [
        '1AB011241',
        '1AB01121',
        'ABAB01121',
      ],
    });
    test({
      validator: 'isPassportNumber',
      args: ['MY'],
      valid: [
        'A00000000',
        'H12345678',
        'K43143233',
      ],
      invalid: [
        'A1234567',
        'C01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['MX'],
      valid: [
        '43986369222',
        '01234567890',
      ],
      invalid: [
        'ABC34567890',
        '34567890',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['NL'],
      valid: [
        'XTR110131',
        'XR1001R58',
      ],
      invalid: [
        'XTR11013R',
        'XR1001R58A',
      ],
    });
    test({
      validator: 'isPassportNumber',
      args: ['PK'],
      valid: [
        'QZ1791293',
        'XR1001458',
      ],
      invalid: [
        'XTR11013R',
        'XR1001R58A',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['PH'],
      valid: [
        'X123456',
        'XY123456',
        'XY1234567',
        'X1234567Y',
      ],
      invalid: [
        'XY12345',
        'X12345Z',
        'XY12345Z',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['NZ'],
      valid: [
        'Lf012345',
        'La012345',
        'Ld012345',
        'Lh012345',
        'ea012345',
        'ep012345',
        'n012345',
      ],
      invalid: [
        'Lp012345',
        'nd012345',
        'ed012345',
        'eh012345',
        'ef012345',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['PL'],
      valid: [
        'ZS 0000177',
        'AN 3000011',
      ],
      invalid: [
        'A1 0000177',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['PT'],
      valid: [
        'I700044',
        'K453286',
      ],
      invalid: [
        '0700044',
        'K4532861',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['RO'],
      valid: [
        '05485968',
        '040005646',
      ],
      invalid: [
        'R05485968',
        '0511060461',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['RU'],
      valid: [
        '2 32 636829',
        '012 345321',
        '439863692',
      ],
      invalid: [
        'A 2R YU46J0',
        '01A 3D5321',
        'SF233D53T',
        '12345678',
        '1234567890',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['SE'],
      valid: [
        '59000001',
        '56702928',
      ],
      invalid: [
        'SE012345',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['SL'],
      valid: [
        'PB0036440',
        'PB1390281',
      ],
      invalid: [
        'SL0123456',
        'P01234567',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['SK'],
      valid: [
        'P0000000',
      ],
      invalid: [
        'SK012345',
        '012345678',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['TH'],
      valid: [
        'A123456',
        'B1234567',
        'CD123456',
        'EF1234567',
      ],
      invalid: [
        '123456',
        '1234567',
        '010485371AA',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['TR'],
      valid: [
        'U 06764100',
        'U 01048537',
      ],
      invalid: [
        '06764100U',
        '010485371',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['UA'],
      valid: [
        'EH345655',
        'EK000001',
        'AP841503',
      ],
      invalid: [
        '01234567',
        '012345EH',
        'A012345P',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['US'],
      valid: [
        '790369937',
        '340007237',
      ],
      invalid: [
        'US0123456',
        '0123456US',
        '7903699371',
      ],
    });

    test({
      validator: 'isPassportNumber',
      args: ['ZA'],
      valid: [
        'T12345678',
        'A12345678',
        'M12345678',
        'D12345678',
      ],
      invalid: [
        '123456789',
        'Z12345678',
      ],
    });
  });

  it('should validate decimal numbers', () => {
    test({
      validator: 'isDecimal',
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '-0',
        '0.0000000000001',
      ],
      invalid: [
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '0,0000000000001',
        '0٫01',
        '٫1',
        '1٫0',
        '-٫25',
        '0٫0000000000001',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: 'en-AU' }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '-0',
        '0.0000000000001',
      ],
      invalid: [
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '0,0000000000001',
        '0٫01',
        '٫1',
        '1٫0',
        '-٫25',
        '0٫0000000000001',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: ['bg-BG'] }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '-0',
        '0,0000000000001',
      ],
      invalid: [
        '0.0000000000001',
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '0٫01',
        '٫1',
        '1٫0',
        '-٫25',
        '0٫0000000000001',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: ['cs-CZ'] }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '-0',
        '0,0000000000001',
      ],
      invalid: [
        '0.0000000000001',
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '0٫01',
        '٫1',
        '1٫0',
        '-٫25',
        '0٫0000000000001',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: ['ar-JO'] }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0٫01',
        '٫1',
        '1٫0',
        '-٫25',
        '-0',
        '0٫0000000000001',
      ],
      invalid: [
        '0,0000000000001',
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '0.0000000000001',
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: ['ar-EG'] }],
      valid: [
        '0.01',
      ],
      invalid: [
        '0,01',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ locale: ['en-ZM'] }],
      valid: [
        '0,01',
      ],
      invalid: [
        '0.01',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ force_decimal: true }],
      valid: [
        '0.01',
        '.1',
        '1.0',
        '-.25',
        '0.0000000000001',
      ],
      invalid: [
        '-0',
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0,0000000000001',
        '0,01',
        ',1',
        '1,0',
        '-,25',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });

    test({
      validator: 'isDecimal',
      args: [{ decimal_digits: '2,3' }],
      valid: [
        '123',
        '00123',
        '-00123',
        '0',
        '-0',
        '+123',
        '0.01',
        '1.043',
        '.15',
        '-.255',
        '-0',
      ],
      invalid: [
        '0.0000000000001',
        '0.0',
        '.1',
        '1.0',
        '-.2564',
        '0.0',
        '٫1',
        '1٫0',
        '-٫25',
        '0٫0000000000001',
        '....',
        ' ',
        '',
        '-',
        '+',
        '.',
        '0.1a',
        'a',
        '\n',
      ],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isDecimal',
      args: [{ locale: ['is-NOT'] }],
      error: [
        '123',
        '0.01',
        '0,01',
      ],
    });
  });

  it('should validate lowercase strings', () => {
    test({
      validator: 'isLowercase',
      valid: [
        'abc',
        'abc123',
        'this is lowercase.',
        'tr竪s 端ber',
      ],
      invalid: [
        'fooBar',
        '123A',
      ],
    });
  });


  it('should validate imei strings', () => {
    test({
      validator: 'isIMEI',
      valid: [
        '352099001761481',
        '868932036356090',
        '490154203237518',
        '546918475942169',
        '998227667144730',
        '532729766805999',
      ],
      invalid: [
        '490154203237517',
        '3568680000414120',
        '3520990017614823',
      ],
    });
  });


  it('should validate imei strings with hyphens', () => {
    test({
      validator: 'isIMEI',
      args: [{ allow_hyphens: true }],
      valid: [
        '35-209900-176148-1',
        '86-893203-635609-0',
        '49-015420-323751-8',
        '54-691847-594216-9',
        '99-822766-714473-0',
        '53-272976-680599-9',
      ],
      invalid: [
        '49-015420-323751-7',
        '35-686800-0041412-0',
        '35-209900-1761482-3',
      ],
    });
  });


  it('should validate uppercase strings', () => {
    test({
      validator: 'isUppercase',
      valid: [
        'ABC',
        'ABC123',
        'ALL CAPS IS FUN.',
        '   .',
      ],
      invalid: [
        'fooBar',
        '123abc',
      ],
    });
  });

  it('should validate integers', () => {
    test({
      validator: 'isInt',
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
        '01',
        '-01',
        '000',
      ],
      invalid: [
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{ allow_leading_zeroes: false }],
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
      ],
      invalid: [
        '01',
        '-01',
        '000',
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{ allow_leading_zeroes: true }],
      valid: [
        '13',
        '123',
        '0',
        '123',
        '-0',
        '+1',
        '01',
        '-01',
        '000',
        '-000',
        '+000',
      ],
      invalid: [
        '100e10',
        '123.123',
        '   ',
        '',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        min: 10,
      }],
      valid: [
        '15',
        '80',
        '99',
      ],
      invalid: [
        '9',
        '6',
        '3.2',
        'a',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        min: 10,
        max: 15,
      }],
      valid: [
        '15',
        '11',
        '13',
      ],
      invalid: [
        '9',
        '2',
        '17',
        '3.2',
        '33',
        'a',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        gt: 10,
        lt: 15,
      }],
      valid: [
        '14',
        '11',
        '13',
      ],
      invalid: [
        '10',
        '15',
        '17',
        '3.2',
        '33',
        'a',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        min: undefined,
        max: undefined,
      }],
      valid: [
        '143',
        '15',
        '767777575',
      ],
      invalid: [
        '10.4',
        'bar',
        '10a',
        'c44',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        gt: undefined,
        lt: undefined,
      }],
      valid: [
        '289373466',
        '55',
        '989',
      ],
      invalid: [
        '10.4',
        'baz',
        '66a',
        'c21',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        gt: null,
        max: null,
      }],
      valid: [
        '1',
        '886',
        '84512345',
      ],
      invalid: [
        '10.4',
        'h',
        '1.2',
        '+',
      ],
    });
    test({
      validator: 'isInt',
      args: [{
        lt: null,
        min: null,
      }],
      valid: [
        '289373466',
        '55',
        '989',
      ],
      invalid: [
        ',',
        '+11212+',
        'fail',
        '111987234i',
      ],
    });
  });

  it('should validate floats', () => {
    test({
      validator: 'isFloat',
      valid: [
        '123',
        '123.',
        '123.123',
        '-123.123',
        '-0.123',
        '+0.123',
        '0.123',
        '.0',
        '-.123',
        '+.123',
        '01.123',
        '-0.22250738585072011e-307',
      ],
      invalid: [
        '+',
        '-',
        '  ',
        '',
        '.',
        ',',
        'foo',
        '20.foo',
        '2020-01-06T14:31:00.135Z',
      ],
    });

    test({
      validator: 'isFloat',
      args: [{ locale: 'en-AU' }],
      valid: [
        '123',
        '123.',
        '123.123',
        '-123.123',
        '-0.123',
        '+0.123',
        '0.123',
        '.0',
        '-.123',
        '+.123',
        '01.123',
        '-0.22250738585072011e-307',
      ],
      invalid: [
        '123٫123',
        '123,123',
        '  ',
        '',
        '.',
        'foo',
      ],
    });

    test({
      validator: 'isFloat',
      args: [{ locale: 'de-DE' }],
      valid: [
        '123',
        '123,',
        '123,123',
        '-123,123',
        '-0,123',
        '+0,123',
        '0,123',
        ',0',
        '-,123',
        '+,123',
        '01,123',
        '-0,22250738585072011e-307',
      ],
      invalid: [
        '123.123',
        '123٫123',
        '  ',
        '',
        '.',
        'foo',
      ],
    });

    test({
      validator: 'isFloat',
      args: [{ locale: 'ar-JO' }],
      valid: [
        '123',
        '123٫',
        '123٫123',
        '-123٫123',
        '-0٫123',
        '+0٫123',
        '0٫123',
        '٫0',
        '-٫123',
        '+٫123',
        '01٫123',
        '-0٫22250738585072011e-307',
      ],
      invalid: [
        '123,123',
        '123.123',
        '  ',
        '',
        '.',
        'foo',
      ],
    });

    test({
      validator: 'isFloat',
      args: [{
        min: 3.7,
      }],
      valid: [
        '3.888',
        '3.92',
        '4.5',
        '50',
        '3.7',
        '3.71',
      ],
      invalid: [
        '3.6',
        '3.69',
        '3',
        '1.5',
        'a',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        min: 0.1,
        max: 1.0,
      }],
      valid: [
        '0.1',
        '1.0',
        '0.15',
        '0.33',
        '0.57',
        '0.7',
      ],
      invalid: [
        '0',
        '0.0',
        'a',
        '1.3',
        '0.05',
        '5',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        gt: -5.5,
        lt: 10,
      }],
      valid: [
        '9.9',
        '1.0',
        '0',
        '-1',
        '7',
        '-5.4',
      ],
      invalid: [
        '10',
        '-5.5',
        'a',
        '-20.3',
        '20e3',
        '10.00001',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        min: -5.5,
        max: 10,
        gt: -5.5,
        lt: 10,
      }],
      valid: [
        '9.99999',
        '-5.499999',
      ],
      invalid: [
        '10',
        '-5.5',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        locale: 'de-DE',
        min: 3.1,
      }],
      valid: [
        '123',
        '123,',
        '123,123',
        '3,1',
        '3,100001',
      ],
      invalid: [
        '3,09',
        '-,123',
        '+,123',
        '01,123',
        '-0,22250738585072011e-307',
        '-123,123',
        '-0,123',
        '+0,123',
        '0,123',
        ',0',
        '123.123',
        '123٫123',
        '  ',
        '',
        '.',
        'foo',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        min: undefined,
        max: undefined,
      }],
      valid: [
        '123',
        '123.',
        '123.123',
        '-767.767',
        '+111.111',
      ],
      invalid: [
        'ab565',
        '-,123',
        '+,123',
        '7866.t',
        '123,123',
        '123,',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        gt: undefined,
        lt: undefined,
      }],
      valid: [
        '14.34343',
        '11.1',
        '456',
      ],
      invalid: [
        'ab565',
        '-,123',
        '+,123',
        '7866.t',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        locale: 'ar',
        gt: null,
        max: null,
      }],
      valid: [
        '13324٫',
        '12321',
        '444٫83874',
      ],
      invalid: [
        '55.55.55',
        '1;23',
        '+-123',
        '1111111l1',
        '3.3',
      ],
    });
    test({
      validator: 'isFloat',
      args: [{
        locale: 'ru-RU',
        lt: null,
        min: null,
      }],
      valid: [
        '11231554,34343',
        '11,1',
        '456',
        ',311',
      ],
      invalid: [
        'ab565',
        '-.123',
        '+.123',
        '7866.t',
        '22.3',
      ],
    });
  });

  it('should validate hexadecimal strings', () => {
    test({
      validator: 'isHexadecimal',
      valid: [
        'deadBEEF',
        'ff0044',
        '0xff0044',
        '0XfF0044',
        '0x0123456789abcDEF',
        '0X0123456789abcDEF',
        '0hfedCBA9876543210',
        '0HfedCBA9876543210',
        '0123456789abcDEF',
      ],
      invalid: [
        'abcdefg',
        '',
        '..',
        '0xa2h',
        '0xa20x',
        '0x0123456789abcDEFq',
        '0hfedCBA9876543210q',
        '01234q56789abcDEF',
      ],
    });
  });

  it('should validate octal strings', () => {
    test({
      validator: 'isOctal',
      valid: [
        '076543210',
        '0o01234567',
      ],
      invalid: [
        'abcdefg',
        '012345678',
        '012345670c',
        '00c12345670c',
        '',
        '..',
      ],
    });
  });

  it('should validate hexadecimal color strings', () => {
    test({
      validator: 'isHexColor',
      valid: [
        '#ff0000ff',
        '#ff0034',
        '#CCCCCC',
        '0f38',
        'fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0a',
        '#ff12FG',
      ],
    });
  });

  it('should validate HSL color strings', () => {
    test({
      validator: 'isHSL',
      valid: [
        'hsl(360,0000000000100%,000000100%)',
        'hsl(000010, 00000000001%, 00000040%)',
        'HSL(00000,0000000000100%,000000100%)',
        'hsL(0, 0%, 0%)',
        'hSl(  360  , 100%  , 100%   )',
        'Hsl(  00150  , 000099%  , 01%   )',
        'hsl(01080, 03%, 4%)',
        'hsl(-540, 03%, 4%)',
        'hsla(+540, 03%, 4%)',
        'hsla(+540, 03%, 4%, 500)',
        'hsl(+540deg, 03%, 4%, 500)',
        'hsl(+540gRaD, 03%, 4%, 500)',
        'hsl(+540.01e-98rad, 03%, 4%, 500)',
        'hsl(-540.5turn, 03%, 4%, 500)',
        'hsl(+540, 03%, 4%, 500e-01)',
        'hsl(+540, 03%, 4%, 500e+80)',
        'hsl(4.71239rad, 60%, 70%)',
        'hsl(270deg, 60%, 70%)',
        'hsl(200, +.1%, 62%, 1)',
        'hsl(270 60% 70%)',
        'hsl(200, +.1e-9%, 62e10%, 1)',
        'hsl(.75turn, 60%, 70%)',
        // 'hsl(200grad+.1%62%/1)', //supposed to pass, but need to handle delimiters
        'hsl(200grad +.1% 62% / 1)',
        'hsl(270, 60%, 50%, .15)',
        'hsl(270, 60%, 50%, 15%)',
        'hsl(270 60% 50% / .15)',
        'hsl(270 60% 50% / 15%)',
      ],
      invalid: [
        'hsl (360,0000000000100%,000000100%)',
        'hsl(0260, 100 %, 100%)',
        'hsl(0160, 100%, 100%, 100 %)',
        'hsl(-0160, 100%, 100a)',
        'hsl(-0160, 100%, 100)',
        'hsl(-0160 100%, 100%, )',
        'hsl(270 deg, 60%, 70%)',
        'hsl( deg, 60%, 70%)',
        'hsl(, 60%, 70%)',
        'hsl(3000deg, 70%)',
      ],
    });
  });

  it('should validate rgb color strings', () => {
    test({
      validator: 'isRgbColor',
      valid: [
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,0.1)',
        'rgba(255,255,255,.12)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
        'rgba(5%,5%,5%,.32)',
      ],
      invalid: [
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,255,.123)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgba(5%,5%,5%,.321)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
        'rgb(101%,101%,101%) additional invalid string part',
        'rgba(3%,3%,101%,0.3) additional invalid string part',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rg ba(0, 251, 22, 0.5)',
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
      ],
    });

    // test empty options object
    test({
      validator: 'isRgbColor',
      args: [{}],
      valid: [
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
      ],
      invalid: [
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rg ba(0, 251, 22, 0.5)',
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
      ],
    });
    // test where includePercentValues is given as false
    test({
      validator: 'isRgbColor',
      args: [false],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
      ],
    });

    // test where includePercentValues is given as false as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: false }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'rgba(255, 255, 255 ,0.2)',
        'r         g    ba(   0,         251,       222     )',
      ],
    });

    // test where include percent is true explciitly
    test({
      validator: 'isRgbColor',
      args: [true],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
        'rgb(5%,5%,5%)',
        'rgba(255,255,255,0.5)',
      ],
      invalid: [
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
      ],
    });

    // test where percent value is false and allowSpaces is true as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: false, allowSpaces: true }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgba(255,255,255,0.2)',
        'rgba(255, 255, 255 ,0.2)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(5% ,5%, 5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,)',
        'rgb()',
        'rgb(4,4,5%)',
        'rgb(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%, 101%, 101%)',
        'rgba(3%,3%,101%,0.3)',
      ],

    });

    // test where both are true as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: true, allowSpaces: true }],
      valid: [
        'rgb(  5, 5, 5)',
        'rgba(5, 5, 5, .3)',
        'rgb(0, 0, 0)',
        'rgb(255, 255, 255)',
        'rgba(0, 0, 0, 0)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, .1)',
        'rgba(255, 255, 255, 0.1)',
        'rgb(5% ,5% ,5%)',
        'rgba(5%,5%,5%, .3)',
      ],
      invalid: [
        'r         g    b(   0,         251,       222     )',
        'rgb(4,4,5%)',
        'rgb(101%,101%,101%)',

      ],
    });

    // test where allowSpaces is false as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: true, allowSpaces: false }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',

      ],
      invalid: [
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
      ],
    });
  });

  it('should validate ISRC code strings', () => {
    test({
      validator: 'isISRC',
      valid: [
        'USAT29900609',
        'GBAYE6800011',
        'USRC15705223',
        'USCA29500702',
      ],
      invalid: [
        'USAT2990060',
        'SRC15705223',
        'US-CA29500702',
        'USARC15705223',
      ],
    });
  });

  it('should validate md5 strings', () => {
    test({
      validator: 'isMD5',
      valid: [
        'd94f3f016ae679c3008de268209132f2',
        '751adbc511ccbe8edf23d486fa4581cd',
        '88dae00e614d8f24cfd5a8b3f8002e93',
        '0bf1c35032a71a14c2f719e5a14c1e96',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
  });

  it('should validate hash strings', () => {
    ['md5', 'md4', 'ripemd128', 'tiger128'].forEach((algorithm) => {
      test({
        validator: 'isHash',
        args: [algorithm],
        valid: [
          'd94f3f016ae679c3008de268209132f2',
          '751adbc511ccbe8edf23d486fa4581cd',
          '88dae00e614d8f24cfd5a8b3f8002e93',
          '0bf1c35032a71a14c2f719e5a14c1e96',
          'd94f3F016Ae679C3008de268209132F2',
          '88DAE00e614d8f24cfd5a8b3f8002E93',
        ],
        invalid: [
          'q94375dj93458w34',
          '39485729348',
          '%&FHKJFvk',
          'KYT0bf1c35032a71a14c2f719e5a1',
        ],
      });
    });

    ['crc32', 'crc32b'].forEach((algorithm) => {
      test({
        validator: 'isHash',
        args: [algorithm],
        valid: [
          'd94f3f01',
          '751adbc5',
          '88dae00e',
          '0bf1c350',
          '88DAE00e',
          '751aDBc5',
        ],
        invalid: [
          'KYT0bf1c35032a71a14c2f719e5a14c1',
          'q94375dj93458w34',
          'q943',
          '39485729348',
          '%&FHKJFvk',
        ],
      });
    });

    ['sha1', 'tiger160', 'ripemd160'].forEach((algorithm) => {
      test({
        validator: 'isHash',
        args: [algorithm],
        valid: [
          '3ca25ae354e192b26879f651a51d92aa8a34d8d3',
          'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
          'beb8c3f30da46be179b8df5f5ecb5e4b10508230',
          'efd5d3b190e893ed317f38da2420d63b7ae0d5ed',
          'AAF4c61ddCC5e8a2dabede0f3b482cd9AEA9434D',
          '3ca25AE354e192b26879f651A51d92aa8a34d8D3',
        ],
        invalid: [
          'KYT0bf1c35032a71a14c2f719e5a14c1',
          'KYT0bf1c35032a71a14c2f719e5a14c1dsjkjkjkjkkjk',
          'q94375dj93458w34',
          '39485729348',
          '%&FHKJFvk',
        ],
      });
    });

    test({
      validator: 'isHash',
      args: ['sha256'],
      valid: [
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        '1d996e033d612d9af2b44b70061ee0e868bfd14c2dd90b129e1edeb7953e7985',
        '80f70bfeaed5886e33536bcfa8c05c60afef5a0e48f699a7912d5e399cdcc441',
        '579282cfb65ca1f109b78536effaf621b853c9f7079664a3fbe2b519f435898c',
        '2CF24dba5FB0a30e26E83b2AC5b9E29E1b161e5C1fa7425E73043362938b9824',
        '80F70bFEAed5886e33536bcfa8c05c60aFEF5a0e48f699a7912d5e399cdCC441',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'KYT0bf1c35032a71a14c2f719e5a14c1dsjkjkjkjkkjk',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
    test({
      validator: 'isHash',
      args: ['sha384'],
      valid: [
        '3fed1f814d28dc5d63e313f8a601ecc4836d1662a19365cbdcf6870f6b56388850b58043f7ebf2418abb8f39c3a42e31',
        'b330f4e575db6e73500bd3b805db1a84b5a034e5d21f0041d91eec85af1dfcb13e40bb1c4d36a72487e048ac6af74b58',
        'bf547c3fc5841a377eb1519c2890344dbab15c40ae4150b4b34443d2212e5b04aa9d58865bf03d8ae27840fef430b891',
        'fc09a3d11368386530f985dacddd026ae1e44e0e297c805c3429d50744e6237eb4417c20ffca8807b071823af13a3f65',
        '3fed1f814d28dc5d63e313f8A601ecc4836d1662a19365CBDCf6870f6b56388850b58043f7ebf2418abb8f39c3a42e31',
        'b330f4E575db6e73500bd3b805db1a84b5a034e5d21f0041d91EEC85af1dfcb13e40bb1c4d36a72487e048ac6af74b58',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'KYT0bf1c35032a71a14c2f719e5a14c1dsjkjkjkjkkjk',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
    test({
      validator: 'isHash',
      args: ['sha512'],
      valid: [
        '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
        '83c586381bf5ba94c8d9ba8b6b92beb0997d76c257708742a6c26d1b7cbb9269af92d527419d5b8475f2bb6686d2f92a6649b7f174c1d8306eb335e585ab5049',
        '45bc5fa8cb45ee408c04b6269e9f1e1c17090c5ce26ffeeda2af097735b29953ce547e40ff3ad0d120e5361cc5f9cee35ea91ecd4077f3f589b4d439168f91b9',
        '432ac3d29e4f18c7f604f7c3c96369a6c5c61fc09bf77880548239baffd61636d42ed374f41c261e424d20d98e320e812a6d52865be059745fdb2cb20acff0ab',
        '9B71D224bd62f3785D96d46ad3ea3d73319bFBC2890CAAdae2dff72519673CA72323C3d99ba5c11d7c7ACC6e14b8c5DA0c4663475c2E5c3adef46f73bcDEC043',
        '432AC3d29E4f18c7F604f7c3c96369A6C5c61fC09Bf77880548239baffd61636d42ed374f41c261e424d20d98e320e812a6d52865be059745fdb2cb20acff0ab',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'KYT0bf1c35032a71a14c2f719e5a14c1dsjkjkjkjkkjk',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
    test({
      validator: 'isHash',
      args: ['tiger192'],
      valid: [
        '6281a1f098c5e7290927ed09150d43ff3990a0fe1a48267c',
        '56268f7bc269cf1bc83d3ce42e07a85632394737918f4760',
        '46fc0125a148788a3ac1d649566fc04eb84a746f1a6e4fa7',
        '7731ea1621ae99ea3197b94583d034fdbaa4dce31a67404a',
        '6281A1f098c5e7290927ed09150d43ff3990a0fe1a48267C',
        '46FC0125a148788a3AC1d649566fc04eb84A746f1a6E4fa7',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'KYT0bf1c35032a71a14c2f719e5a14c1dsjkjkjkjkkjk',
        'q94375dj93458w34',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
  });
  it('should validate JWT tokens', () => {
    test({
      validator: 'isJWT',
      valid: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb3JlbSI6Imlwc3VtIn0.ymiJSsMJXR6tMSr8G9usjQ15_8hKPDv_CArLhxw28MI',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2xvciI6InNpdCIsImFtZXQiOlsibG9yZW0iLCJpcHN1bSJdfQ.rRpe04zbWbbJjwM43VnHzAboDzszJtGrNsUxaqQ-GQ8',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2huIjp7ImFnZSI6MjUsImhlaWdodCI6MTg1fSwiamFrZSI6eyJhZ2UiOjMwLCJoZWlnaHQiOjI3MH19.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E',
      ],
      invalid: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTYxNjY1Mzg3Mn0.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwiaWF0IjoxNjE2NjUzODcyLCJleHAiOjE2MTY2NTM4ODJ9.a1jLRQkO5TV5y5ERcaPAiM9Xm2gBdRjKrrCpHkGr_8M',
        '$Zs.ewu.su84',
        'ks64$S/9.dy$§kz.3sd73b',
      ],
      error: [
        [],
        {},
        null,
        undefined,
      ],
    });
  });

  it('should validate null strings', () => {
    test({
      validator: 'isEmpty',
      valid: [
        '',
      ],
      invalid: [
        ' ',
        'foo',
        '3',
      ],
    });
    test({
      validator: 'isEmpty',
      args: [{ ignore_whitespace: false }],
      valid: [
        '',
      ],
      invalid: [
        ' ',
        'foo',
        '3',
      ],
    });
    test({
      validator: 'isEmpty',
      args: [{ ignore_whitespace: true }],
      valid: [
        '',
        ' ',
      ],
      invalid: [
        'foo',
        '3',
      ],
    });
  });

  it('should validate strings against an expected value', () => {
    test({
      validator: 'equals', args: ['abc'], valid: ['abc'], invalid: ['Abc', '123'],
    });
  });

  it('should validate strings contain another string', () => {
    test({
      validator: 'contains',
      args: ['foo'],
      valid: ['foo', 'foobar', 'bazfoo'],
      invalid: ['bar', 'fobar'],
    });

    test({
      validator: 'contains',
      args: ['foo', {
        ignoreCase: true,
      }],
      valid: ['Foo', 'FOObar', 'BAZfoo'],
      invalid: ['bar', 'fobar', 'baxoof'],
    });

    test({
      validator: 'contains',
      args: ['foo', {
        minOccurrences: 2,
      }],
      valid: ['foofoofoo', '12foo124foo', 'fofooofoooofoooo', 'foo1foo'],
      invalid: ['foo', 'foobar', 'Fooofoo', 'foofo'],
    });
  });

  it('should validate strings against a pattern', () => {
    test({
      validator: 'matches',
      args: [/abc/],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc'],
    });
    test({
      validator: 'matches',
      args: ['abc'],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc'],
    });
    test({
      validator: 'matches',
      args: ['abc', 'i'],
      valid: ['abc', 'abcdef', '123abc', 'AbC'],
      invalid: ['acb'],
    });
  });

  it('should validate strings by length (deprecated api)', () => {
    test({
      validator: 'isLength',
      args: [2],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd'],
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['干𩸽', '𠮷野家'],
      invalid: ['', '𠀋', '千竈通り'],
    });
    test({
      validator: 'isLength',
      args: [0, 0],
      valid: [''],
      invalid: ['a', 'ab'],
    });
  });

  it('should validate isLocale codes', () => {
    test({
      validator: 'isLocale',
      valid: [
        'uz_Latn_UZ',
        'en',
        'gsw',
        'en-US',
        'es_ES',
        'es-419',
        'sw_KE',
        'am_ET',
        'zh-CHS',
        'ca_ES_VALENCIA',
        'en_US_POSIX',
        'hak-CN',
        'zh-Hant',
        'zh-Hans',
        'sr-Cyrl',
        'sr-Latn',
        'zh-cmn-Hans-CN',
        'cmn-Hans-CN',
        'zh-yue-HK',
        'yue-HK',
        'zh-Hans-CN',
        'sr-Latn-RS',
        'sl-rozaj',
        'sl-rozaj-biske',
        'sl-nedis',
        'de-CH-1901',
        'sl-IT-nedis',
        'hy-Latn-IT-arevela',
        'i-enochian',
        'en-scotland-fonipa',
        'sl-IT-rozaj-biske-1994',
        'de-CH-x-phonebk',
        'az-Arab-x-AZE-derbend',
        'x-whatever',
        'qaa-Qaaa-QM-x-southern',
        'de-Qaaa',
        'sr-Latn-QM',
        'sr-Qaaa-RS',
        'en-US-u-islamcal',
        'zh-CN-a-myext-x-private',
        'en-a-myext-b-another',
      ],
      invalid: [
        'lo_POP',
        '12',
        '12_DD',
        'de-419-DE',
        'a-DE',
      ],
    });
  });

  it('should validate strings by byte length (deprecated api)', () => {
    test({
      validator: 'isByteLength',
      args: [2],
      valid: ['abc', 'de', 'abcd', 'ｇｍａｉｌ'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isByteLength',
      args: [2, 3],
      valid: ['abc', 'de', 'ｇ'],
      invalid: ['', 'a', 'abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [0, 0],
      valid: [''],
      invalid: ['ｇ', 'a'],
    });
  });

  it('should validate strings by length', () => {
    test({
      validator: 'isLength',
      args: [{ min: 2 }],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 3 }],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 3 }],
      valid: ['干𩸽', '𠮷野家'],
      invalid: ['', '𠀋', '千竈通り'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 3 }],
      valid: ['abc', 'de', 'a', ''],
      invalid: ['abcd'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 6, discreteLengths: 5 }],
      valid: ['abcd', 'vfd', 'ff', '', 'k'],
      invalid: ['abcdefgh', 'hfjdksks'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 2, max: 6, discreteLengths: 5 }],
      valid: ['bsa', 'vfvd', 'ff'],
      invalid: ['', ' ', 'hfskdunvc'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 1, discreteLengths: 2 }],
      valid: [' ', 'hello', 'bsa'],
      invalid: [''],
    });
    test({
      validator: 'isLength',
      args: [{ max: 0 }],
      valid: [''],
      invalid: ['a', 'ab'],
    });
    test({
      validator: 'isLength',
      args: [{ min: 5, max: 10, discreteLengths: [2, 6, 8, 9] }],
      valid: ['helloguy', 'shopping', 'validator', 'length'],
      invalid: ['abcde', 'abcdefg'],
    });
    test({
      validator: 'isLength',
      args: [{ discreteLengths: '9' }],
      valid: ['a', 'abcd', 'abcdefghijkl'],
      invalid: [],
    });
    test({
      validator: 'isLength',
      valid: ['a', '', 'asds'],
    });
    test({
      validator: 'isLength',
      args: [{ max: 8 }],
      valid: ['👩🦰👩👩👦👦🏳️🌈', '⏩︎⏩︎⏪︎⏪︎⏭︎⏭︎⏮︎⏮︎'],
    });
  });

  it('should validate strings by byte length', () => {
    test({
      validator: 'isByteLength',
      args: [{ min: 2 }],
      valid: ['abc', 'de', 'abcd', 'ｇｍａｉｌ'],
      invalid: ['', 'a'],
    });
    test({
      validator: 'isByteLength',
      args: [{ min: 2, max: 3 }],
      valid: ['abc', 'de', 'ｇ'],
      invalid: ['', 'a', 'abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [{ max: 3 }],
      valid: ['abc', 'de', 'ｇ', 'a', ''],
      invalid: ['abcd', 'ｇｍ'],
    });
    test({
      validator: 'isByteLength',
      args: [{ max: 0 }],
      valid: [''],
      invalid: ['ｇ', 'a'],
    });
  });

  it('should validate ULIDs', () => {
    test({
      validator: 'isULID',
      valid: [
        '01HBGW8CWQ5Q6DTT7XP89VV4KT',
        '01HBGW8CWR8MZQMBG6FA2QHMDD',
        '01HBGW8CWS3MEEK12Y9G7SVW4V',
        '01hbgw8cws1tq2njavy9amb0wx',
        '01HBGW8cwS43H4jkQ0A4ZRJ7QV',
      ],
      invalid: [
        '',
        '01HBGW-CWS3MEEK1#Y9G7SVW4V',
        '91HBGW8CWS3MEEK12Y9G7SVW4V',
        '81HBGW8CWS3MEEK12Y9G7SVW4V',
        '934859',
        '01HBGW8CWS3MEEK12Y9G7SVW4VXXX',
        '01UBGW8IWS3MOEK12Y9G7SVW4V',
        '01HBGW8CuS43H4JKQ0A4ZRJ7QV',
      ],
    });
  });

  it('should validate UUIDs', () => {
    test({
      validator: 'isUUID',
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [undefined],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
        'A117FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'A117FBC9-4BED-3078-CF07-9141BA07C9F3',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC94BED3078CF079141BA07C9F3',
        'A11AAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [null],
      valid: [
        'A127FBC9-4BED-3078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A127FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A127FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        '912859',
        'A12AAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [1],
      valid: [
        'E034B584-7D89-11E9-9669-1AECF481A97B',
      ],
      invalid: [
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'AAAAAAAA-1111-2222-AAAG',
        'AAAAAAAA-1111-2222-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [2],
      valid: [
        'A987FBC9-4BED-2078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '11111',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-2078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [3],
      valid: [
        '9deb20fe-a6e0-355c-81ea-288b009e4f6d',
      ],
      invalid: [
        '',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [4],
      valid: [
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [5],
      valid: [
        '987FBC97-4BED-5078-AF07-9141BA07C9F3',
        '987FBC97-4BED-5078-BF07-9141BA07C9F3',
        '987FBC97-4BED-5078-8F07-9141BA07C9F3',
        '987FBC97-4BED-5078-9F07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
    });
    test({
      validator: 'isUUID',
      args: [6],
      valid: [
        '1ef29908-cde1-69d0-be16-bfc8518a95f0',
      ],
      invalid: [
        '987FBC97-4BED-1078-AF07-9141BA07C9F3',
        '987FBC97-4BED-2078-AF07-9141BA07C9F3',
        '987FBC97-4BED-3078-AF07-9141BA07C9F3',
        '987FBC97-4BED-4078-AF07-9141BA07C9F3',
        '987FBC97-4BED-5078-AF07-9141BA07C9F3',
        '018C544A-D384-7000-BB74-3B1738ABE43C',
        '987FBC97-4BED-8078-AF07-9141BA07C9F3',
      ],
    });
    test({
      validator: 'isUUID',
      args: [7],
      valid: [
        '018C544A-D384-7000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-8078-AF07-9141BA07C9F3',
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
    });
    test({
      validator: 'isUUID',
      args: [8],
      valid: [
        '018C544A-D384-8000-BB74-3B1738ABE43C',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-6078-AF07-9141BA07C9F3',
        'A987FBC9-4BED-7078-AF07-9141BA07C9F3',
        '713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
        '625e63f3-58f5-40b7-83a1-a72ad31acffb',
        '57b73598-8764-4ad0-a76a-679bb6640eb1',
        '9c858901-8a57-4791-81fe-4c455b099bc9',
      ],
    });
  });

  it('should validate a string that is in another string or array', () => {
    test({
      validator: 'isIn',
      args: ['foobar'],
      valid: ['foo', 'bar', 'foobar', ''],
      invalid: ['foobarbaz', 'barfoo'],
    });
    test({
      validator: 'isIn',
      args: [['foo', 'bar']],
      valid: ['foo', 'bar'],
      invalid: ['foobar', 'barfoo', ''],
    });
    test({
      validator: 'isIn',
      args: [['1', '2', '3']],
      valid: ['1', '2', '3'],
      invalid: ['4', ''],
    });
    test({
      validator: 'isIn',
      args: [['1', '2', '3', { foo: 'bar' }, () => 5, { toString: 'test' }]],
      valid: ['1', '2', '3', ''],
      invalid: ['4'],
    });
    test({ validator: 'isIn', invalid: ['foo', ''] });
  });

  it('should validate a string that is in another object', () => {
    test({
      validator: 'isIn',
      args: [{ foo: 1, bar: 2, foobar: 3 }],
      valid: ['foo', 'bar', 'foobar'],
      invalid: ['foobarbaz', 'barfoo', ''],
    });
    test({
      validator: 'isIn',
      args: [{ 1: 3, 2: 0, 3: 1 }],
      valid: ['1', '2', '3'],
      invalid: ['4', ''],
    });
  });

  it('should validate ABA routing number', () => {
    test({
      validator: 'isAbaRouting',
      valid: [
        '322070381',
        '011103093',
        '263170175',
        '124303065',
      ],
      invalid: [
        '426317017',
        '789456124',
        '603558459',
        'qwerty',
        '12430306',
        '382070381',
      ],
    });
  });

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
      valid: [
        'DK5000400440116243',
        'GB29NWBK60161331926819',
      ],
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

  it('should validate BIC codes', () => {
    test({
      validator: 'isBIC',
      valid: [
        'SBICKEN1345',
        'SBICKEN1',
        'SBICKENY',
        'SBICKEN1YYP',
        'SBICXKN1YYP',
      ],
      invalid: [
        'SBIC23NXXX',
        'S23CKENXXXX',
        'SBICKENXX',
        'SBICKENXX9',
        'SBICKEN13458',
        'SBICKEN',
        'SBICXK',
      ],
    });
  });

  it('should validate that integer strings are divisible by a number', () => {
    test({
      validator: 'isDivisibleBy',
      args: [2],
      valid: ['2', '4', '100', '1000'],
      invalid: [
        '1',
        '2.5',
        '101',
        'foo',
        '',
        '2020-01-06T14:31:00.135Z',
      ],
    });
  });

  it('should validate luhn numbers', () => {
    test({
      validator: 'isLuhnNumber',
      valid: [
        '0',
        '5421',
        '01234567897',
        '0123456789012345678906',
        '0123456789012345678901234567891',
        '123456789012345678906',
        '375556917985515',
        '36050234196908',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4929 7226 5379 7141',
      ],
      invalid: [
        '',
        '1',
        '5422',
        'foo',
        'prefix6234917882863855',
        '623491788middle2863855',
        '6234917882863855suffix',
      ],
    });
  });

  it('should validate credit cards', () => {
    test({
      validator: 'isCreditCard',
      valid: [
        '375556917985515',
        '36050234196908',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '6765780016990268',
        '4716989580001715211',
        '8171999927660000',
        '8171999900000000021',
      ],
      invalid: [
        'foo',
        'foo',
        '5398228707871528',
        '2718760626256571',
        '2721465526338453',
        '2220175103860763',
        '375556917985515999999993',
        '899999996234917882863855',
        'prefix6234917882863855',
        '623491788middle2863855',
        '6234917882863855suffix',
        '4716989580001715213',
      ],
    });
  });


  it('should validate credit cards without a proper provider', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'Plorf' }],
      error: [
        'foo',
        // valid cc #
        '375556917985515',
        '4716-2210-5188-5662',
        '375556917985515999999993',
        '6234917882863855suffix',
      ],
    });
  });


  it('should validate AmEx provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'AmEx' }],
      valid: [
        '375556917985515',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '36050234196908',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });


  it('should validate Diners Club provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'DinersClub' }],
      valid: [
        '36050234196908',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '375556917985515',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });

  it('should validate Discover provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'Discover' }],
      valid: [
        '6011111111111117',
        '6011000990139424',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '36050234196908',
        '375556917985515',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });

  it('should validate JCB provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'JCB' }],
      valid: [
        '3530111333300000',
        '3566002020360505',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '36050234196908',
        '375556917985515',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });


  it('should validate Mastercard provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'Mastercard' }],
      valid: [
        '2222155765072228',
        '2225855203075256',
        '2718760626256570',
        '2720428011723762',
        '5398228707871527',
      ],
      invalid: [
        'foo',
        '36050234196908',
        '375556917985515',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });


  it('should validate Union Pay provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'UnionPay' }],
      valid: [
        '6226050967750613',
        '6234917882863855',
        '6234698580215388',
        '6246281879460688',
        '6263892624162870',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '36050234196908',
        '375556917985515',
        '375556917985515999999993',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4716989580001715211',
        '4929 7226 5379 7141',
        '5398228707871527',
        '6234917882863855suffix',
      ],
    });
  });


  it('should validate Visa provided credit cards', () => {
    test({
      validator: 'isCreditCard',
      args: [{ provider: 'Visa' }],
      valid: [
        '4716-2210-5188-5662',
        '4716461583322103',
        '4716989580001715211',
        '4929 7226 5379 7141',
      ],
      invalid: [
        'foo',
        '2222155765072228',
        '2225855203075256',
        '2720428011723762',
        '2718760626256570',
        '36050234196908',
        '375556917985515',
        '375556917985515999999993',
        '5398228707871527',
        '6234917882863855suffix',
        '6283875070985593',
        '6263892624162870',
        '6234917882863855',
        '6234698580215388',
        '6226050967750613',
        '6246281879460688',
        '6283875070985593',
        '6765780016990268',
        '8171999927660000',
        '8171999900000000021',
      ],
    });
  });


  it('should validate identity cards', () => {
    const fixtures = [
      {
        locale: 'PK',
        valid: [
          '45504-4185771-3',
          '39915-6182971-9',
          '21143-6182971-2',
          '34543-2323471-1',
          '72345-2345678-7',
          '63456-8765432-8',
          '55672-1234567-5',
          '21234-9876543-6',
        ],
        invalid: [
          '08000-1234567-5',
          '74321-87654321-1',
          '51234-98765-2',
          '00000-0000000-0',
          '88888-88888888-0',
          '99999-9999999-9',
          '11111',
        ],
      },
      {
        locale: 'zh-HK',
        valid: [
          'OV290326[A]',
          'Q803337[0]',
          'Z0977986',
          'W520128(7)',
          'A494866[4]',
          'A494866(4)',
          'Z867821A',
          'ag293013(9)',
          'k348609(5)',
        ],
        invalid: [
          'A1234567890',
          '98765432',
          'O962472(9)',
          'M4578601',
          'X731324[8]',
          'C503134(5)',
          'RH265886(3)',
        ],
      },
      {
        locale: 'LK',
        valid: [
          '722222222v',
          '722222222V',
          '993151225x',
          '993151225X',
          '188888388x',
          '935632124V',
          '199931512253',
          '200023125632',
        ],
        invalid: [
          '023125648V',
          '023345621v',
          '021354211X',
          '055321231x',
          '02135465462',
          '199931512253X',
        ],
      },
      {
        locale: 'PL',
        valid: [
          '99012229019',
          '09210215408',
          '20313034701',
          '86051575214',
          '77334586883',
          '54007481320',
          '06566860643',
          '77552478861',
        ],
        invalid: [
          'aa',
          '5',
          '195',
          '',
          ' ',
          '12345678901',
          '99212229019',
          '09210215402',
          '20313534701',
          '86241579214',
        ],
      },
      {
        locale: 'ES',
        valid: [
          '99999999R',
          '12345678Z',
          '01234567L',
          '01234567l',
          'X1234567l',
          'x1234567l',
          'X1234567L',
          'Y1234567X',
          'Z1234567R',
        ],
        invalid: [
          '123456789',
          '12345678A',
          '12345 678Z',
          '12345678-Z',
          '1234*6789',
          '1234*678Z',
          '12345678!',
          '1234567L',
          'A1234567L',
          'X1234567A',
          'Y1234567B',
          'Z1234567C',
        ],
      },
      {
        locale: 'FI',
        valid: [
          '131052-308T', // People born in 1900s
          '131052A308T', // People born in 2000s
          '131052+308T', // People born in 1800s
          '131052-313Y',
        ],
        invalid: [
          '131052308T',
          '131052-308T ',
          '131052-308A',
        ],
      },
      {
        locale: 'IN',
        valid: [
          '298448863364',
          '2984 4886 3364',
        ],
        invalid: [
          '99999999R',
          '12345678Z',
          '01234567L',
          '01234567l',
          'X1234567l',
          'x1234567l',
          'X1234567L',
        ],
      },
      {
        locale: 'IR',
        valid: [
          '0499370899',
          '0790419904',
          '0084575948',
          '0963695398',
          '0684159414',
          '0067749828',
          '0650451252',
          '1583250689',
          '4032152314',
          '0076229645',
          '4271467685',
          '0200203241',
        ],
        invalid: [
          '1260293040',
          '0000000001',
          '1999999999',
          '9999999991',
          'AAAAAAAAAA',
          '0684159415',
        ],
      },
      {
        locale: 'IT',
        valid: [
          'CR43675TM',
          'CA79382RA',
        ],
        invalid: [
          'CA00000AA',
          'CB2342TG',
          'CS123456A',
          'C1236EC',
        ],
      },
      {
        locale: 'NO',
        valid: [
          '09053426694',
          '26028338723',
          '08031470790',
          '12051539514',
          '02077448074',
          '14035638319',
          '13031379673',
          '29126214926',
        ],
        invalid: [
          '09053426699',
          '00000000000',
          '26028338724',
          '92031470790',
        ],
      },
      {
        locale: 'TH',
        valid: [
          '1101230000001',
          '1101230000060',
        ],
        invalid: [
          'abc',
          '1101230',
          '11012300000011',
          'aaaaaaaaaaaaa',
          '110123abcd001',
          '1101230000007',
          '0101123450000',
          '0101123450004',
          '9101123450008',
        ],
      },
      {
        locale: 'he-IL',
        valid: [
          '219472156',
          '219486610',
          '219488962',
          '219566726',
          '219640216',
          '219645041',
          '334795465',
          '335211686',
          '335240479',
          '335472171',
          '336999842',
          '337090443',
        ],
        invalid: [
          '123456789',
          '12345678A',
          '12345 678Z',
          '12345678-Z',
          '1234*6789',
          '1234*678Z',
          '12345678!',
          '1234567L',
          'A1234567L',
          'X1234567A',
          'Y1234567B',
          'Z1234567C',
          '219772156',
          '219487710',
          '334705465',
          '336000842',
        ],
      },
      {
        locale: 'ar-LY',
        valid: [
          '119803455876',
          '120024679875',
          '219624876201',
          '220103480657',
        ],
        invalid: [
          '987654320123',
          '123-456-7890',
          '012345678912',
          '1234567890',
          'AFJBHUYTREWR',
          'C4V6B1X0M5T6',
          '9876543210123',
        ],
      },
      {
        locale: 'ar-TN',
        valid: [
          '09958092',
          '09151092',
          '65126506',
          '79378815',
          '58994407',
          '73089789',
          '73260311',
        ],
        invalid: [
          '123456789546',
          '123456789',
          '023456789',
          '12345678A',
          '12345',
          '1234578A',
          '123 578A',
          '12345 678Z',
          '12345678-Z',
          '1234*6789',
          '1234*678Z',
          'GE9800as98',
          'X231071922',
          '1234*678Z',
          '12345678!',
        ],
      },
      {
        locale: 'zh-CN',
        valid: [
          '235407195106112745',
          '210203197503102721',
          '520323197806058856',
          '110101491001001',
        ],
        invalid: [
          '160323197806058856',
          '010203197503102721',
          '520323297806058856',
          '520323197802318856',
          '235407195106112742',
          '010101491001001',
          '110101491041001',
          '160101491001001',
          '110101940231001',
          'xx1234567',
          '135407195106112742',
          '123456789546',
          '123456789',
          '023456789',
          '12345678A',
          '12345',
          '1234578A',
          '123 578A',
          '12345 678Z',
          '12345678-Z',
          '1234*6789',
          '1234*678Z',
          'GE9800as98',
          'X231071922',
          '1234*678Z',
          '12345678!',
          '235407207006112742',
        ],
      },
      {
        locale: 'zh-TW',
        valid: [
          'B176944193',
          'K101189797',
          'F112866121',
          'A219758834',
          'A244144802',
          'A146047171',
          'Q170219004',
          'Z277018381',
          'X231071923',
        ],
        invalid: [
          '123456789',
          'A185034995',
          'X431071923',
          'GE9800as98',
          'X231071922',
          '1234*678Z',
          '12345678!',
          '1234567L',
          'A1234567L',
          'X1234567A',
          'Y1234567B',
          'Z1234567C',
          '219772156',
          '219487710',
          '334705465',
          '336000842',
        ],
      },
    ];

    let allValid = [];

    // Test fixtures
    fixtures.forEach((fixture) => {
      if (fixture.valid) allValid = allValid.concat(fixture.valid);
      test({
        validator: 'isIdentityCard',
        valid: fixture.valid,
        invalid: fixture.invalid,
        args: [fixture.locale],
      });
    });

    // Test generics
    test({
      validator: 'isIdentityCard',
      valid: [
        ...allValid,
      ],
      invalid: [
        'foo',
      ],
      args: ['any'],
    });
  });

  it('should error on invalid locale', () => {
    test({
      validator: 'isIdentityCard',
      args: ['is-NOT'],
      error: [
        '99999999R',
        '12345678Z',
      ],
    });
  });

  it('should validate ISINs', () => {
    test({
      validator: 'isISIN',
      valid: [
        'AU0000XVGZA3',
        'DE000BAY0017',
        'BE0003796134',
        'SG1G55870362',
        'GB0001411924',
        'DE000WCH8881',
        'PLLWBGD00016',
        'US0378331005',
      ],
      invalid: [
        'DE000BAY0018',
        'PLLWBGD00019',
        'foo',
        '5398228707871528',
      ],
    });
  });

  it('should validate EANs', () => {
    test({
      validator: 'isEAN',
      valid: [
        '9421023610112',
        '1234567890128',
        '4012345678901',
        '9771234567003',
        '9783161484100',
        '73513537',
        '00012345600012',
        '10012345678902',
        '20012345678909',
      ],
      invalid: [
        '5901234123451',
        '079777681629',
        '0705632085948',
      ],
    });
  });

  it('should validate ISSNs', () => {
    test({
      validator: 'isISSN',
      valid: [
        '0378-5955',
        '0000-0000',
        '2434-561X',
        '2434-561x',
        '01896016',
        '20905076',
      ],
      invalid: [
        '0378-5954',
        '0000-0001',
        '0378-123',
        '037-1234',
        '0',
        '2434-561c',
        '1684-5370',
        '19960791',
        '',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ case_sensitive: true }],
      valid: [
        '2434-561X',
        '2434561X',
        '0378-5955',
        '03785955',
      ],
      invalid: [
        '2434-561x',
        '2434561x',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ require_hyphen: true }],
      valid: [
        '2434-561X',
        '2434-561x',
        '0378-5955',
      ],
      invalid: [
        '2434561X',
        '2434561x',
        '03785955',
      ],
    });
    test({
      validator: 'isISSN',
      args: [{ case_sensitive: true, require_hyphen: true }],
      valid: [
        '2434-561X',
        '0378-5955',
      ],
      invalid: [
        '2434-561x',
        '2434561X',
        '2434561x',
        '03785955',
      ],
    });
  });

  it('should validate JSON', () => {
    test({
      validator: 'isJSON',
      valid: [
        '{ "key": "value" }',
        '{}',
      ],
      invalid: [
        '{ key: "value" }',
        '{ \'key\': \'value\' }',
        'null',
        '1234',
        '"nope"',
      ],
    });
  });

  it('should validate JSON with primitives', () => {
    test({
      validator: 'isJSON',
      args: [{ allow_primitives: true }],
      valid: [
        '{ "key": "value" }',
        '{}',
        'null',
        'false',
        'true',
      ],
      invalid: [
        '{ key: "value" }',
        '{ \'key\': \'value\' }',
        '{ "key": value }',
        '1234',
        '"nope"',
      ],
    });
  });

  it('should validate multibyte strings', () => {
    test({
      validator: 'isMultibyte',
      valid: [
        'ひらがな・カタカナ、．漢字',
        'あいうえお foobar',
        'test＠example.com',
        '1234abcDEｘｙｚ',
        'ｶﾀｶﾅ',
        '中文',
      ],
      invalid: [
        'abc',
        'abc123',
        '<>@" *.',
      ],
    });
  });

  it('should validate ascii strings', () => {
    test({
      validator: 'isAscii',
      valid: [
        'foobar',
        '0987654321',
        'test@example.com',
        '1234abcDEF',
      ],
      invalid: [
        'ｆｏｏbar',
        'ｘｙｚ０９８',
        '１２３456',
        'ｶﾀｶﾅ',
      ],
    });
  });

  it('should validate full-width strings', () => {
    test({
      validator: 'isFullWidth',
      valid: [
        'ひらがな・カタカナ、．漢字',
        '３ー０　ａ＠ｃｏｍ',
        'Ｆｶﾀｶﾅﾞﾬ',
        'Good＝Parts',
      ],
      invalid: [
        'abc',
        'abc123',
        '!"#$%&()<>/+=-_? ~^|.,@`{}[]',
      ],
    });
  });

  it('should validate half-width strings', () => {
    test({
      validator: 'isHalfWidth',
      valid: [
        '!"#$%&()<>/+=-_? ~^|.,@`{}[]',
        'l-btn_02--active',
        'abc123い',
        'ｶﾀｶﾅﾞﾬ￩',
      ],
      invalid: [
        'あいうえお',
        '００１１',
      ],
    });
  });

  it('should validate variable-width strings', () => {
    test({
      validator: 'isVariableWidth',
      valid: [
        'ひらがなカタカナ漢字ABCDE',
        '３ー０123',
        'Ｆｶﾀｶﾅﾞﾬ',
        'Good＝Parts',
      ],
      invalid: [
        'abc',
        'abc123',
        '!"#$%&()<>/+=-_? ~^|.,@`{}[]',
        'ひらがな・カタカナ、．漢字',
        '１２３４５６',
        'ｶﾀｶﾅﾞﾬ',
      ],
    });
  });

  it('should validate surrogate pair strings', () => {
    test({
      validator: 'isSurrogatePair',
      valid: [
        '𠮷野𠮷',
        '𩸽',
        'ABC千𥧄1-2-3',
      ],
      invalid: [
        '吉野竈',
        '鮪',
        'ABC1-2-3',
      ],
    });
  });

  it('should validate Semantic Versioning Specification (SemVer) strings', () => {
    test({
      validator: 'isSemVer',
      valid: [
        '0.0.4',
        '1.2.3',
        '10.20.30',
        '1.1.2-prerelease+meta',
        '1.1.2+meta',
        '1.1.2+meta-valid',
        '1.0.0-alpha',
        '1.0.0-beta',
        '1.0.0-alpha.beta',
        '1.0.0-alpha.beta.1',
        '1.0.0-alpha.1',
        '1.0.0-alpha0.valid',
        '1.0.0-alpha.0valid',
        '1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay',
        '1.0.0-rc.1+build.1',
        '2.0.0-rc.1+build.123',
        '1.2.3-beta',
        '10.2.3-DEV-SNAPSHOT',
        '1.2.3-SNAPSHOT-123',
        '1.0.0',
        '2.0.0',
        '1.1.7',
        '2.0.0+build.1848',
        '2.0.1-alpha.1227',
        '1.0.0-alpha+beta',
        '1.2.3----RC-SNAPSHOT.12.9.1--.12+788',
        '1.2.3----R-S.12.9.1--.12+meta',
        '1.2.3----RC-SNAPSHOT.12.9.1--.12',
        '1.0.0+0.build.1-rc.10000aaa-kk-0.1',
        '99999999999999999999999.999999999999999999.99999999999999999',
        '1.0.0-0A.is.legal',
      ],
      invalid: [
        '-invalid+invalid',
        '-invalid.01',
        'alpha',
        'alpha.beta',
        'alpha.beta.1',
        'alpha.1',
        'alpha+beta',
        'alpha_beta',
        'alpha.',
        'alpha..',
        'beta',
        '1.0.0-alpha_beta',
        '-alpha.',
        '1.0.0-alpha..',
        '1.0.0-alpha..1',
        '1.0.0-alpha...1',
        '1.0.0-alpha....1',
        '1.0.0-alpha.....1',
        '1.0.0-alpha......1',
        '1.0.0-alpha.......1',
        '01.1.1',
        '1.01.1',
        '1.1.01',
        '1.2',
        '1.2.3.DEV',
        '1.2-SNAPSHOT',
        '1.2.31.2.3----RC-SNAPSHOT.12.09.1--..12+788',
        '1.2-RC-SNAPSHOT',
        '-1.0.3-gamma+b7718',
        '+justmeta',
        '9.8.7+meta+meta',
        '9.8.7-whatever+meta+meta',
        '99999999999999999999999.999999999999999999.99999999999999999-',
        '---RC-SNAPSHOT.12.09.1--------------------------------..12',
      ],
    });
  });

  it('should validate base32 strings', () => {
    test({
      validator: 'isBase32',
      valid: [
        'ZG======',
        'JBSQ====',
        'JBSWY===',
        'JBSWY3A=',
        'JBSWY3DP',
        'JBSWY3DPEA======',
        'K5SWYY3PNVSSA5DPEBXG6ZA=',
        'K5SWYY3PNVSSA5DPEBXG6===',
      ],
      invalid: [
        '12345',
        '',
        'JBSWY3DPtesting123',
        'ZG=====',
        'Z======',
        'Zm=8JBSWY3DP',
        '=m9vYg==',
        'Zm9vYm/y====',
      ],
    });
  });

  it('should validate base32 strings with crockford alternative', () => {
    test({
      validator: 'isBase32',
      args: [{ crockford: true }],
      valid: [
        '91JPRV3F41BPYWKCCGGG',
        '60',
        '64',
        'B5QQA833C5Q20S3F41MQ8',
      ],
      invalid: [
        '91JPRV3F41BUPYWKCCGGG',
        'B5QQA833C5Q20S3F41MQ8L',
        '60I',
        'B5QQA833OULIC5Q20S3F41MQ8',
      ],
    });
  });

  it('should validate base58 strings', () => {
    test({
      validator: 'isBase58',
      valid: [
        'BukQL',
        '3KMUV89zab',
        '91GHkLMNtyo98',
        'YyjKm3H',
        'Mkhss145TRFg',
        '7678765677',
        'abcodpq',
        'AAVHJKLPY',
      ],
      invalid: [
        '0OPLJH',
        'IMKLP23',
        'KLMOmk986',
        'LL1l1985hG',
        '*MP9K',
        'Zm=8JBSWY3DP',
        ')()(=9292929MKL',
      ],
    });
  });


  it('should validate hex-encoded MongoDB ObjectId', () => {
    test({
      validator: 'isMongoId',
      valid: [
        '507f1f77bcf86cd799439011',
      ],
      invalid: [
        '507f1f77bcf86cd7994390',
        '507f1f77bcf86cd79943901z',
        '',
        '507f1f77bcf86cd799439011 ',
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

  it('should validate mobile phone number', () => {
    let fixtures = [
      {
        locale: 'am-AM',
        valid: [
          '+37433123456',
          '+37441123456',
          '+37443123456',
          '+37444123456',
          '+37455123456',
          '+37477123456',
          '+37488123456',
          '+37491123456',
          '+37493123456',
          '+37494123456',
          '+37495123456',
          '+37496123456',
          '+37498123456',
          '+37499123456',
          '055123456',
          '37455123456',
        ],
        invalid: [
          '12345',
          '+37403498855',
          '+37416498123',
          '05614988556',
          '',
          '37456789000',
          '37486789000',
          '+37431312345',
          '+37430312345',
          '+37460123456',
          '+37410324123',
          '+37422298765',
          '+37431276521',
          '022698763',
          '+37492123456',
        ],
      },
      {
        locale: 'ar-AE',
        valid: [
          '+971502674453',
          '+971521247658',
          '+971541255684',
          '+971555454458',
          '+971561498855',
          '+971585215778',
          '971585215778',
          '0585215778',
          '585215778',
        ],
        invalid: [
          '12345',
          '+971511498855',
          '+9715614988556',
          '+9745614988556',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
          '962796477263',
        ],
      },
      {
        locale: 'ar-BH',
        valid: [
          '+97335078110',
          '+97339534385',
          '+97366331055',
          '+97333146000',
          '97335078110',
          '35078110',
          '66331055',
        ],
        invalid: [
          '12345',
          '+973350781101',
          '+97379534385',
          '+973035078110',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
          '962796477263',
          '035078110',
          '16331055',
          'hello',
          '+9733507811a',
        ],
      },
      {
        locale: 'ar-EG',
        valid: [
          '+201004513789',
          '+201111453489',
          '+201221204610',
          '+201144621154',
          '+201200124304',
          '+201011201564',
          '+201124679001',
          '+201064790156',
          '+201274652177',
          '+201280134679',
          '+201090124576',
          '+201583728900',
          '201599495596',
          '201090124576',
          '01090124576',
          '01538920744',
          '1593075993',
          '1090124576',
        ],
        invalid: [
          '+221004513789',
          '+201404513789',
          '12345',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
          '962796477263',
        ],
      },
      {
        locale: 'ar-JO',
        valid: [
          '0796477263',
          '0777866254',
          '0786725261',
          '+962796477263',
          '+962777866254',
          '+962786725261',
          '962796477263',
          '962777866254',
          '962786725261',
        ],
        invalid: [
          '00962786725261',
          '00962796477263',
          '12345',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
        ],
      },
      {
        locale: 'ar-KW',
        valid: [
          '96550000000',
          '96560000000',
          '96590000000',
          '96541000000',
          '+96550000000',
          '+96550000220',
          '+96551111220',
          '+96541000000',
        ],
        invalid: [
          '+96570000220',
          '00962786725261',
          '00962796477263',
          '12345',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
          '+96540000000',
        ],
      },
      {
        locale: 'ar-LB',
        valid: [
          '+96171234568',
          '+9613123456',
          '3456123',
          '3123456',
          '81978468',
          '77675798',
        ],
        invalid: [
          '+961712345688888',
          '00912220000',
          '7767579888',
          '+0921110000',
          '+3123456888',
          '021222200000',
          '213333444444',
          '',
          '+212234',
          '+21',
          '02122333',
        ],
      },
      {
        locale: 'ar-LY',
        valid: [
          '912220000',
          '0923330000',
          '218945550000',
          '+218958880000',
          '212220000',
          '0212220000',
          '+218212220000',
        ],
        invalid: [
          '9122220000',
          '00912220000',
          '09211110000',
          '+0921110000',
          '+2180921110000',
          '021222200000',
          '213333444444',
          '',
          '+212234',
          '+21',
          '02122333',
        ],
      },
      {
        locale: 'ar-MA',
        valid: [
          '0522714782',
          '0690851123',
          '0708186135',
          '+212522714782',
          '+212690851123',
          '+212708186135',
          '00212522714782',
          '00212690851123',
          '00212708186135',
        ],
        invalid: [
          '522714782',
          '690851123',
          '708186135',
          '212522714782',
          '212690851123',
          '212708186135',
          '0212522714782',
          '0212690851123',
          '0212708186135',
          '',
          '12345',
          '0922714782',
          '+212190851123',
          '00212408186135',
        ],
      },
      {
        locale: 'dz-BT',
        valid: [
          '+97517374354',
          '+97517454971',
          '77324646',
          '016329712',
          '97517265559',
        ],
        invalid: [
          '',
          '9898347255',
          '+96326626262',
          '963372',
          '0114152198',
        ],
      },
      {
        locale: 'ar-OM',
        valid: [
          '+96891212121',
          '+96871212121',
          '0096899999999',
          '93112211',
          '99099009',
        ],
        invalid: [
          '+96890212121',
          '0096890999999',
          '0090999999',
          '+9689021212',
          '',
          '+212234',
          '+21',
          '02122333',
        ],
      },
      {
        locale: 'ar-PS',
        valid: [
          '+970563459876',
          '970592334218',
          '0566372345',
          '0598273583',
        ],
        invalid: [
          '+9759029487',
          '97059123456789',
          '598372348',
          '97058aaaafjd',
          '',
          '05609123484',
          '+97059',
          '+970',
          '97056',
        ],
      },
      {
        locale: 'ar-SY',
        valid: [
          '0944549710',
          '+963944549710',
          '956654379',
          '0944549710',
          '0962655597',
        ],
        invalid: [
          '12345',
          '',
          '+9639626626262',
          '+963332210972',
          '0114152198',
        ],
      },
      {
        locale: 'ar-SA',
        valid: [
          '0556578654',
          '+966556578654',
          '966556578654',
          '596578654',
          '572655597',
        ],
        invalid: [
          '12345',
          '',
          '+9665626626262',
          '+96633221097',
          '0114152198',
        ],
      },
      {
        locale: 'ar-SD',
        valid: [
          '0128652312',
          '+249919425113',
          '249123212345',
          '0993212345',
        ],
        invalid: [
          '12345',
          '',
          '+249972662622',
          '+24946266262',
          '+24933221097',
          '0614152198',
          '096554',
        ],
      },
      {
        locale: 'ar-TN',
        valid: [
          '23456789',
          '+21623456789',
          '21623456789',
        ],
        invalid: [
          '12345',
          '75200123',
          '+216512345678',
          '13520459',
          '85479520',
        ],
      },
      {
        locale: 'bg-BG',
        valid: [
          '+359897123456',
          '+359898888888',
          '0897123123',
        ],
        invalid: [
          '',
          '0898123',
          '+359212555666',
          '18001234567',
          '12125559999',
        ],
      },
      {
        locale: 'bn-BD',
        valid: [
          '+8801794626846',
          '01399098893',
          '8801671163269',
          '01717112029',
          '8801898765432',
          '+8801312345678',
          '01494676946',
        ],
        invalid: [
          '',
          '0174626346',
          '017943563469',
          '18001234567',
          '0131234567',
        ],
      },
      {
        locale: 'bs-BA',
        valid: [
          '060123456',
          '061123456',
          '062123456',
          '063123456',
          '0641234567',
          '065123456',
          '066123456',
          '+38760123456',
          '+38761123456',
          '+38762123456',
          '+38763123456',
          '+387641234567',
          '+38765123456',
          '+38766123456',
          '0038760123456',
          '0038761123456',
          '0038762123456',
          '0038763123456',
          '00387641234567',
          '0038765123456',
          '0038766123456',
        ],
        invalid: [
          '0601234567',
          '0611234567',
          '06212345',
          '06312345',
          '064123456',
          '0651234567',
          '06612345',
          '+3866123456',
          '+3856123456',
          '00038760123456',
          '038761123456',
        ],
      },
      {
        locale: 'cs-CZ',
        valid: [
          '+420 123 456 789',
          '+420 123456789',
          '+420123456789',
          '123 456 789',
          '123456789',
        ],
        invalid: [
          '',
          '+42012345678',
          '+421 123 456 789',
          '+420 023456789',
          '+4201234567892',
        ],
      },
      {
        locale: 'sk-SK',
        valid: [
          '+421 123 456 789',
          '+421 123456789',
          '+421123456789',
          '123 456 789',
          '123456789',
        ],
        invalid: [
          '',
          '+42112345678',
          '+422 123 456 789',
          '+421 023456789',
          '+4211234567892',
        ],
      },
      {
        locale: 'de-DE',
        valid: [
          '+4915123456789',
          '015123456789',
          '015123456789',
          '015623456789',
          '015623456789',
          '01601234567',
          '016012345678',
          '01621234567',
          '01631234567',
          '01701234567',
          '017612345678',
        ],
        invalid: [
          '+4930405044550',
          '34412345678',
          '14412345678',
          '16212345678',
          '1761234567',
          '16412345678',
          '17012345678',
          '+4912345678910',
          '+49015123456789',
          '015345678910',
          '015412345678',
        ],
      },
      {
        locale: 'de-AT',
        valid: [
          '+436761234567',
          '06761234567',
          '00436123456789',
          '+436123456789',
          '01999',
          '+4372876',
          '06434908989562345',
        ],
        invalid: [
          '167612345678',
          '1234',
          '064349089895623459',
        ],
      },
      {
        locale: 'hu-HU',
        valid: [
          '06301234567',
          '+36201234567',
          '06701234567',
        ],
        invalid: [
          '1234',
          '06211234567',
          '+3620123456',
        ],
      },
      {
        locale: 'mz-MZ',
        valid: [
          '+258849229754',
          '258849229754',
          '849229754',
          '829229754',
          '839229754',
          '869229754',
          '859229754',
          '869229754',
          '879229754',
          '+258829229754',
          '+258839229754',
          '+258869229754',
          '+258859229754',
          '+258869229754',
          '+258879229754',
          '258829229754',
          '258839229754',
          '258869229754',
          '258859229754',
          '258869229754',
          '258879229754',
        ],
        invalid: [
          '+248849229754',
          '158849229754',
          '249229754',
          '819229754',
          '899229754',
          '889229754',
          '89229754',
          '8619229754',
          '87922975411',
          '257829229754',
          '+255839229754',
          '+2258869229754',
          '+1258859229754',
          '+2588692297541',
          '+2588792519754',
          '25882922975411',
        ],
      },
      {
        locale: 'pt-BR',
        valid: [
          '+55 12 996551215',
          '+55 15 97661234',
          '+55 (12) 996551215',
          '+55 (15) 97661234',
          '55 (17) 96332-2155',
          '55 (17) 6332-2155',
          '55 15 976612345',
          '55 15 75661234',
          '+5512984567890',
          '+551283456789',
          '5512984567890',
          '551283456789',
          '015994569878',
          '01593456987',
          '022995678947',
          '02299567894',
          '(22)99567894',
          '(22)9956-7894',
          '(22) 99567894',
          '(22) 9956-7894',
          '(22)999567894',
          '(22)99956-7894',
          '(22) 999567894',
          '(22) 99956-7894',
          '(11) 94123-4567',
          '(11) 91431-4567',
          '+55 (11) 91431-4567',
          '+55 11 91431-4567',
          '+551191431-4567',
          '5511914314567',
          '5511912345678',
        ],
        invalid: [
          '0819876543',
          '+55 15 7566123',
          '+017 123456789',
          '5501599623874',
          '+55012962308',
          '+55 015 1234-3214',
          '+55 11 90431-4567',
          '+55 (11) 90431-4567',
          '+551190431-4567',
          '5511904314567',
          '5511902345678',
          '(11) 90431-4567',
        ],
      },
      {
        locale: 'zh-CN',
        valid: [
          '13523333233',
          '13838389438',
          '14899230918',
          '14999230918',
          '15323456787',
          '15052052020',
          '16237108167',
          '008616238234822',
          '+8616238234822',
          '16565600001',
          '17269427292',
          '17469427292',
          '18199617480',
          '19151751717',
          '19651751717',
          '+8613238234822',
          '+8613487234567',
          '+8617823492338',
          '+8617823492338',
          '+8616637108167',
          '+8616637108167',
          '+8616712341234',
          '+8619912341234',
          '+8619812341234',
          '+8619712341234',
          '+8619612341234',
          '+8619512341234',
          '+8619312341234',
          '+8619212341234',
          '+8619112341234',
          '+8617269427292',
          '008618812341234',
          '008618812341234',
          '008617269427292',
          // Reserve number segments in the future.
          '92138389438',
          '+8692138389438',
          '008692138389438',
          '98199649964',
          '+8698099649964',
          '008698099649964',
        ],
        invalid: [
          '12345',
          '',
          '12038389438',
          '12838389438',
          '013838389438',
          '+86-13838389438',
          '+08613811211114',
          '+008613811211114',
          '08613811211114',
          '0086-13811211114',
          '0086-138-1121-1114',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
        ],
      },
      {
        locale: 'zh-TW',
        valid: [
          '0987123456',
          '+886987123456',
          '886987123456',
          '+886-987123456',
          '886-987123456',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '0-987123456',
        ],
      },
      {
        local: 'en-LS',
        valid: [
          '+26622123456',
          '+26628123456',
          '+26657123456',
          '+26658123456',
          '+26659123456',
          '+26627123456',
          '+26652123456',
        ],
        invalid: [
          '+26612345678',
          '',
          '2664512-21',
          '+2662212345678',
          'someString',
        ],
      },
      {
        locale: 'en-BM',
        valid: [
          '+14417974653',
          '14413986653',
          '4415370973',
          '+14415005489',
        ],
        invalid: [
          '85763287',
          '+14412020436',
          '+14412236546',
          '+14418245567',
          '+14416546789',
          '44087635627',
          '+4418970973',
          '',
          '+1441897465',
          '+1441897465 additional invalid string part',
        ],
      },
      {
        locale: 'en-BS',
        valid: [
          '+12421231234',
          '2421231234',
          '+1-2421231234',
          '+1-242-123-1234',
          '(242)-123-1234',
          '+1 (242)-123-1234',
          '242 123-1234',
          '(242) 123 1234',
        ],
        invalid: [
          '85763287',
          '+1 242 12 12 12 12',
          '+1424123123',
          '+14418245567',
          '+14416546789',
          'not a number',
          '',
        ],
      },
      {
        locale: 'en-ZA',
        valid: [
          '0821231234',
          '+27821231234',
          '27821231234',
        ],
        invalid: [
          '082123',
          '08212312345',
          '21821231234',
          '+21821231234',
          '+0821231234',
        ],
      },
      {
        locale: 'en-AU',
        valid: [
          '61404111222',
          '+61411222333',
          '0417123456',
        ],
        invalid: [
          '082123',
          '08212312345',
          '21821231234',
          '+21821231234',
          '+0821231234',
          '04123456789',
        ],
      },
      {
        locale: 'es-BO',
        valid: [
          '+59175553635',
          '+59162223685',
          '+59179783890',
          '+59160081890',
          '79783890',
          '60081890',
        ],
        invalid: [
          '082123',
          '08212312345',
          '21821231234',
          '+21821231234',
          '+59199783890',
        ],
      },
      {
        locale: 'en-GG',
        valid: [
          '+441481123456',
          '+441481789123',
          '441481123456',
          '441481789123',
        ],
        invalid: [
          '999',
          '+441481123456789',
          '+447123456789',
        ],
      },
      {
        locale: 'en-GH',
        valid: [
          '0202345671',
          '0502345671',
          '0242345671',
          '0542345671',
          '0532345671',
          '0272345671',
          '0572345671',
          '0262345671',
          '0562345671',
          '0232345671',
          '0282345671',
          '+233202345671',
          '+233502345671',
          '+233242345671',
          '+233542345671',
          '+233532345671',
          '+233272345671',
          '+233572345671',
          '+233262345671',
          '+233562345671',
          '+233232345671',
          '+233282345671',
          '+233592349493',
          '0550298219',
        ],
        invalid: [
          '082123',
          '232345671',
          '0292345671',
          '+233292345671',
        ],
      },
      {
        locale: 'en-GY',
        valid: [
          '+5926121234',
          '06121234',
          '06726381',
          '+5926726381',
        ],
        invalid: [
          '5926121234',
          '6121234',
          '+592 6121234',
          '05926121234',
          '+592-6121234',
        ],
      },
      {
        locale: 'en-HK',
        valid: [
          '91234567',
          '9123-4567',
          '61234567',
          '51234567',
          '+85291234567',
          '+852-91234567',
          '+852-9123-4567',
          '+852 9123 4567',
          '9123 4567',
          '852-91234567',
        ],
        invalid: [
          '999',
          '+852-912345678',
          '123456789',
          '+852-1234-56789',
        ],
      },
      {
        locale: 'en-MO',
        valid: [
          '61234567',
          '+85361234567',
          '+853-61234567',
          '+853-6123-4567',
          '+853 6123 4567',
          '6123 4567',
          '853-61234567',
        ],
        invalid: [
          '999',
          '12345678',
          '612345678',
          '+853-12345678',
          '+853-22345678',
          '+853-82345678',
          '+853-612345678',
          '+853-1234-5678',
          '+853 1234 5678',
          '+853-6123-45678',
        ],
      },
      {
        locale: 'en-IE',
        valid: [
          '+353871234567',
          '353831234567',
          '353851234567',
          '353861234567',
          '353871234567',
          '353881234567',
          '353891234567',
          '0871234567',
          '0851234567',
        ],
        invalid: [
          '999',
          '+353341234567',
          '+33589484858',
          '353841234567',
          '353811234567',
        ],
      },
      {
        locale: 'en-JM',
        valid: [
          '+8761021234',
          '8761211234',
          '8763511274',
          '+8764511274',
        ],
        invalid: [
          '999',
          '+876102123422',
          '+8861021234',
          '8761021212213',
          '876102123',
        ],
      },
      {
        locale: 'en-KE',
        valid: [
          '+254728590432',
          '+254733875610',
          '254728590234',
          '0733346543',
          '0700459022',
          '0110934567',
          '+254110456794',
          '254198452389',
        ],
        invalid: [
          '999',
          '+25489032',
          '123456789',
          '+254800723845',
        ],
      },
      {
        locale: 'fr-CF',
        valid: [
          '+23670850000',
          '+23675038756',
          '+23677859002',
          '+23672854202',
          '+23621854052',
          '+23622854072',
          '72234650',
          '70045902',
          '77934567',
          '21456794',
          '22452389',
        ],
        invalid: [
          '+23689032',
          '123456789',
          '+236723845987',
          '022452389',
          '+236772345678',
          '+236700456794',

        ],
      },
      {
        locale: 'en-KI',
        valid: [
          '+68673140000',
          '68673059999',
          '+68663000000',
          '68663019999',
        ],
        invalid: [
          '+68653000000',
          '68664019999',
          '+68619019999',
          '686123456789',
          '+686733445',
        ],
      },
      {
        locale: 'en-MT',
        valid: [
          '+35699000000',
          '+35679000000',
          '99000000',
        ],
        invalid: [
          '356',
          '+35699000',
          '+35610000000',
        ],
      },
      {
        locale: 'en-PH',
        valid: [
          '+639275149120',
          '+639275142327',
          '+639003002023',
          '09275149116',
          '09194877624',
        ],
        invalid: [
          '12112-13-345',
          '12345678901',
          'sx23YW11cyBmZxxXJt123123',
          '010-38238383',
          '966684123123-2590',
        ],
      },
      {
        locale: 'en-UG',
        valid: [
          '+256728590432',
          '+256733875610',
          '256728590234',
          '0773346543',
          '0700459022',
        ],
        invalid: [
          '999',
          '+254728590432',
          '+25489032',
          '123456789',
          '+254800723845',
        ],
      },
      {
        locale: 'en-RW',
        valid: [
          '+250728590432',
          '+250733875610',
          '250738590234',
          '0753346543',
          '0780459022',
        ],
        invalid: [
          '999',
          '+254728590432',
          '+25089032',
          '123456789',
          '+250800723845',
        ],
      },
      {
        locale: 'en-TZ',
        valid: [
          '+255728590432',
          '+255733875610',
          '255628590234',
          '0673346543',
          '0600459022',
        ],
        invalid: [
          '999',
          '+254728590432',
          '+25589032',
          '123456789',
          '+255800723845',
        ],
      },
      {
        locale: 'en-MW',
        valid: [
          '+265994563785',
          '+265111785436',
          '+265318596857',
          '0320008744',
          '01256258',
          '0882541896',
          '+265984563214',
        ],
        invalid: [
          '58563',
          '+2658256258',
          '0896328741',
          '0708574896',
          '+26570857489635',
        ],
      },
      {
        locale: 'es-PE',
        valid: [
          '+51912232764',
          '+51923464567',
          '+51968267382',
          '+51908792973',
          '974980472',
          '908792973',
          '+51974980472',
        ],
        invalid: [
          '999',
          '+51812232764',
          '+5181223276499',
          '+25589032',
          '123456789',
        ],
      },
      {
        locale: 'fr-FR',
        valid: [
          '0612457898',
          '+33612457898',
          '33612457898',
          '0712457898',
          '+33712457898',
          '33712457898',
        ],
        invalid: [
          '061245789',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+34612457898',
          '+336124578980',
          '+3361245789',
        ],
      },
      {
        locale: 'fr-BF',
        valid: [
          '+22661245789',
          '+22665903092',
          '+22672457898',
          '+22673572346',
          '061245789',
          '071245783',
        ],
        invalid: [
          '0612457892',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+22762457898',
          '+226724578980',
          '+22634523',
        ],
      },
      {
        locale: 'fr-BJ',
        valid: [
          '+22920215789',
          '+22920293092',
          '+22921307898',
          '+22921736346',
          '+22922416346',
          '+22923836346',
        ],
        invalid: [
          '0612457892',
          '01122921737346',
          '+22762457898',
          '+226724578980',
          '+22634523',
        ],
      },
      {
        locale: 'fr-CA',
        valid: ['19876543210', '8005552222', '+15673628910'],
        invalid: [
          '564785',
          '0123456789',
          '1437439210',
          '+10345672645',
          '11435213543',
        ],
      },
      {
        locale: 'fr-CD',
        valid: [
          '+243818590432',
          '+243893875610',
          '243978590234',
          '0813346543',
          '0820459022',
          '+243902590221',
        ],
        invalid: [
          '243',
          '+254818590432',
          '+24389032',
          '123456789',
          '+243700723845',
        ],
      },
      {
        locale: 'fr-GF',
        valid: [
          '0612457898',
          '+594612457898',
          '594612457898',
          '0712457898',
          '+594712457898',
          '594712457898',
        ],
        invalid: [
          '061245789',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+54612457898',
          '+5946124578980',
          '+59461245789',
        ],
      },
      {
        locale: 'fr-GP',
        valid: [
          '0612457898',
          '+590612457898',
          '590612457898',
          '0712457898',
          '+590712457898',
          '590712457898',
        ],
        invalid: [
          '061245789',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+594612457898',
          '+5906124578980',
          '+59061245789',
        ],
      },
      {
        locale: 'fr-MQ',
        valid: [
          '0612457898',
          '+596612457898',
          '596612457898',
          '0712457898',
          '+596712457898',
          '596712457898',
        ],
        invalid: [
          '061245789',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+594612457898',
          '+5966124578980',
          '+59661245789',
        ],
      },
      {
        locale: 'fr-RE',
        valid: [
          '0612457898',
          '+262612457898',
          '262612457898',
          '0712457898',
          '+262712457898',
          '262712457898',
        ],
        invalid: [
          '061245789',
          '06124578980',
          '0112457898',
          '0212457898',
          '0312457898',
          '0412457898',
          '0512457898',
          '0812457898',
          '0912457898',
          '+264612457898',
          '+2626124578980',
          '+26261245789',
        ],
      },
      {
        locale: 'fr-PF',
        valid: [
          '87123456',
          '88123456',
          '89123456',
          '+68987123456',
          '+68988123456',
          '+68989123456',
          '68987123456',
          '68988123456',
          '68989123456',
        ],
        invalid: [
          '7123456',
          '86123456',
          '87 12 34 56',
          'definitely not a number',
          '01+68988123456',
          '6898912345',
        ],
      },
      {
        locale: 'fr-WF',
        valid: [
          '+681408500',
          '+681499387',
          '+681728590',
          '+681808542',
          '+681828540',
          '+681832014',
          '408500',
          '499387',
          '728590',
          '808542',
          '828540',
          '832014',
        ],
        invalid: [
          '+68189032',
          '123456789',
          '+681723845987',
          '022452389',
          '+681772345678',
          '+681700456794',

        ],
      },
      {
        locale: 'ka-GE',
        valid: [
          '+995500011111',
          '+995515352134',
          '+995798526662',
          '798526662',
          '500011119',
          '798526662',
          '+995799766525',
        ],
        invalid: [
          '+99550001111',
          '+9957997665250',
          '+9959997665251',
          '+995780011111',
          '20000000000',
          '68129485729',
          '6589394827',
          '298RI89572',
        ],
      },
      {
        locale: 'el-GR',
        valid: [
          '+306944848966',
          '306944848966',
          '06904567890',
          '6944848966',
          '6904567890',
          '6914567890',
          '6934567890',
          '6944567890',
          '6954567890',
          '6974567890',
          '6984567890',
          '6994567890',
          '6854567890',
          '6864567890',
          '6874567890',
          '6884567890',
          '6894567890',
        ],
        invalid: [
          '2102323234',
          '+302646041461',
          '120000000',
          '20000000000',
          '68129485729',
          '6589394827',
          '298RI89572',
          '6924567890',
          '6964567890',
          '6844567890',
          '690456789',
          '00690456789',
          'not a number',
        ],
      },
      {
        locale: 'el-CY',
        valid: [
          '96546247',
          '96978927',
          '+35799837145',
          '+35799646792',
          '96056927',
          '99629593',
          '99849980',
          '3599701619',
          '+3599148725',
          '96537247',
          '3596676533',
          '+35795123455',
          '+35797012204',
          '35799123456',
          '+35794123456',
          '+35796123456',
        ],
        invalid: [
          '',
          'somechars',
          '9697892',
          '998499803',
          '33799837145',
          '+3799646792',
          '93056927',
        ],
      },
      {
        locale: 'en-GB',
        valid: [
          '447789345856',
          '+447861235675',
          '07888814488',
        ],
        invalid: [
          '67699567',
          '0773894868',
          '077389f8688',
          '+07888814488',
          '0152456999',
          '442073456754',
          '+443003434751',
          '05073456754',
          '08001123123',
          '07043425232',
          '01273884231',
          '03332654034',
        ],
      },
      {
        locale: 'en-SG',
        valid: [
          '32891278',
          '87654321',
          '98765432',
          '+6587654321',
          '+6598765432',
          '+6565241234',
        ],
        invalid: [
          '332891231',
          '987654321',
          '876543219',
          '8765432',
          '9876543',
          '12345678',
          '+98765432',
          '+9876543212',
          '+15673628910',
          '19876543210',
          '8005552222',
        ],
      },
      {
        locale: 'en-US',
        valid: [
          '19876543210',
          '8005552222',
          '+15673628910',
          '+1(567)3628910',
          '+1(567)362-8910',
          '+1(567) 362-8910',
          '1(567)362-8910',
          '1(567)362 8910',
          '223-456-7890',
        ],
        invalid: [
          '564785',
          '0123456789',
          '1437439210',
          '+10345672645',
          '11435213543',
          '1(067)362-8910',
          '1(167)362-8910',
          '+2(267)362-8910',
          '+3365520145',
        ],
      },
      {
        locale: 'en-CA',
        valid: ['19876543210', '8005552222', '+15673628910'],
        invalid: [
          '564785',
          '0123456789',
          '1437439210',
          '+10345672645',
          '11435213543',
        ],
      },
      {
        locale: 'en-ZM',
        valid: [
          '0956684590',
          '0966684590',
          '0976684590',
          '+260956684590',
          '+260966684590',
          '+260976684590',
          '260976684590',
          '+260779493521',
          '+260760010936',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '966684590',
          '760010936',
        ],
      },
      {
        locale: ['en-ZW'],
        valid: [
          '+263561890123',
          '+263715558041',
          '+263775551112',
          '+263775551695',
          '+263715556633',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+2631234567890',
          '+2641234567',
          '+263981234',
          '4736338855',
          '66338855',
        ],
      },
      {
        locale: ['en-NA'],
        valid: [
          '+26466189012',
          '+26461555804',
          '+26461434221',
          '+26487555169',
          '+26481555663',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+2641234567890',
          '+2641234567',
          '+2648143422',
          '+264981234',
          '4736338855',
          '66338855',
        ],
      },
      {
        locale: 'ru-RU',
        valid: [
          '+79676338855',
          '79676338855',
          '89676338855',
          '9676338855',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
        ],
      },
      {
        locale: 'si-LK',
        valid: [
          '+94766661206',
          '94713114340',
          '0786642116',
          '078 7642116',
          '078-7642116',
          '0749994567',
        ],
        invalid: [
          '9912349956789',
          '12345',
          '1678123456',
          '0731234567',
          '0797878674',
        ],
      },
      {
        locale: 'sr-RS',
        valid: [
          '0640133338',
          '063333133',
          '0668888878',
          '+381645678912',
          '+381611314000',
          '0655885010',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
        ],
      },
      {
        locale: 'en-NZ',
        valid: [
          '+6427987035',
          '642240512347',
          '0293981646',
          '029968425',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+642956696123566',
          '+02119620856',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
        ],
      },
      {
        locale: 'en-MU',
        valid: [
          '+23012341234',
          '12341234',
          '012341234',
        ],
        invalid: [
          '41234',
          '',
          '+230',
          '+2301',
          '+23012',
          '+230123',
          '+2301234',
          '+23012341',
          '+230123412',
          '+2301234123',
          '+230123412341',
          '+2301234123412',
          '+23012341234123',
        ],
      },
      {
        locale: ['nb-NO', 'nn-NO'], // for multiple locales
        valid: [
          '+4796338855',
          '+4746338855',
          '4796338855',
          '4746338855',
          '46338855',
          '96338855',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+4676338855',
          '19676338855',
          '+4726338855',
          '4736338855',
          '66338855',
        ],
      },
      {
        locale: ['ne-NP'],
        valid: [
          '+9779817385479',
          '+9779717385478',
          '+9779862002615',
          '+9779853660020',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+97796123456789',
          '+9771234567',
          '+977981234',
          '4736338855',
          '66338855',
        ],
      },
      {
        locale: 'vi-VN',
        valid: [
          '0336012403',
          '+84586012403',
          '84981577798',
          '0708001240',
          '84813601243',
          '0523803765',
          '0863803732',
          '0883805866',
          '0892405867',
          '+84888696413',
          '0878123456',
          '84781234567',
          '0553803765',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '260976684590',
          '01678912345',
          '+841698765432',
          '841626543219',
          '0533803765',
          '08712345678',
          '+0321234567',
        ],
      },
      {
        locale: 'es-AR',
        valid: [
          '5491143214321',
          '+5491143214321',
          '+5492414321432',
          '5498418432143',
        ],
        invalid: [
          '1143214321',
          '91143214321',
          '+91143214321',
          '549841004321432',
          '549 11 43214321',
          '549111543214321',
          '5714003425432',
          '549114a214321',
          '54 9 11 4321-4321',
        ],
      },
      {
        locale: 'es-CO',
        valid: [
          '+573003321235',
          '573003321235',
          '3003321235',
          '3213321235',
          '3103321235',
          '3243321235',
          '573011140876',
        ],
        invalid: [
          '1234',
          '+57443875615',
          '57309875615',
          '57109834567',
          '5792434567',
          '5702345689',
          '5714003425432',
          '5703013347567',
          '069834567',
          '969834567',
          '579871235',
          '574321235',
          '5784321235',
          '5784321235',
          '9821235',
          '0698345',
          '3321235',
        ],
      },
      {
        locale: 'es-CL',
        valid: [
          '+56733875615',
          '56928590234',
          '0928590294',
          '0208590294',
        ],
        invalid: [
          '1234',
          '+5633875615',
          '563875615',
          '56109834567',
          '56069834567',
        ],
      },
      {
        locale: 'es-EC',
        valid: [
          '+593987654321',
          '593987654321',
          '0987654321',
          '027332615',
          '+59323456789',
        ],
        invalid: [
          '03321321',
          '+593387561',
          '59312345677',
          '02344635',
          '593123456789',
          '081234567',
          '+593912345678',
          '+593902345678',
          '+593287654321',
          '593287654321',
        ],
      },
      {
        locale: 'es-CR',
        valid: [
          '+50688888888',
          '+50665408090',
          '+50640895069',
          '25789563',
          '85789563',
        ],
        invalid: [
          '+5081',
          '+5067777777',
          '+50188888888',
          '+50e987643254',
          '+506e4t4',
          '-50688888888',
          '50688888888',
          '12345678',
          '98765432',
          '01234567',
        ],
      },
      {
        locale: 'es-CU',
        valid: [
          '+5351234567',
          '005353216547',
          '51234567',
          '53214567',
        ],
        invalid: [
          '1234',
          '+5341234567',
          '0041234567',
          '41234567',
          '11234567',
          '21234567',
          '31234567',
          '60303456',
          '71234567',
          '81234567',
          '91234567',
          '+5343216547',
          '+5332165498',
          '+53121234567',
          '',
          'abc',
          '+535123457',
          '56043029304',
        ],
      },
      {
        locale: 'es-DO',
        valid: [
          '+18096622563',
          '+18295614488',
          '+18495259567',
          '8492283478',
          '8092324576',
          '8292387713',
        ],
        invalid: [
          '+18091',
          '+1849777777',
          '-18296643245',
          '+18086643245',
          '+18396643245',
          '8196643245',
          '+38492283478',
          '6492283478',
          '8192283478',
        ],
      },
      {
        locale: 'es-HN',
        valid: [
          '+50495551876',
          '+50488908787',
          '+50493456789',
          '+50489234567',
          '+50488987896',
          '+50497567389',
          '+50427367389',
          '+50422357389',
          '+50431257389',
          '+50430157389',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+34683456543',
          '65478932',
          '+50298787654',
          '+504989874',
        ],
      },
      {
        locale: 'es-ES',
        valid: [
          '+34654789321',
          '654789321',
          '+34714789321',
          '714789321',
          '+34744789321',
          '744789321',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+3465478932',
          '65478932',
          '+346547893210',
          '6547893210',
          '+3470478932',
          '7047893210',
          '+34854789321',
          '7547893219',
        ],
      },
      {
        locale: 'es-MX',
        valid: [
          '+52019654789321',
          '+52199654789321',
          '+5201965478932',
          '+5219654789321',
          '52019654789321',
          '52199654789321',
          '5201965478932',
          '5219654789321',
          '87654789321',
          '8654789321',
          '0187654789321',
          '18654789321',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+3465478932',
          '65478932',
          '+346547893210',
          '+34704789321',
          '704789321',
          '+34754789321',
        ],
      },
      {
        locale: 'es-NI',
        valid: [
          '+5051234567',
          '+50512345678',
          '5051234567',
          '50512345678',
          '+50555555555',
        ],
        invalid: [
          '1234',
          '',
          '1234567',
          '12345678',
          '+12345678',
          '+505123456789',
          '+50612345678',
          '+50712345678',
          '-50512345678',
        ],
      },
      {
        locale: 'es-PA',
        valid: [
          '+5076784565',
          '+5074321557',
          '5073331112',
          '+50723431212',
        ],
        invalid: [
          '+50755555',
          '+207123456',
          '2001236542',
          '+507987643254',
          '+507jjjghtf',
        ],
      },
      {
        locale: 'es-PY',
        valid: [
          '+595991372649',
          '+595992847352',
          '+595993847593',
          '+595994857473',
          '+595995348532',
          '+595996435231',
          '+595981847362',
          '+595982435452',
          '+595983948502',
          '+595984342351',
          '+595985403481',
          '+595986384012',
          '+595971435231',
          '+595972103924',
          '+595973438542',
          '+595974425864',
          '+595975425843',
          '+595976342546',
          '+595961435234',
          '+595963425043',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '65478932',
          '+59599384712',
          '+5959938471234',
          '+595547893218',
          '+591993546843',
        ],
      },
      {
        locale: 'es-SV',
        valid: [
          '62136634',
          '50361366631',
          '+50361366634',
          '+50361367217',
          '+50361367460',
          '+50371367632',
          '+50371367767',
          '+50371368314',
        ],
        invalid: [
          '+5032136663',
          '21346663',
          '+50321366663',
          '12345',
          'El salvador',
          'this should fail',
          '+5032222',
          '+503 1111 1111',
          '00 +503 1234 5678',
        ],
      },
      {
        locale: 'es-UY',
        valid: [
          '+59899123456',
          '099123456',
          '+59894654321',
          '091111111',
        ],
        invalid: [
          '54321',
          'montevideo',
          '',
          '+598099123456',
          '090883338',
          '099 999 999',
        ],
      },
      {
        locale: 'es-VE',
        valid: [
          '+582125457765',
          '+582125458053',
          '+584125458053',
        ],
        invalid: [
          '+585129934395',
          '+58212993439',
          '',
        ],
      },
      {
        locale: 'et-EE',
        valid: [
          '+372 512 34 567',
          '372 512 34 567',
          '+37251234567',
          '51234567',
          '81234567',
          '+372842345678',
        ],
        invalid: [
          '12345',
          '',
          'NotANumber',
          '+333 51234567',
          '61234567',
          '+51234567',
          '+372 539 57 4',
          '+372 900 1234',
          '12345678',
        ],
      },
      {
        locale: 'pl-PL',
        valid: [
          '+48512689767',
          '+48 56 376 87 47',
          '56 566 78 46',
          '657562855',
          '+48657562855',
          '+48 887472765',
          '+48 56 6572724',
          '+48 67 621 5461',
          '48 67 621 5461',
          '+48 45 621 5461',
        ],
        invalid: [
          '+48  67 621 5461',
          '+55657562855',
          '3454535',
          'teststring',
          '',
          '1800-88-8687',
          '+6019-5830837',
          '357562855',
          '+48 44 621 5461',
        ],
      },
      {
        locale: 'fa-IR',
        valid: [
          '+989123456789',
          '989223456789',
          '09323456789',
          '09021456789',
          '+98-990-345-6789',
          '+98 938 345 6789',
          '0938 345 6789',
        ],
        invalid: [
          '',
          '+989623456789',
          '+981123456789',
          '01234567890',
          '09423456789',
          '09823456789',
          '9123456789',
          '091234567890',
          '0912345678',
          '+98 912 3456 6789',
          '0912 345 678',
        ],
      },
      {
        locale: 'fi-FI',
        valid: [
          '+358505557171',
          '0455571',
          '0505557171',
          '358505557171',
          '04412345',
          '0457 123 45 67',
          '+358457 123 45 67',
          '+358 50 555 7171',
          '0501234',
          '+358501234',
          '050 1234',
        ],
        invalid: [
          '12345',
          '',
          '045557',
          '045555717112312332423423421',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '+3-585-0555-7171',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
          '044123',
          '019123456789012345678901',
        ],
      },
      {
        locale: 'fj-FJ',
        valid: [
          '+6799898679',
          '6793788679',
          '+679 989 8679',
          '679 989 8679',
          '679 3456799',
          '679908 8909',
        ],
        invalid: [
          '12345',
          '',
          '04555792',
          '902w99900030900000000099',
          '8uiuiuhhyy&GUU88d',
          '010-38238383',
          '19676338855',
          '679 9 89 8679',
          '6793 45679',
        ],
      },
      {
        locale: 'ms-MY',
        valid: [
          '+60128228789',
          '+60195830837',
          '+6019-5830837',
          '+6019-5830837',
          '+6010-4357675',
          '+60172012370',
          '0128737867',
          '0172012370',
          '01468987837',
          '01112347345',
          '016-2838768',
          '016 2838768',
        ],
        invalid: [
          '12345',
          '601238788657',
          '088387675',
          '16-2838768',
          '032551433',
          '6088-387888',
          '088-261987',
          '1800-88-8687',
          '088-320000',
          '+01112353576',
          '+0111419752',
        ],
      },
      {
        locale: 'fr-CM',
        valid: [
          '+237677936141',
          '237623456789',
          '+237698124842',
          '237693029202',
        ],
        invalid: [
          'NotANumber',
          '+(703)-572-2920',
          '+237 623 45 67 890',
          '+2379981247429',
        ],
      },
      {
        locale: 'ko-KR',
        valid: [
          '+82-010-1234-5678',
          '+82-10-1234-5678',
          '82-010-1234-5678',
          '82-10-1234-5678',
          '+82 10 1234 5678',
          '010-123-5678',
          '10-1234-5678',
          '+82 10 1234 5678',
          '011 1234 5678',
          '+820112345678',
          '01012345678',
          '+82 016 1234 5678',
          '82 19 1234 5678',
          '+82 010 12345678',
        ],
        invalid: [
          'abcdefghi',
          '+82 10 1234 567',
          '+82 10o 1234 1234',
          '+82 101 1234 5678',
          '+82 10 12 5678',
          '+011 7766 1234',
          '011_7766_1234',
          '+820 11 7766 1234',
        ],
      },
      {
        locale: 'ky-KG',
        valid: [
          '+996553033300',
          '+996 222 123456',
          '+996 500 987654',
          '+996 555 111222',
          '+996 700 333444',
          '+996 770 555666',
          '+996 880 777888',
          '+996 990 999000',
          '+996 995 555666',
          '+996 996 555666',
          '+996 997 555666',
          '+996 998 555666',
        ],
        invalid: [
          '+996 201 123456',
          '+996 312 123456',
          '+996 3960 12345',
          '+996 3961 12345',
          '+996 3962 12345',
          '+996 3963 12345',
          '+996 3964 12345',
          '+996 3965 12345',
          '+996 3966 12345',
          '+996 3967 12345',
          '+996 3968 12345',
          '+996 511 123456',
          '+996 522 123456',
          '+996 561 123456',
          '+996 571 123456',
          '+996 624 123456',
          '+996 623 123456',
          '+996 622 123456',
          '+996 609 123456',
          '+996 100 12345',
          '+996 100 1234567',
          '996 100 123456',
          '0 100 123456',
          '0 100 123abc',
        ],
      },
      {
        locale: 'ja-JP',
        valid: [
          '09012345678',
          '08012345678',
          '07012345678',
          '06012345678',
          '090 1234 5678',
          '+8190-1234-5678',
          '+81 (0)90-1234-5678',
          '+819012345678',
          '+81-(0)90-1234-5678',
          '+81 90 1234 5678',
        ],
        invalid: [
          '12345',
          '',
          '045555717112312332423423421',
          'Vml2YW11cyBmZXJtZtesting123',
          '+3-585-0555-7171',
          '0 1234 5689',
          '16 1234 5689',
          '03_1234_5689',
          '0312345678',
          '0721234567',
          '06 1234 5678',
          '072 123 4567',
          '0729 12 3456',
          '07296 1 2345',
          '072961 2345',
          '03-1234-5678',
          '+81312345678',
          '+816-1234-5678',
          '+81 090 1234 5678',
          '+8109012345678',
          '+81-090-1234-5678',
          '90 1234 5678',
        ],
      },
      {
        locale: 'ir-IR',
        valid: [
          '09023818688',
          '09123809999',
          '+989023818688',
          '+989103923523',
        ],
        invalid: [
          '19023818688',
          '323254',
          '+903232323257',
          '++3567868',
          '0902381888832',
        ],
      },
      {
        locale: 'it-IT',
        valid: [
          '370 3175423',
          '333202925',
          '+39 310 7688449',
          '+39 3339847632',
        ],
        invalid: [
          '011 7387545',
          '12345',
          '+45 345 6782395',
        ],
      },
      {
        locale: 'fr-BE',
        valid: [
          '0470123456',
          '+32470123456',
          '32470123456',
          '0421234567',
          '+32421234567',
          '32421234567',
        ],
        invalid: [
          '12345',
          '+3212345',
          '3212345',
          '04701234567',
          '+3204701234567',
          '3204701234567',
          '0212345678',
          '+320212345678',
          '320212345678',
          '021234567',
          '+3221234567',
          '3221234567',
        ],
      },
      {
        locale: 'nl-BE',
        valid: [
          '0470123456',
          '+32470123456',
          '32470123456',
          '0421234567',
          '+32421234567',
          '32421234567',
        ],
        invalid: [
          '12345',
          '+3212345',
          '3212345',
          '04701234567',
          '+3204701234567',
          '3204701234567',
          '0212345678',
          '+320212345678',
          '320212345678',
          '021234567',
          '+3221234567',
          '3221234567',
        ],
      },
      {
        locale: 'nl-NL',
        valid: [
          '0670123456',
          '0612345678',
          '31612345678',
          '31670123456',
          '+31612345678',
          '+31670123456',
          '+31(0)612345678',
          '0031612345678',
          '0031(0)612345678',
        ],
        invalid: [
          '12345',
          '+3112345',
          '3112345',
          '06701234567',
          '012345678',
          '+3104701234567',
          '3104701234567',
          '0212345678',
          '021234567',
          '+3121234567',
          '3121234567',
          '+310212345678',
          '310212345678',
        ],
      },
      {
        locale: 'nl-AW',
        valid: [
          '2975612345',
          '2976412345',
          '+2975612345',
          '+2975912345',
          '+2976412345',
          '+2977312345',
          '+2977412345',
          '+2979912345',
        ],
        invalid: [
          '12345',
          '+2972345',
          '2972345',
          '06701234567',
          '012345678',
          '+2974701234567',
          '2974701234567',
          '0297345678',
          '029734567',
          '+2971234567',
          '2971234567',
          '+297212345678',
          '297212345678',
          'number',
        ],
      },
      {
        locale: 'ro-MD',
        valid: [
          '+37360375781',
          '+37361945673',
          '+37362387563',
          '+37368447788',
          '+37369000101',
          '+37367568910',
          '+37376758294',
          '+37378457892',
          '+37379067436',
          '37362387563',
          '37368447788',
          '37369000101',
          '37367568910',
        ],
        invalid: [
          '',
          '+37363373381',
          '+37364310581',
          '+37365578199',
          '+37371088636',
          'Vml2YW11cyBmZXJtZtesting123',
          '123456',
          '740123456',
          '+40640123456',
          '+40210123456',
        ],
      },
      {
        locale: 'ro-RO',
        valid: [
          '+40740123456',
          '+40 740123456',
          '+40740 123 456',
          '+40740.123.456',
          '+40740-123-456',
          '40740123456',
          '40 740123456',
          '40740 123 456',
          '40740.123.456',
          '40740-123-456',
          '0740123456',
          '0740/123456',
          '0740 123 456',
          '0740.123.456',
          '0740-123-456',
        ],
        invalid: [
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '123456',
          '740123456',
          '+40640123456',
          '+40210123456',
          '+0765351689',
          '+0711419752',
        ],
      },
      {
        locale: 'id-ID',
        valid: [
          '0811 778 998',
          '0811 7785 9983',
          '0812 7784 9984',
          '0813 7782 9982',
          '0821 1234 1234',
          '0822 1234 1234',
          '0823 1234 1234',
          '0852 1234 6764',
          '0853 1234 6764',
          '0851 1234 6764',
          '0814 7782 9982',
          '0815 7782 9982',
          '0816 7782 9982',
          '0855 7782 9982',
          '0856 7782 9982',
          '0857 7782 9982',
          '0858 7782 9982',
          '0817 7785 9983',
          '0818 7784 9984',
          '0819 7782 9982',
          '0859 1234 1234',
          '0877 1234 1234',
          '0878 1234 1234',
          '0895 7785 9983',
          '0896 7784 9984',
          '0897 7782 9982',
          '0898 1234 1234',
          '0899 1234 1234',
          '0881 7785 9983',
          '0882 7784 9984',
          '0883 7782 9982',
          '0884 1234 1234',
          '0886 1234 1234',
          '0887 1234 1234',
          '0888 7785 9983',
          '0889 7784 9984',
          '0828 7784 9984',
          '0838 7784 9984',
          '0831 7784 9984',
          '0832 7784 9984',
          '0833 7784 9984',
          '089931236181900',
          '62811 778 998',
          '62811778998',
          '628993123618190',
          '62898 740123456',
          '62899 7401 2346',
          '+62811 778 998',
          '+62811778998',
          '+62812 9650 3508',
          '08197231819',
          '085361008008',
          '+62811787391',
        ],
        invalid: [
          '0899312361819001',
          '0217123456',
          '622178878890',
          '6221 740123456',
          '0341 8123456',
          '0778 89800910',
          '0741 123456',
          '+6221740123456',
          '+65740 123 456',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '123456',
          '740123456',
          '+65640123456',
          '+64210123456',
        ],
      },
      {
        locale: 'lt-LT',
        valid: [
          '+37051234567',
          '851234567',
        ],
        invalid: [
          '+65740 123 456',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '123456',
          '740123456',
          '+65640123456',
          '+64210123456',
        ],
      },
      {
        locale: 'uk-UA',
        valid: [
          '+380501234567',
          '+380631234567',
          '+380661234567',
          '+380671234567',
          '+380681234567',
          '+380731234567',
          '+380751234567',
          '+380771234567',
          '+380911234567',
          '+380921234567',
          '+380931234567',
          '+380941234567',
          '+380951234567',
          '+380961234567',
          '+380971234567',
          '+380981234567',
          '+380991234567',
          '380501234567',
          '380631234567',
          '380661234567',
          '380671234567',
          '380681234567',
          '380731234567',
          '380751234567',
          '380771234567',
          '380911234567',
          '380921234567',
          '380931234567',
          '380941234567',
          '380951234567',
          '380961234567',
          '380971234567',
          '380981234567',
          '380991234567',
          '0501234567',
          '0631234567',
          '0661234567',
          '0671234567',
          '0681234567',
          '0731234567',
          '0751234567',
          '0771234567',
          '0911234567',
          '0921234567',
          '0931234567',
          '0941234567',
          '0951234567',
          '0961234567',
          '0971234567',
          '0981234567',
          '0991234567',
        ],
        invalid: [
          '+30982345679',
          '+380321234567',
          '+380441234567',
          '982345679',
          '80982345679',
          '+380 98 234 5679',
          '+380-98-234-5679',
          '+380 (98) 234-56-79',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '123456',
          '740123456',
        ],
      },
      {
        locale: 'uz-UZ',
        valid: [
          '+998664835244',
          '998664835244',
          '664835244',
          '+998957124555',
          '998957124555',
          '957124555',
        ],
        invalid: [
          '+998644835244',
          '998644835244',
          '644835244',
          '+99664835244',
          'ASDFGJKLmZXJtZtesting123',
          '123456789',
          '870123456',
          '',
          '+998',
          '998',
        ],
      },
      {
        locale: 'da-DK',
        valid: [
          '12345678',
          '12 34 56 78',
          '45 12345678',
          '4512345678',
          '45 12 34 56 78',
          '+45 12 34 56 78',
        ],
        invalid: [
          '',
          '+45010203',
          'ASDFGJKLmZXJtZtesting123',
          '123456',
          '12 34 56',
          '123 123 12',
        ],
      },
      {
        locale: 'sv-SE',
        valid: [
          '+46701234567',
          '46701234567',
          '0721234567',
          '073-1234567',
          '0761-234567',
          '079-123 45 67',
        ],
        invalid: [
          '12345',
          '+4670123456',
          '+46301234567',
          '+0731234567',
          '0731234 56',
          '+7312345678',
          '',
        ],
      },
      {
        locale: 'fo-FO',
        valid: [
          '123456',
          '12 34 56',
          '298 123456',
          '298123456',
          '298 12 34 56',
          '+298 12 34 56',
        ],
        invalid: [
          '',
          '+4501020304',
          'ASDFGJKLmZXJtZtesting123',
          '12345678',
          '12 34 56 78',
        ],
      },
      {
        locale: 'kl-GL',
        valid: [
          '123456',
          '12 34 56',
          '299 123456',
          '299123456',
          '299 12 34 56',
          '+299 12 34 56',
        ],
        invalid: [
          '',
          '+4501020304',
          'ASDFGJKLmZXJtZtesting123',
          '12345678',
          '12 34 56 78',
        ],
      },
      {
        locale: 'kk-KZ',
        valid: [
          '+77254716212',
          '77254716212',
          '87254716212',
          '7254716212',
        ],
        invalid: [
          '12345',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '010-38238383',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
        ],
      },
      {
        locale: 'be-BY',
        valid: [
          '+375241234567',
          '+375251234567',
          '+375291234567',
          '+375331234567',
          '+375441234567',
          '375331234567',
        ],
        invalid: [
          '12345',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '010-38238383',
          '+9676338855',
          '19676338855',
          '6676338855',
          '+99676338855',
        ],
      },
      {
        locale: 'th-TH',
        valid: [
          '0912345678',
          '+66912345678',
          '66912345678',
        ],
        invalid: [
          '99123456789',
          '12345',
          '67812345623',
          '081234567891',
        ],
      },
      {
        locale: 'tk-TM',
        valid: [
          '+99312495154',
          '99312130136',
          '+99312918407',
          '99312183399',
          '812391717',
        ],
        invalid: [
          '12345',
          '+99412495154',
          '99412495154',
          '998900066506',
        ],
      },
      {
        locale: 'en-SL',
        valid: [
          '+23274560591',
          '23274560591',
          '074560591',
        ],
        invalid: [
          '0745605912',
          '12345',
          '232745605917',
          '0797878674',
          '23274560591 ',
        ],
      },
      {
        locale: 'en-BW',
        valid: [
          '+26772868545',
          '+26776368790',
          '+26774560512',
          '26774560591',
          '26778560512',
          '74560512',
          '76710284',
        ],
        invalid: [
          '0799375902',
          '12345',
          '+2670745605448',
          '2670745605482',
          '+26779685451',
          '+26770685451',
          '267074560',
          '2670ab5608',
          '+267074560',
          '70560512',
          '79710284',
        ],
      },
      {
        locale: 'az-AZ',
        valid: [
          '+994707007070',
          '0707007070',
          '+994502111111',
          '0505436743',
          '0554328772',
          '0104328772',
          '0993301022',
          '+994776007139',
          '+994106007139',
        ],
        invalid: [
          'wrong-number',
          '',
          '994707007070',
          '++9945005050',
          '556007070',
          '1234566',
          '+994778008080a',
        ],
      },
      {
        locale: 'de-LU',
        valid: [
          '601123456',
          '+352601123456',
        ],
        invalid: [
          'NaN',
          '791234',
          '+352791234',
          '26791234',
          '+35226791234',
          '+112039812',
          '+352703123456',
          '1234',
        ],
      },
      {
        locale: 'it-SM',
        valid: [
          '612345',
          '05496123456',
          '+37861234567',
          '+390549612345678',
          '+37805496123456789',
        ],
        invalid: [
          '61234567890',
          '6123',
          '1234567',
          '+49123456',
          'NotANumber',
        ],
      },
      {
        locale: 'so-SO',
        valid: [
          '+252601234567',
          '+252650101010',
          '+252794567120',
          '252650647388',
          '252751234567',
          '0601234567',
          '0609876543',
        ],
        invalid: [
          '',
          'not a number',
          '+2526012345678',
          '25260123456',
          '+252705555555',
          '+0601234567',
          '06945454545',
        ],
      },
      {
        locale: 'sq-AL',
        valid: [
          '0621234567',
          '0661234567',
          '0671234567',
          '0681234567',
          '0691234567',
          '+355621234567',
          '+355651234567',
          '+355661234567',
          '+355671234567',
          '+355681234567',
          '+355691234567',
        ],
        invalid: [
          '67123456',
          '06712345',
          '067123456',
          '06712345678',
          '0571234567',
          '+3556712345',
          '+35565123456',
          '+35157123456',
          'NotANumber',
        ],
      },
      {
        locale: 'ca-AD',
        valid: [
          '+376312345',
          '312345',
        ],
        invalid: [
          '31234',
          '31234567',
          '512345',
          'NotANumber',
        ],
      },
      {
        locale: 'pt-AO',
        valid: [
          '+244911123432',
          '911123432',
          '244911123432',
        ],
        invalid: [
          '+2449111234321',
          '+244811123432',
          '31234',
          '31234567',
          '512345',
          'NotANumber',
        ],
      },
      {
        locale: 'lv-LV',
        valid: [
          '+37121234567',
          '37121234567',
        ],
        invalid: [
          '+37201234567',
          '+3754321',
          '3712123456',
          '+371212345678',
          'NotANumber',
        ],
      },
      {
        locale: 'mg-MG',
        valid: [
          '+261204269174',
          '261204269174',
          '0204269174',
          '0209269174',
          '0374269174',
          '4269174',
        ],
        invalid: [
          '0261204269174',
          '+261 20 4 269174',
          '+261 20 4269174',
          '020 4269174',
          '204269174',
          '0404269174',
          'NotANumber',
        ],
      },
      {
        locale: 'mn-MN',
        valid: [
          '+97699112222',
          '97696112222',
          '97695112222',
          '01197691112222',
          '0097688112222',
          '+97677112222',
          '+97694112222',
          '+97681112222',
        ],
        invalid: [
          '+97888112222',
          '+97977112222',
          '+97094112222',
          '+97281112222',
          '02297681112222',
        ],
      },
      {
        locale: 'my-MM',
        valid: [
          '+959750202595',
          '09750202595',
          '9750202595',
          '+959260000966',
          '09256000323',
          '09276000323',
          '09426000323',
          '09456000323',
          '09761234567',
          '09791234567',
          '09961234567',
          '09771234567',
          '09660000234',
        ],
        invalid: [
          '59750202595',
          '+9597502025',
          '08943234524',
          '09950000966',
          '959240000966',
          '09246000323',
          '09466000323',
          '09951234567',
          '09801234567',
          '09650000234',
        ],
      },
      {
        locale: 'en-PG',
        valid: [
          '+67570123456',
          '67570123456',
          '+67571123456',
          '+67572123456',
          '+67573123456',
          '+67574123456',
          '+67575123456',
          '+67576123456',
          '+67577123456',
          '+67578123456',
          '+67579123456',
          '+67581123456',
          '+67588123456',
        ],
        invalid: [
          '',
          'not a number',
          '12345',
          '+675123456789',
          '+67580123456',
          '+67569123456',
          '+67582123456',
          '+6757012345',
        ],
      },
      {
        locale: 'en-AG',
        valid: [
          '12687151234',
          '+12687151234',
          '+12684641234',
          '12684641234',
          '+12687211234',
          '+12687302468',
          '+12687642456',
          '+12687763333',
        ],
        invalid: [
          '2687151234',
          '+12687773333',
          '+126846412333',
          '+12684641',
          '+12687123456',
          '+12687633456',
        ],
      },
      {
        locale: 'en-AI',
        valid: [
          '+12642351234',
          '12642351234',
          '+12644612222',
          '+12645366326',
          '+12645376326',
          '+12647246326',
          '+12647726326',
        ],
        invalid: [
          '',
          'not a number',
          '+22642351234',
          '+12902351234',
          '+12642331234',
          '+1264235',
          '22642353456',
          '+12352643456',
        ],
      },
      {
        locale: 'en-KN',
        valid: [
          '+18694699040',
          '18694699040',
          '+18697652917',
          '18697652917',
          '18694658472',
          '+18696622969',
          '+18694882224',
        ],
        invalid: [
          '',
          '+18694238545',
          '+1 8694882224',
          '8694658472',
          '+186946990',
          '+1869469904',
          '1869469904',
        ],
      },
      {
        locale: 'en-PK',
        valid: [
          '+923412877421',
          '+923001234567',
          '00923001234567',
          '923001234567',
          '03001234567',
        ],
        invalid: [
          '+3001234567',
          '+933001234567',
          '+924001234567',
          '+92300123456720',
          '030012345672',
          '30012345673',
          '0030012345673',
          '3001234567',
        ],
      },
      {
        locale: ['tg-TJ'],
        valid: [
          '+992553388551',
          '+992553322551',
          '992553388551',
          '992553322551',
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '+995563388559',
          '+9955633559',
          '19676338855',
          '+992263388505',
          '9923633885',
          '99255363885',
          '66338855',
        ],
      },
      {
        locale: 'dv-MV',
        valid: [
          '+9609112345',
          '+9609958973',
          '+9607258963',
          '+9607958463',
          '9609112345',
          '9609958973',
          '9607212963',
          '9607986963',
          '9112345',
          '9958973',
          '7258963',
          '7958963',
        ],
        invalid: [
          '+96059234567',
          '+96045789',
          '7812463784',
          'NotANumber',
          '+9607112345',
          '+9609012345',
          '+609012345',
          '+96071123456',
          '3412345',
          '9603412345',
        ],
      },
      {
        locale: 'ar-YE',
        valid: [
          '737198225',
          '733111355',
          '+967700990270',
        ],
        invalid: [
          '+5032136663',
          '21346663',
          '+50321366663',
          '12345',
          'Yemen',
          'this should fail',
          '+5032222',
          '+503 1111 1111',
          '00 +503 1234 5678',
        ],
      },
      {
        locale: 'ar-EH',
        valid: [
          '+212-5288-12312',
          '+212-5288 12312',
          '+212 5288 12312',
          '212528912312',
          '+212528912312',
          '+212528812312',
        ],
        invalid: [
          '212528812312123',
          '+212-5290-12312',
          '++212528812312',
          '12345',
          'Wester Sahara',
          'this should fail',
          '212  5288---12312',
          '+503 1111 1111',
          '00 +503 1234 5678',
        ],
      },
      {
        locale: 'fa-AF',
        valid: [
          '0511231231',
          '+93511231231',
          '+93281234567',
        ],
        invalid: [
          '212528812312123',
          '+212-5290-12312',
          '++212528812312',
          '12345',
          'Afghanistan',
          'this should fail',
          '212  5288---12312',
          '+503 1111 1111',
          '00 +503 1234 5678',
        ],
      },
      {
        locale: 'en-SS',
        valid: [
          '+211928530422',
          '+211913384561',
          '+211972879174',
          '+211952379334',
          '0923346543',
          '0950459022',
          '0970934567',
          '211979841238',
          '211929843238',
          '211959840238',
        ],
        invalid: [
          '911',
          '+211999',
          '123456789909',
          'South Sudan',
          '21195 840 238',
          '+211981234567',
          '+211931234567',
          '+211901234567',
          '+211991234567',

        ],
      },
      {
        locale: 'es-GT',
        valid: [
          '+50221234567',
          '+50277654321',
          '50226753421',
          '50272332468',
          '50278984455',
          '+50273472492',
          '71234567',
          '21132398',
        ],
        invalid: [
          '44',
          '+5022712345678',
          '1234567899',
          '502712345678',
          'This should fail',
          '5021931234567',
          '+50281234567',
        ],
      },
      {
        locale: 'mk-MK',
        valid: [
          '+38923234567',
          '38931234567',
          '022123456',
          '22234567',
          '71234567',
          '31234567',
          '+38923091500',
          '80091234',
          '81123456',
          '54123456',
        ],
        invalid: [
          '38912345678',
          '+389123456789',
          '21234567',
          '123456789',
          '+3891234567',
          '700012345',
          '510123456',
          'This should fail',
          '+389123456',
          '389123456',
          '80912345',
        ],
      },
    ];

    let allValid = [];

    fixtures.forEach((fixture) => {
      // to be used later on for validating 'any' locale
      if (fixture.valid) allValid = allValid.concat(fixture.valid);

      if (Array.isArray(fixture.locale)) {
        test({
          validator: 'isMobilePhone',
          valid: fixture.valid,
          invalid: fixture.invalid,
          args: [fixture.locale],
        });
      } else {
        test({
          validator: 'isMobilePhone',
          valid: fixture.valid,
          invalid: fixture.invalid,
          args: [fixture.locale],
        });
      }
    });

    test({
      validator: 'isMobilePhone',
      valid: allValid,
      invalid: [
        '',
        'asdf',
        '1',
        'ASDFGJKLmZXJtZtesting123',
        'Vml2YW11cyBmZXJtZtesting123',
      ],
      args: ['any'],
    });

    // strict mode
    test({
      validator: 'isMobilePhone',
      valid: [
        '+254728530234',
        '+299 12 34 56',
        '+94766660206',
      ],
      invalid: [
        '254728530234',
        '0728530234',
        '+728530234',
        '766667206',
        '0766670206',
      ],
      args: ['any', { strictMode: true }],
    });

    // falsey locale defaults to 'any'
    test({
      validator: 'isMobilePhone',
      valid: allValid,
      invalid: [
        '',
        'asdf',
        '1',
        'ASDFGJKLmZXJtZtesting123',
        'Vml2YW11cyBmZXJtZtesting123',
      ],
      args: [],
    });
  });

  // de-CH, fr-CH, it-CH
  test({
    validator: 'isMobilePhone',
    valid: [
      '+41751112233',
      '+41761112233',
      '+41771112233',
      '+41781112233',
      '+41791112233',
      '+411122112211',
    ],
    invalid: [
      '+41041112233',
    ],
    args: [],
  });


  it('should error on invalid locale', () => {
    test({
      validator: 'isMobilePhone',
      args: [{ locale: ['is-NOT'] }],
      error: [
        '+123456789',
        '012345',
      ],
    });
  });

  it('should validate currency', () => {
    // -$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)
    test({
      validator: 'isCurrency',
      valid: [
        '-$10,123.45',
        '$10,123.45',
        '$10123.45',
        '10,123.45',
        '10123.45',
        '10,123',
        '1,123,456',
        '1123456',
        '1.39',
        '.03',
        '0.10',
        '$0.10',
        '-$0.01',
        '-$.99',
        '$100,234,567.89',
        '$10,123',
        '10,123',
        '-10123',
      ],
      invalid: [
        '1.234',
        '$1.1',
        '$ 32.50',
        '500$',
        '.0001',
        '$.001',
        '$0.001',
        '12,34.56',
        '123456,123,123456',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
      ],
    });

    // -$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        {
          allow_decimal: false,
        },
      ],
      valid: [
        '-$10,123',
        '$10,123',
        '$10123',
        '10,123',
        '10123',
        '10,123',
        '1,123,456',
        '1123456',
        '1',
        '0',
        '$0',
        '-$0',
        '$100,234,567',
        '$10,123',
        '10,123',
        '-10123',
      ],
      invalid: [
        '-$10,123.45',
        '$10,123.45',
        '$10123.45',
        '10,123.45',
        '10123.45',
        '1.39',
        '.03',
        '0.10',
        '$0.10',
        '-$0.01',
        '-$.99',
        '$100,234,567.89',
        '1.234',
        '$1.1',
        '$ 32.50',
        '.0001',
        '$.001',
        '$0.001',
        '12,34.56',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
      ],
    });

    // -$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        {
          require_decimal: true,
        },
      ],
      valid: [
        '-$10,123.45',
        '$10,123.45',
        '$10123.45',
        '10,123.45',
        '10123.45',
        '10,123.00',
        '1.39',
        '.03',
        '0.10',
        '$0.10',
        '-$0.01',
        '-$.99',
        '$100,234,567.89',
      ],
      invalid: [
        '$10,123',
        '10,123',
        '-10123',
        '1,123,456',
        '1123456',
        '1.234',
        '$1.1',
        '$ 32.50',
        '500$',
        '.0001',
        '$.001',
        '$0.001',
        '12,34.56',
        '123456,123,123456',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
      ],
    });

    // -$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        {
          digits_after_decimal: [1, 3],
        },
      ],
      valid: [
        '-$10,123.4',
        '$10,123.454',
        '$10123.452',
        '10,123.453',
        '10123.450',
        '10,123',
        '1,123,456',
        '1123456',
        '1.3',
        '.030',
        '0.100',
        '$0.1',
        '-$0.0',
        '-$.9',
        '$100,234,567.893',
        '$10,123',
        '10,123.123',
        '-10123.1',
      ],
      invalid: [
        '1.23',
        '$1.13322',
        '$ 32.50',
        '500$',
        '.0001',
        '$.01',
        '$0.01',
        '12,34.56',
        '123456,123,123456',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
      ],
    });

    // -$##,###.## with $ required (en-US, en-CA, en-AU, en-NZ, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        {
          require_symbol: true,
        },
      ],
      valid: [
        '-$10,123.45',
        '$10,123.45',
        '$10123.45',
        '$10,123.45',
        '$10,123',
        '$1,123,456',
        '$1123456',
        '$1.39',
        '$.03',
        '$0.10',
        '$0.10',
        '-$0.01',
        '-$.99',
        '$100,234,567.89',
        '$10,123',
        '-$10123',
      ],
      invalid: [
        '1.234',
        '$1.234',
        '1.1',
        '$1.1',
        '$ 32.50',
        ' 32.50',
        '500',
        '10,123,456',
        '.0001',
        '$.001',
        '$0.001',
        '1,234.56',
        '123456,123,123456',
        '$123456,123,123456',
        '123.4',
        '$123.4',
        ',123',
        '$,123',
        '$-,123',
        '$',
        '.',
        '$.',
        ',',
        '$,',
        '00',
        '$00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '$ ',
        '- $',
      ],
    });

    // ¥-##,###.## (zh-CN)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '¥',
          negative_sign_before_digits: true,
        },
      ],
      valid: [
        '123,456.78',
        '-123,456.78',
        '¥6,954,231',
        '¥-6,954,231',
        '¥10.03',
        '¥-10.03',
        '10.03',
        '1.39',
        '.03',
        '0.10',
        '¥-10567.01',
        '¥0.01',
        '¥1,234,567.89',
        '¥10,123',
        '¥-10,123',
        '¥-10,123.45',
        '10,123',
        '10123',
        '¥-100',
      ],
      invalid: [
        '1.234',
        '¥1.1',
        '5,00',
        '.0001',
        '¥.001',
        '¥0.001',
        '12,34.56',
        '123456,123,123456',
        '123 456',
        ',123',
        '¥-,123',
        '',
        ' ',
        '¥',
        '¥-',
        '¥-,.',
        '-',
        '- ¥',
        '-¥',
      ],
    });

    test({
      validator: 'isCurrency',
      args: [
        {
          negative_sign_after_digits: true,
        },
      ],
      valid: [
        '$10,123.45-',
        '$10,123.45',
        '$10123.45',
        '10,123.45',
        '10123.45',
        '10,123',
        '1,123,456',
        '1123456',
        '1.39',
        '.03',
        '0.10',
        '$0.10',
        '$0.01-',
        '$.99-',
        '$100,234,567.89',
        '$10,123',
        '10,123',
        '10123-',
      ],
      invalid: [
        '-123',
        '1.234',
        '$1.1',
        '$ 32.50',
        '500$',
        '.0001',
        '$.001',
        '$0.001',
        '12,34.56',
        '123456,123,123456',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
      ],
    });

    // ¥##,###.## with no negatives (zh-CN)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '¥',
          allow_negatives: false,
        },
      ],
      valid: [
        '123,456.78',
        '¥6,954,231',
        '¥10.03',
        '10.03',
        '1.39',
        '.03',
        '0.10',
        '¥0.01',
        '¥1,234,567.89',
        '¥10,123',
        '10,123',
        '10123',
        '¥100',
      ],
      invalid: [
        '1.234',
        '-123,456.78',
        '¥-6,954,231',
        '¥-10.03',
        '¥-10567.01',
        '¥1.1',
        '¥-10,123',
        '¥-10,123.45',
        '5,00',
        '¥-100',
        '.0001',
        '¥.001',
        '¥-.001',
        '¥0.001',
        '12,34.56',
        '123456,123,123456',
        '123 456',
        ',123',
        '¥-,123',
        '',
        ' ',
        '¥',
        '¥-',
        '¥-,.',
        '-',
        '- ¥',
        '-¥',
      ],
    });

    // R ## ###,## and R-10 123,25 (el-ZA)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: 'R',
          negative_sign_before_digits: true,
          thousands_separator: ' ',
          decimal_separator: ',',
          allow_negative_sign_placeholder: true,
        },
      ],
      valid: [
        '123 456,78',
        '-10 123',
        'R-10 123',
        'R 6 954 231',
        'R10,03',
        '10,03',
        '1,39',
        ',03',
        '0,10',
        'R10567,01',
        'R0,01',
        'R1 234 567,89',
        'R10 123',
        'R 10 123',
        'R 10123',
        'R-10123',
        '10 123',
        '10123',
      ],
      invalid: [
        '1,234',
        'R -10123',
        'R- 10123',
        'R,1',
        ',0001',
        'R,001',
        'R0,001',
        '12 34,56',
        '123456 123 123456',
        ' 123',
        '- 123',
        '123 ',
        '',
        ' ',
        'R',
        'R- .1',
        'R-',
        '-',
        '-R 10123',
        'R00',
        'R -',
        '-R',
      ],
    });

    // -€ ##.###,## (it-IT)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '€',
          thousands_separator: '.',
          decimal_separator: ',',
          allow_space_after_symbol: true,
        },
      ],
      valid: [
        '123.456,78',
        '-123.456,78',
        '€6.954.231',
        '-€6.954.231',
        '€ 896.954.231',
        '-€ 896.954.231',
        '16.954.231',
        '-16.954.231',
        '€10,03',
        '-€10,03',
        '10,03',
        '-10,03',
        '-1,39',
        ',03',
        '0,10',
        '-€10567,01',
        '-€ 10567,01',
        '€ 0,01',
        '€1.234.567,89',
        '€10.123',
        '10.123',
        '-€10.123',
        '€ 10.123',
        '€10.123',
        '€ 10123',
        '10.123',
        '-10123',
      ],
      invalid: [
        '1,234',
        '€ 1,1',
        '50#,50',
        '123,@€ ',
        '€€500',
        ',0001',
        '€ ,001',
        '€0,001',
        '12.34,56',
        '123456.123.123456',
        '€123€',
        '',
        ' ',
        '€',
        ' €',
        '€ ',
        '€€',
        ' 123',
        '- 123',
        '.123',
        '-€.123',
        '123 ',
        '€-',
        '- €',
        '€ - ',
        '-',
        '- ',
        '-€',
      ],
    });

    // -##.###,## € (el-GR)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '€',
          thousands_separator: '.',
          symbol_after_digits: true,
          decimal_separator: ',',
          allow_space_after_digits: true,
        },
      ],
      valid: [
        '123.456,78',
        '-123.456,78',
        '6.954.231 €',
        '-6.954.231 €',
        '896.954.231',
        '-896.954.231',
        '16.954.231',
        '-16.954.231',
        '10,03€',
        '-10,03€',
        '10,03',
        '-10,03',
        '1,39',
        ',03',
        '-,03',
        '-,03 €',
        '-,03€',
        '0,10',
        '10567,01€',
        '0,01 €',
        '1.234.567,89€',
        '10.123€',
        '10.123',
        '10.123€',
        '10.123 €',
        '10123 €',
        '10.123',
        '10123',
      ],
      invalid: [
        '1,234',
        '1,1 €',
        ',0001',
        ',001 €',
        '0,001€',
        '12.34,56',
        '123456.123.123456',
        '€123€',
        '',
        ' ',
        '€',
        ' €',
        '€ ',
        ' 123',
        '- 123',
        '.123',
        '-.123€',
        '-.123 €',
        '123 ',
        '-€',
        '- €',
        '-',
        '- ',
      ],
    });

    // kr. -##.###,## (da-DK)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: 'kr.',
          negative_sign_before_digits: true,
          thousands_separator: '.',
          decimal_separator: ',',
          allow_space_after_symbol: true,
        },
      ],
      valid: [
        '123.456,78',
        '-10.123',
        'kr. -10.123',
        'kr.-10.123',
        'kr. 6.954.231',
        'kr.10,03',
        'kr. -10,03',
        '10,03',
        '1,39',
        ',03',
        '0,10',
        'kr. 10567,01',
        'kr. 0,01',
        'kr. 1.234.567,89',
        'kr. -1.234.567,89',
        '10.123',
        'kr. 10.123',
        'kr.10.123',
        '10123',
        '10.123',
        'kr.-10123',
      ],
      invalid: [
        '1,234',
        'kr.  -10123',
        'kr.,1',
        ',0001',
        'kr. ,001',
        'kr.0,001',
        '12.34,56',
        '123456.123.123456',
        '.123',
        'kr.-.123',
        'kr. -.123',
        '- 123',
        '123 ',
        '',
        ' ',
        'kr.',
        ' kr.',
        'kr. ',
        'kr.-',
        'kr. -',
        'kr. - ',
        ' - ',
        '-',
        '- kr.',
        '-kr.',
      ],
    });

    // kr. ##.###,## with no negatives (da-DK)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: 'kr.',
          allow_negatives: false,
          negative_sign_before_digits: true,
          thousands_separator: '.',
          decimal_separator: ',',
          allow_space_after_symbol: true,
        },
      ],
      valid: [
        '123.456,78',
        '10.123',
        'kr. 10.123',
        'kr.10.123',
        'kr. 6.954.231',
        'kr.10,03',
        'kr. 10,03',
        '10,03',
        '1,39',
        ',03',
        '0,10',
        'kr. 10567,01',
        'kr. 0,01',
        'kr. 1.234.567,89',
        'kr.1.234.567,89',
        '10.123',
        'kr. 10.123',
        'kr.10.123',
        '10123',
        '10.123',
        'kr.10123',
      ],
      invalid: [
        '1,234',
        '-10.123',
        'kr. -10.123',
        'kr. -1.234.567,89',
        'kr.-10123',
        'kr.  -10123',
        'kr.-10.123',
        'kr. -10,03',
        'kr.,1',
        ',0001',
        'kr. ,001',
        'kr.0,001',
        '12.34,56',
        '123456.123.123456',
        '.123',
        'kr.-.123',
        'kr. -.123',
        '- 123',
        '123 ',
        '',
        ' ',
        'kr.',
        ' kr.',
        'kr. ',
        'kr.-',
        'kr. -',
        'kr. - ',
        ' - ',
        '-',
        '- kr.',
        '-kr.',
      ],
    });

    // ($##,###.##) (en-US, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        {
          parens_for_negatives: true,
        },
      ],
      valid: [
        '1,234',
        '(1,234)',
        '($6,954,231)',
        '$10.03',
        '(10.03)',
        '($10.03)',
        '1.39',
        '.03',
        '(.03)',
        '($.03)',
        '0.10',
        '$10567.01',
        '($0.01)',
        '$1,234,567.89',
        '$10,123',
        '(10,123)',
        '10123',
      ],
      invalid: [
        '1.234',
        '($1.1)',
        '-$1.10',
        '$ 32.50',
        '500$',
        '.0001',
        '$.001',
        '($0.001)',
        '12,34.56',
        '123456,123,123456',
        '( 123)',
        ',123',
        '$-,123',
        '',
        ' ',
        '  ',
        '   ',
        '$',
        '$ ',
        ' $',
        ' 123',
        '(123) ',
        '.',
        ',',
        '00',
        '$-',
        '$ - ',
        '$- ',
        ' - ',
        '-',
        '- $',
        '-$',
        '()',
        '( )',
        '(  -)',
        '(  - )',
        '(  -  )',
        '(-)',
        '(-$)',
      ],
    });
    // $##,###.## with no negatives (en-US, en-CA, en-AU, en-HK)
    test({
      validator: 'isCurrency',
      args: [
        { allow_negatives: false },
      ],
      valid: [
        '$10,123.45',
        '$10123.45',
        '10,123.45',
        '10123.45',
        '10,123',
        '1,123,456',
        '1123456',
        '1.39',
        '.03',
        '0.10',
        '$0.10',
        '$100,234,567.89',
        '$10,123',
        '10,123',
      ],
      invalid: [
        '1.234',
        '-1.234',
        '-10123',
        '-$0.01',
        '-$.99',
        '$1.1',
        '-$1.1',
        '$ 32.50',
        '500$',
        '.0001',
        '$.001',
        '$0.001',
        '12,34.56',
        '123456,123,123456',
        '-123456,123,123456',
        '123,4',
        ',123',
        '$-,123',
        '$',
        '.',
        ',',
        '00',
        '$-',
        '$-,.',
        '-',
        '-$',
        '',
        '- $',
        '-$10,123.45',
      ],
    });

    //  R$ ##,###.## (pt_BR)
    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: 'R$',
          require_symbol: true,
          allow_space_after_symbol: true,
          symbol_after_digits: false,
          thousands_separator: '.',
          decimal_separator: ',',
        },
      ],
      valid: [
        'R$ 1.400,00',
        'R$ 400,00',
      ],
      invalid: [
        '$ 1.400,00',
        '$R 1.400,00',
      ],
    });
  });

  it('should validate Ethereum addresses', () => {
    test({
      validator: 'isEthereumAddress',
      valid: [
        '0x0000000000000000000000000000000000000001',
        '0x683E07492fBDfDA84457C16546ac3f433BFaa128',
        '0x88dA6B6a8D3590e88E0FcadD5CEC56A7C9478319',
        '0x8a718a84ee7B1621E63E680371e0C03C417cCaF6',
        '0xFCb5AFB808b5679b4911230Aa41FfCD0cd335b42',
      ],
      invalid: [
        '0xGHIJK05pwm37asdf5555QWERZCXV2345AoEuIdHt',
        '0xFCb5AFB808b5679b4911230Aa41FfCD0cd335b422222',
        '0xFCb5AFB808b5679b4911230Aa41FfCD0cd33',
        '0b0110100001100101011011000110110001101111',
        '683E07492fBDfDA84457C16546ac3f433BFaa128',
        '1C6o5CDkLxjsVpnLSuqRs1UBFozXLEwYvU',
      ],
    });
  });

  it('should validate Bitcoin addresses', () => {
    test({
      validator: 'isBtcAddress',
      valid: [
        '1MUz4VMYui5qY1mxUiG8BQ1Luv6tqkvaiL',
        'mucFNhKMYoBQYUAEsrFVscQ1YaFQPekBpg',
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '2NFUBBRcTJbYc1D4HSCbJhKZp6YCV4PQFpQ',
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd',
        '35bSzXvRKLpHsHMrzb82f617cV4Srnt7hS',
        '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhemt',
        'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        'tb1qxhkl607frtvjsy9nlyeg03lf6fsq947pl2pe82',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
        'tb1pzpelffrdh9ptpaqnurwx30dlewqv57rcxfeetp86hsssk30p4cws38tr9y',
      ],
      invalid: [
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNL0',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLo',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLI',
        '3J98t1WpEZ73CNmQviecrnyiWrnqh0WNLl',
        '4J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '0x56F0B8A998425c53c75C4A303D4eF987533c5597',
        'pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
        '17VZNX1SN5NlKa8UQFxwQbFeFc3iqRYhem',
        'BC1QW508D6QEJXTDG4Y5R3ZARVAYR0C5XW7KV8F3T4',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3291',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329b',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329i',
        'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg329o',
        'BC1P5D7RJQ7G6RDK2YHZKS9SMLAQTEDR4DEKQ08GE8ZTWAC72SFR9RUSXG3297',
        'TB1PZPELFFRDH9PTPAQNURWX30DLEWQV57RCXFEETP86HSSSK30P4CWS38TR9Y',
      ],
    });
  });

  it('should validate booleans', () => {
    test({
      validator: 'isBoolean',
      valid: [
        'true',
        'false',
        '0',
        '1',
      ],
      invalid: [
        '1.0',
        '0.0',
        'true ',
        'False',
        'True',
        'yes',
      ],
    });
  });

  it('should validate booleans with option loose set to true', () => {
    test({
      validator: 'isBoolean',
      args: [
        { loose: true },
      ],
      valid: [
        'true',
        'True',
        'TRUE',
        'false',
        'False',
        'FALSE',
        '0',
        '1',
        'yes',
        'Yes',
        'YES',
        'no',
        'No',
        'NO',
      ],
      invalid: [
        '1.0',
        '0.0',
        'true ',
        ' false',
      ],
    });
  });

  it('should validate ISO 639-1 language codes', () => {
    test({
      validator: 'isISO6391',
      valid: ['ay', 'az', 'ba', 'be', 'bg'],
      invalid: ['aj', 'al', 'pe', 'pf', 'abc', '123', ''],
    });
  });

  const validISO8601 = [
    '2009-12T12:34',
    '2009',
    '2009-05-19',
    '2009-05-19',
    '20090519',
    '2009123',
    '2009-05',
    '2009-123',
    '2009-222',
    '2009-001',
    '2009-W01-1',
    '2009-W51-1',
    '2009-W511',
    '2009-W33',
    '2009W511',
    '2009-05-19',
    '2009-05-19 00:00',
    '2009-05-19 14',
    '2009-05-19 14:31',
    '2009-05-19 14:39:22',
    '2009-05-19T14:39Z',
    '2009-W21-2',
    '2009-W21-2T01:22',
    '2009-139',
    '2009-05-19 14:39:22-06:00',
    '2009-05-19 14:39:22+0600',
    '2009-05-19 14:39:22-01',
    '20090621T0545Z',
    '2007-04-06T00:00',
    '2007-04-05T24:00',
    '2010-02-18T16:23:48.5',
    '2010-02-18T16:23:48,444',
    '2010-02-18T16:23:48,3-06:00',
    '2010-02-18T16:23.4',
    '2010-02-18T16:23,25',
    '2010-02-18T16:23.33+0600',
    '2010-02-18T16.23334444',
    '2010-02-18T16,2283',
    '2009-05-19 143922.500',
    '2009-05-19 1439,55',
    '2009-10-10',
    '2020-366',
    '2000-366',
  ];

  const invalidISO8601 = [
    '200905',
    '2009367',
    '2009-',
    '2007-04-05T24:50',
    '2009-000',
    '2009-M511',
    '2009M511',
    '2009-05-19T14a39r',
    '2009-05-19T14:3924',
    '2009-0519',
    '2009-05-1914:39',
    '2009-05-19 14:',
    '2009-05-19r14:39',
    '2009-05-19 14a39a22',
    '200912-01',
    '2009-05-19 14:39:22+06a00',
    '2009-05-19 146922.500',
    '2010-02-18T16.5:23.35:48',
    '2010-02-18T16:23.35:48',
    '2010-02-18T16:23.35:48.45',
    '2009-05-19 14.5.44',
    '2010-02-18T16:23.33.600',
    '2010-02-18T16,25:23:48,444',
    '2010-13-1',
    'nonsense2021-01-01T00:00:00Z',
    '2021-01-01T00:00:00Znonsense',
  ];

  it('should validate ISO 8601 dates', () => {
    // from http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
    test({
      validator: 'isISO8601',
      valid: validISO8601,
      invalid: invalidISO8601,
    });
  });

  it('should validate ISO 8601 dates, with strict = true (regression)', () => {
    test({
      validator: 'isISO8601',
      args: [
        { strict: true },
      ],
      valid: validISO8601,
      invalid: invalidISO8601,
    });
  });

  it('should validate ISO 8601 dates, with strict = true', () => {
    test({
      validator: 'isISO8601',
      args: [
        { strict: true },
      ],
      valid: [
        '2000-02-29',
        '2009-123',
        '2009-222',
        '2020-366',
        '2400-366',
      ],
      invalid: [
        '2010-02-30',
        '2009-02-29',
        '2009-366',
        '2019-02-31',
      ],
    });
  });

  it('should validate ISO 8601 dates, with strictSeparator = true', () => {
    test({
      validator: 'isISO8601',
      args: [
        { strictSeparator: true },
      ],
      valid: [
        '2009-12T12:34',
        '2009',
        '2009-05-19',
        '2009-05-19',
        '20090519',
        '2009123',
        '2009-05',
        '2009-123',
        '2009-222',
        '2009-001',
        '2009-W01-1',
        '2009-W51-1',
        '2009-W511',
        '2009-W33',
        '2009W511',
        '2009-05-19',
        '2009-05-19T14:39Z',
        '2009-W21-2',
        '2009-W21-2T01:22',
        '2009-139',
        '20090621T0545Z',
        '2007-04-06T00:00',
        '2007-04-05T24:00',
        '2010-02-18T16:23:48.5',
        '2010-02-18T16:23:48,444',
        '2010-02-18T16:23:48,3-06:00',
        '2010-02-18T16:23.4',
        '2010-02-18T16:23,25',
        '2010-02-18T16:23.33+0600',
        '2010-02-18T16.23334444',
        '2010-02-18T16,2283',
        '2009-10-10',
        '2020-366',
        '2000-366',
      ],
      invalid: [
        '200905',
        '2009367',
        '2009-',
        '2007-04-05T24:50',
        '2009-000',
        '2009-M511',
        '2009M511',
        '2009-05-19T14a39r',
        '2009-05-19T14:3924',
        '2009-0519',
        '2009-05-1914:39',
        '2009-05-19 14:',
        '2009-05-19r14:39',
        '2009-05-19 14a39a22',
        '200912-01',
        '2009-05-19 14:39:22+06a00',
        '2009-05-19 146922.500',
        '2010-02-18T16.5:23.35:48',
        '2010-02-18T16:23.35:48',
        '2010-02-18T16:23.35:48.45',
        '2009-05-19 14.5.44',
        '2010-02-18T16:23.33.600',
        '2010-02-18T16,25:23:48,444',
        '2010-13-1',
        '2009-05-19 00:00',
        // Previously valid cases
        '2009-05-19 14',
        '2009-05-19 14:31',
        '2009-05-19 14:39:22',
        '2009-05-19 14:39:22-06:00',
        '2009-05-19 14:39:22+0600',
        '2009-05-19 14:39:22-01',
      ],
    });
  });

  it('should validate ISO 8601 dates, with strict = true and strictSeparator = true (regression)', () => {
    test({
      validator: 'isISO8601',
      args: [
        { strict: true, strictSeparator: true },
      ],
      valid: [
        '2000-02-29',
        '2009-123',
        '2009-222',
        '2020-366',
        '2400-366',
      ],
      invalid: [
        '2010-02-30',
        '2009-02-29',
        '2009-366',
        '2019-02-31',
        '2009-05-19 14',
        '2009-05-19 14:31',
        '2009-05-19 14:39:22',
        '2009-05-19 14:39:22-06:00',
        '2009-05-19 14:39:22+0600',
        '2009-05-19 14:39:22-01',
      ],
    });
  });

  it('should validate ISO 15924 script codes', () => {
    test({
      validator: 'isISO15924',
      valid: [
        'Adlm',
        'Bass',
        'Copt',
        'Dsrt',
        'Egyd',
        'Latn',
        'Zzzz',
      ],
      invalid: [
        '',
        'arab',
        'zzzz',
        'Qaby',
        'Lati',
      ],
    });
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

  it('should validate ISO 3166-1 alpha 2 country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    test({
      validator: 'isISO31661Alpha2',
      valid: [
        'FR',
        'fR',
        'GB',
        'PT',
        'CM',
        'JP',
        'PM',
        'ZW',
        'MM',
        'cc',
        'GG',
      ],
      invalid: [
        '',
        'FRA',
        'AA',
        'PI',
        'RP',
        'WV',
        'WL',
        'UK',
        'ZZ',
      ],
    });
  });

  it('should validate ISO 3166-1 alpha 3 country codes', () => {
    // from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
    test({
      validator: 'isISO31661Alpha3',
      valid: [
        'ABW',
        'HND',
        'KHM',
        'RWA',
      ],
      invalid: [
        '',
        'FR',
        'fR',
        'GB',
        'PT',
        'CM',
        'JP',
        'PM',
        'ZW',
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

  it('should error on non-string input', () => {
    test({
      validator: 'isEmpty',
      error: [undefined, null, [], NaN],
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
      }, {
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
        '35161990910',
        '74407265027',
        '05423994000172',
        '11867044000130'],
      invalid: [
        'ABCDEFGH',
        '170.691.440-72',
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
        'foo',
        'foo-bar',
        'foo_bar',
        'foo-bar-foo',
        'foo-bar_foo',
        'foo-bar_foo*75-b4r-**_foo',
        'foo-bar_foo*75-b4r-**_foo-&&',
      ],
      invalid: [
        'not-----------slug',
        '@#_$@',
        '-not-slug',
        'not-slug-',
        '_not-slug',
        'not-slug_',
        'not slug',
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
        '12·34·AB',
        '12·AB·34',
        'AB 12 CD',
        'AB12CD',
      ],
      invalid: [
        '',
        'notalicenseplate',
        'A1-B2-C3',
        'ABC-1-EF',
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
        'AA123456789',
      ],
      invalid: [
        'FR AA123456789',
        '123456789',
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
