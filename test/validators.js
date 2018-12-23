import { format } from 'util';
import assert from 'assert';
import fs from 'fs';
import vm from 'vm';
import validator from '../index';

let validator_js = fs.readFileSync(require.resolve('../validator.js')).toString();

function test(options) {
  let args = options.args || [];
  args.unshift(null);
  if (options.valid) {
    options.valid.forEach((valid) => {
      args[0] = valid;
      if (validator[options.validator](...args) !== true) {
        let warning = format(
          'validator.%s(%s) failed but should have passed',
          options.validator, args.join(', ')
        );
        throw new Error(warning);
      }
    });
  }
  if (options.invalid) {
    options.invalid.forEach((invalid) => {
      args[0] = invalid;
      if (validator[options.validator](...args) !== false) {
        let warning = format(
          'validator.%s(%s) passed but should have failed',
          options.validator, args.join(', ')
        );
        throw new Error(warning);
      }
    });
  }
}

function repeat(str, count) {
  let result = '';
  for (; count; count--) {
    result += str;
  }
  return result;
}

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
        'some.name.midd.leNa.me+extension@GoogleMail.com',
        '"foobar"@example.com',
        '"  foo  m端ller "@example.com',
        '"foo\\@bar"@example.com',
        `${repeat('a', 64)}@${repeat('a', 63)}.com`,
        `${repeat('a', 64)}@${repeat('a', 63)}.${repeat('a', 63)}.${repeat('a', 63)}.${repeat('a', 58)}.com`,
        `${repeat('a', 64)}@${repeat('a', 63)}.com`,
        `${repeat('a', 31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
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
      ],
    });
  });

  it('should validate email addresses with domain specific validation', () => {
    test({
      validator: 'isEmail',
      args: [{ domain_specific_validation: true }],
      valid: [
        'foo@bar.com',
      ],
      invalid: [
        `${repeat('a', 31)}@gmail.com`,
        'test@gmail.com',
        'test.1@gmail.com',
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

  it('should validate MAC addresses', () => {
    test({
      validator: 'isMACAddress',
      valid: [
        'ab:ab:ab:ab:ab:ab',
        'FF:FF:FF:FF:FF:FF',
        '01:02:03:04:05:ab',
        '01:AB:03:04:05:06',
      ],
      invalid: [
        'abc',
        '01:02:03:04:05',
        '01:02:03:04::ab',
        '1:2:3:4:5:6',
        'AB:CD:EF:GH:01:02',
      ],
    });
  });

  it('should validate MAC addresses without colons', () => {
    test({
      validator: 'isMACAddress',
      args: [{
        no_colons: true,
      }],
      valid: [
        'abababababab',
        'FFFFFFFFFFFF',
        '0102030405ab',
        '01AB03040506',
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
      ],
    });
  });

  it('should validate IP addresses', () => {
    test({
      validator: 'isIP',
      valid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '2001:41d0:2:a141::1',
        '::ffff:127.0.0.1',
        '::0000',
        '0000::',
        '1::',
        '1111:1:1:1:1:1:1:1',
        'fe80::a6db:30ff:fe98:e946',
        '::',
        '::ffff:127.0.0.1',
        '0:0:0:0:0:ffff:127.0.0.1',
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '0.0.0.256',
        '26.0.0.256',
        '0200.200.200.200',
        '200.0200.200.200',
        '200.200.0200.200',
        '200.200.200.0200',
        '::banana',
        'banana::',
        '::1banana',
        '::1::',
        '1:',
        ':1',
        ':1:1:1::2',
        '1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1',
        '::11111',
        '11111:1:1:1:1:1:1:1',
        '2001:db8:0000:1:1:1:1::1',
        '0:0:0:0:0:0:ffff:127.0.0.1',
        '0:0:0:0:ffff:127.0.0.1',
      ],
    });
    test({
      validator: 'isIP',
      args: [4],
      valid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
      ],
      invalid: [
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1',
      ],
    });
    test({
      validator: 'isIP',
      args: [6],
      valid: [
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1',
      ],
      invalid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::ffff:287.0.0.1',
      ],
    });
    test({
      validator: 'isIP',
      args: [10],
      valid: [],
      invalid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::1',
        '2001:db8:0000:1:1:1:1:1',
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
      ],
      invalid: [
        '127.200.230.1/35',
        '127.200.230.1/-1',
        '1.1.1.1/011',
        '::1/64',
        '1.1.1/24.1',
        '1.1.1.1/01',
        '1.1.1.1/1.1',
        '1.1.1.1/1.',
        '1.1.1.1/1/1',
        '1.1.1.1',
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
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '_.com',
        '*.some.com',
        's!ome.com',
        'domain.com/',
        '/more.com',
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

  it('should error on invalid locale', () => {
    try {
      validator.isAlphanumeric('abc123', 'in-INVALID');
      assert(false);
    } catch (err) {
      assert(true);
    }
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
        'foo',
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
  });

  it('should validate hexadecimal strings', () => {
    test({
      validator: 'isHexadecimal',
      valid: [
        'deadBEEF',
        'ff0044',
      ],
      invalid: [
        'abcdefg',
        '',
        '..',
      ],
    });
  });

  it('should validate hexadecimal color strings', () => {
    test({
      validator: 'isHexColor',
      valid: [
        '#ff0034',
        '#CCCCCC',
        'fff',
        '#f00',
      ],
      invalid: [
        '#ff',
        'fff0',
        '#ff12FG',
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
    test({
      validator: 'isHash',
      args: ['md5', 'md4', 'ripemd128', 'tiger128'],
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
    test({
      validator: 'isHash',
      args: ['crc32', 'crc32b'],
      valid: [
        'd94f3f01',
        '751adbc5',
        '88dae00e',
        '0bf1c350',
      ],
      invalid: [
        'KYT0bf1c35032a71a14c2f719e5a14c1',
        'q94375dj93458w34',
        'q943',
        '39485729348',
        '%&FHKJFvk',
      ],
    });
    test({
      validator: 'isHash',
      args: ['sha1', 'tiger160', 'ripemd160'],
      valid: [
        '3ca25ae354e192b26879f651a51d92aa8a34d8d3',
        'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        'beb8c3f30da46be179b8df5f5ecb5e4b10508230',
        'efd5d3b190e893ed317f38da2420d63b7ae0d5ed',
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
      args: ['sha256'],
      valid: [
        '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        '1d996e033d612d9af2b44b70061ee0e868bfd14c2dd90b129e1edeb7953e7985',
        '80f70bfeaed5886e33536bcfa8c05c60afef5a0e48f699a7912d5e399cdcc441',
        '579282cfb65ca1f109b78536effaf621b853c9f7079664a3fbe2b519f435898c',
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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ', // No signature
      ],
      invalid: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        '$Zs.ewu.su84',
        'ks64$S/9.dy$§kz.3sd73b',
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
      args: [{ max: 0 }],
      valid: [''],
      invalid: ['a', 'ab'],
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

  it('should validate UUIDs', () => {
    test({
      validator: 'isUUID',
      valid: [
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
      ],
    });
    test({
      validator: 'isUUID',
      args: [3],
      valid: [
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        '934859',
        'AAAAAAAA-1111-1111-AAAG-111111111111',
        'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
        'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
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

  it('should validate dates against a start date', () => {
    test({
      validator: 'isAfter',
      args: ['2011-08-03'],
      valid: ['2011-08-04', new Date(2011, 8, 10).toString()],
      invalid: ['2010-07-02', '2011-08-03', new Date(0).toString(), 'foo'],
    });
    test({
      validator: 'isAfter',
      valid: ['2100-08-04', new Date(Date.now() + 86400000).toString()],
      invalid: ['2010-07-02', new Date(0).toString()],
    });
    test({
      validator: 'isAfter',
      args: ['2011-08-03'],
      valid: ['2015-09-17'],
      invalid: ['invalid date'],
    });
    test({
      validator: 'isAfter',
      args: ['invalid date'],
      invalid: ['invalid date', '2015-09-17'],
    });
  });

  it('should validate dates against an end date', () => {
    test({
      validator: 'isBefore',
      args: ['08/04/2011'],
      valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
      invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
    });
    test({
      validator: 'isBefore',
      args: [new Date(2011, 7, 4).toString()],
      valid: ['2010-07-02', '2010-08-04', new Date(0).toString()],
      invalid: ['08/04/2011', new Date(2011, 9, 10).toString()],
    });
    test({
      validator: 'isBefore',
      valid: [
        '2000-08-04',
        new Date(0).toString(),
        new Date(Date.now() - 86400000).toString(),
      ],
      invalid: ['2100-07-02', new Date(2217, 10, 10).toString()],
    });
    test({
      validator: 'isBefore',
      args: ['2011-08-03'],
      valid: ['1999-12-31'],
      invalid: ['invalid date'],
    });
    test({
      validator: 'isBefore',
      args: ['invalid date'],
      invalid: ['invalid date', '1999-12-31'],
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
      ],
    });
  });

  it('should validate identity cards', () => {
    const fixtures = [
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
    ];

    let allValid = [];
    let allInvalid = [];

    // Test fixtures
    fixtures.forEach((fixture) => {
      if (fixture.valid) allValid = allValid.concat(fixture.valid);
      if (fixture.invalid) allInvalid = allInvalid.concat(fixture.invalid);
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
        ...allInvalid,
      ],
      args: ['any'],
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
      ],
      invalid: [
        'DE000BAY0018',
        'PLLWBGD00019',
        'foo',
        '5398228707871528',
      ],
    });
  });

  it('should validate ISBNs', () => {
    test({
      validator: 'isISBN',
      args: [10],
      valid: [
        '3836221195', '3-8362-2119-5', '3 8362 2119 5',
        '1617290858', '1-61729-085-8', '1 61729 085-8',
        '0007269706', '0-00-726970-6', '0 00 726970 6',
        '3423214120', '3-423-21412-0', '3 423 21412 0',
        '340101319X', '3-401-01319-X', '3 401 01319 X',
      ],
      invalid: [
        '3423214121', '3-423-21412-1', '3 423 21412 1',
        '978-3836221191', '9783836221191',
        '123456789a', 'foo', '',
      ],
    });
    test({
      validator: 'isISBN',
      args: [13],
      valid: [
        '9783836221191', '978-3-8362-2119-1', '978 3 8362 2119 1',
        '9783401013190', '978-3401013190', '978 3401013190',
        '9784873113685', '978-4-87311-368-5', '978 4 87311 368 5',
      ],
      invalid: [
        '9783836221190', '978-3-8362-2119-0', '978 3 8362 2119 0',
        '3836221195', '3-8362-2119-5', '3 8362 2119 5',
        '01234567890ab', 'foo', '',
      ],
    });
    test({
      validator: 'isISBN',
      valid: [
        '340101319X',
        '9784873113685',
      ],
      invalid: [
        '3423214121',
        '9783836221190',
      ],
    });
    test({
      validator: 'isISBN',
      args: ['foo'],
      invalid: [
        '340101319X',
        '9784873113685',
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
        'false',
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

  it('should validate base64 strings', () => {
    test({
      validator: 'isBase64',
      valid: [
        'Zg==',
        'Zm8=',
        'Zm9v',
        'Zm9vYg==',
        'Zm9vYmE=',
        'Zm9vYmFy',
        'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4=',
        'Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg==',
        'U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw==',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNw' +
        'UAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0Ye' +
        'rhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619' +
        'FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5Tkukhx' +
        'QmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZ' +
        'Fwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZ' +
        'HQIDAQAB',
      ],
      invalid: [
        '12345',
        '',
        'Vml2YW11cyBmZXJtZtesting123',
        'Zg=',
        'Z===',
        'Zm=8',
        '=m9vYg==',
        'Zm9vYmFy====',
      ],
    });
    for (let i = 0, str = '', encoded; i < 1000; i++) {
      str += String.fromCharCode(Math.random() * 26 | 97); // eslint-disable-line no-bitwise
      encoded = Buffer.from(str).toString('base64');
      if (!validator.isBase64(encoded)) {
        let msg = format('validator.isBase64() failed with "%s"', encoded);
        throw new Error(msg);
      }
    }
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
    assert.equal(window.validator.trim('  foobar '), 'foobar');
  });

  it('should bind validator to the window if no module loaders are available', () => {
    let window = {};
    let sandbox = vm.createContext(window);
    vm.runInContext(validator_js, sandbox);
    assert.equal(window.validator.trim('  foobar '), 'foobar');
  });

  it('should validate mobile phone number', () => {
    let fixtures = [
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
          '201090124576',
          '01090124576',
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
          '+96550000000',
          '+96550000220',
          '+96551111220',
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
        ],
        invalid: [
          '',
          '0174626346',
          '017943563469',
          '18001234567',
          '01494676946',
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
          '+49015123456789',
          '+4915123456789',
          '015123456789',
          '15123456789',
          '15623456789',
          '15623456789',
          '1601234567',
          '16012345678',
          '1621234567',
          '1631234567',
          '1701234567',
          '17612345678',
        ],
        invalid: [
          '15345678910',
          '15412345678',
          '16212345678',
          '1761234567',
          '16412345678',
          '17012345678',
          '12345678910',
          '+4912345678910',
        ],
      },
      {
        locale: 'pt-BR',
        valid: [
          '+55-12-996551215',
          '+55-15-97661234',
          '55-17-96332-2155',
          '55-17-6332-2155',
          '55-15-976612345',
          '55-15-75661234',
          '+5512984567890',
          '+551283456789',
          '5512984567890',
          '551283456789',
          '015994569878',
          '01593456987',
          '022995678947',
          '02299567894',
        ],
        invalid: [
          '0819876543',
          '08158765432',
          '+55-15-7566123',
          '+017-123456789',
          '5501599623874',
          '+55012962308',
          '+55-015-1234-3214',
        ],
      },
      {
        locale: 'zh-CN',
        valid: [
          '15323456787',
          '13523333233',
          '13898728332',
          '+8613238234822',
          '+8613487234567',
          '+8617823492338',
          '+8617823492338',
          '16637108167',
          '+8616637108167',
          '+8616637108167',
          '008618812341234',
          '008618812341234',
          '+8619912341234',
          '+8619812341234',
        ],
        invalid: [
          '12345',
          '',
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
        locale: 'en-GH',
        valid: [
          '0202345671',
          '0502345671',
          '0242345671',
          '0542345671',
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
          '+233272345671',
          '+233572345671',
          '+233262345671',
          '+233562345671',
          '+233232345671',
          '+233282345671',
        ],
        invalid: [
          '082123',
          '232345671',
          '0292345671',
          '+233292345671',
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
        locale: 'en-KE',
        valid: [
          '+254728590432',
          '+254733875610',
          '254728590234',
          '0733346543',
          '0700459022',
        ],
        invalid: [
          '999',
          '+25489032',
          '123456789',
          '+254800723845',
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
        locale: 'el-GR',
        valid: [
          '+306944848966',
          '6944848966',
          '306944848966',
        ],
        invalid: [
          '2102323234',
          '+302646041461',
          '120000000',
          '20000000000',
          '68129485729',
          '6589394827',
          '298RI89572',
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
        ],
      },
      {
        locale: 'en-SG',
        valid: [
          '87654321',
          '98765432',
          '+6587654321',
          '+6598765432',
        ],
        invalid: [
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
        ],
        invalid: [
          '12345',
          '',
          'Vml2YW11cyBmZXJtZtesting123',
          '010-38238383',
          '966684590',
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
        locale: 'vi-VN',
        valid: [
          '0336012403',
          '+84586012403',
          '84981577798',
          '0708001240',
          '84813601243',
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
          '+34704789321',
          '704789321',
          '+34754789321',
          '754789321',
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
        locale: 'ja-JP',
        valid: [
          '09012345688',
          '090 123 45678',
          '+8190-123-45678',
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
          '08002345678',
          '06 1234 5678',
          '072 123 4567',
          '0729 12 3456',
          '07296 1 2345',
          '072961 2345',
          '03-1234-5678',
          '+81312345678',
          '+816-1234-5678',
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
          '021234567',
          '+3221234567',
          '3221234567',
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
        ],
      },
      {
        locale: 'nl-BE',
        valid: [
          '0470123456',
          '+32470123456',
          '32470123456',
          '021234567',
          '+3221234567',
          '3221234567',
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
          '+380982345679',
          '380982345679',
          '80982345679',
          '0982345679',
        ],
        invalid: [
          '+30982345679',
          '982345679',
          '+380 98 234 5679',
          '+380-98-234-5679',
          '',
          'ASDFGJKLmZXJtZtesting123',
          '123456',
          '740123456',
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
        locale: ['en-ZA', 'be-BY'],
        valid: [
          '0821231234',
          '+27821231234',
          '27821231234',
          '+375241234567',
          '+375251234567',
          '+375291234567',
          '+375331234567',
          '+375441234567',
          '375331234567',
        ],
        invalid: [
          '082123',
          '08212312345',
          '21821231234',
          '+21821231234',
          '+0821231234',
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
      ],
      invalid: [
        '254728530234',
        '0728530234',
        '+728530234',
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

  it('should validate currency', () => {
    test({
      validator: 'isCurrency',
      args: [
        {},
        '-$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)',
      ],
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

    test({
      validator: 'isCurrency',
      args: [
        {
          allow_decimal: false,
        },
        '-$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          require_decimal: true,
        },
        '-$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          digits_after_decimal: [1, 3],
        },
        '-$##,###.## (en-US, en-CA, en-AU, en-NZ, en-HK)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          require_symbol: true,
        },
        '-$##,###.## with $ required (en-US, en-CA, en-AU, en-NZ, en-HK)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '¥',
          negative_sign_before_digits: true,
        },
        '¥-##,###.## (zh-CN)',
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
          symbol: '¥',
          allow_negatives: false,
        },
        '¥##,###.## with no negatives (zh-CN)',
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
        'R ## ###,## and R-10 123,25 (el-ZA)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          symbol: '€',
          thousands_separator: '.',
          decimal_separator: ',',
          allow_space_after_symbol: true,
        },
        '-€ ##.###,## (it-IT)',
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
        '-##.###,## € (el-GR)',
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
        'kr. -##.###,## (da-DK)',
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
        'kr. ##.###,## with no negatives (da-DK)',
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

    test({
      validator: 'isCurrency',
      args: [
        {
          parens_for_negatives: true,
        },
        '($##,###.##) (en-US, en-HK)',
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

    test({
      validator: 'isCurrency',
      args: [
        { allow_negatives: false },
        '$##,###.## with no negatives (en-US, en-CA, en-AU, en-HK)',
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
      ],
      invalid: [
        '2010-02-30',
        '2009-02-29',
        '2009-366',
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

  it('should validate whitelisted characters', () => {
    test({
      validator: 'isWhitelisted',
      args: ['abcdefghijklmnopqrstuvwxyz-'],
      valid: ['foo', 'foobar', 'baz-foo'],
      invalid: ['foo bar', 'fo.bar', 'türkçe'],
    });
  });

  it('should error on non-string input', () => {
    let empty = [undefined, null, [], NaN];
    empty.forEach((item) => {
      assert.throws(validator.isEmpty.bind(null, item));
    });
  });

  it('should validate dataURI', () => {
    /* eslint-disable max-len */
    test({
      validator: 'isDataURI',
      valid: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
        '   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC   ',
        'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
        ' data:,Hello%2C%20World!',
        ' data:,Hello World!',
        ' data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
        ' data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
        'data:,A%20brief%20note',
        'data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E',
      ],
      invalid: [
        'dataxbase64',
        'data:HelloWorld',
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
        'magnet:?xt=urn:btih:06E2A9683BF4DA92C73A661AC56F0ECC9C63C5B4&dn=helloword2000&tr=udp://helloworld:1337/announce',
        'magnet:?xt=urn:btih:3E30322D5BFC7444B7B1D8DD42404B75D0531DFB&dn=world&tr=udp://world.com:1337',
        'magnet:?xt=urn:btih:4ODKSDJBVMSDSNJVBCBFYFBKNRU875DW8D97DWC6&dn=helloworld&tr=udp://helloworld.com:1337',
        'magnet:?xt=urn:btih:1GSHJVBDVDVJFYEHKFHEFIO8573898434JBFEGHD&dn=foo&tr=udp://foo.com:1337',
        'magnet:?xt=urn:btih:MCJDCYUFHEUD6E2752T7UJNEKHSUGEJFGTFHVBJS&dn=bar&tr=udp://bar.com:1337',
        'magnet:?xt=urn:btih:LAKDHWDHEBFRFVUFJENBYYTEUY837562JH2GEFYH&dn=foobar&tr=udp://foobar.com:1337',
        'magnet:?xt=urn:btih:MKCJBHCBJDCU725TGEB3Y6RE8EJ2U267UNJFGUID&dn=test&tr=udp://test.com:1337',
        'magnet:?xt=urn:btih:UHWY2892JNEJ2GTEYOMDNU67E8ICGICYE92JDUGH&dn=baz&tr=udp://baz.com:1337',
        'magnet:?xt=urn:btih:HS263FG8U3GFIDHWD7829BYFCIXB78XIHG7CWCUG&dn=foz&tr=udp://foz.com:1337',
      ],
      invalid: [
        '',
        ':?xt=urn:btih:06E2A9683BF4DA92C73A661AC56F0ECC9C63C5B4&dn=helloword2000&tr=udp://helloworld:1337/announce',
        'magnett:?xt=urn:btih:3E30322D5BFC7444B7B1D8DD42404B75D0531DFB&dn=world&tr=udp://world.com:1337',
        'xt=urn:btih:4ODKSDJBVMSDSNJVBCBFYFBKNRU875DW8D97DWC6&dn=helloworld&tr=udp://helloworld.com:1337',
        'magneta:?xt=urn:btih:1GSHJVBDVDVJFYEHKFHEFIO8573898434JBFEGHD&dn=foo&tr=udp://foo.com:1337',
        'magnet:?xt=uarn:btih:MCJDCYUFHEUD6E2752T7UJNEKHSUGEJFGTFHVBJS&dn=bar&tr=udp://bar.com:1337',
        'magnet:?xt=urn:btihz&dn=foobar&tr=udp://foobar.com:1337',
        'magnet:?xat=urn:btih:MKCJBHCBJDCU725TGEB3Y6RE8EJ2U267UNJFGUID&dn=test&tr=udp://test.com:1337',
        'magnet::?xt=urn:btih:UHWY2892JNEJ2GTEYOMDNU67E8ICGICYE92JDUGH&dn=baz&tr=udp://baz.com:1337',
        'magnet:?xt:btih:HS263FG8U3GFIDHWD7829BYFCIXB78XIHG7CWCUG&dn=foz&tr=udp://foz.com:1337',
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
        '+,-',
        '(,)',
        ',',
        ' ',
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
        locale: 'CA',
        valid: [
          'L4T 0A5',
          'G1A-0A2',
          'A1A 1A1',
          'X0A-0H0',
          'V5K 0A1',
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
          '44 522',
          '98025',
          '38 499',
          '39940',
        ],
      },
      {
        locale: 'BG',
        valid: [
          '1000',
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
      },
      {
        locale: 'PL',
        valid: [
          '47-260',
          '12-930',
          '78-399',
          '39-490',
          '38-483',
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
});
