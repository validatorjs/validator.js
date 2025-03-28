import test from '../sanitizers.test';

describe('normalizeEmail', () => {
  it('should normalize an email based on domain', () => {
    test({
      sanitizer: 'normalizeEmail',
      expect: {
        'test@me.com': 'test@me.com',
        'some.name@gmail.com': 'somename@gmail.com',
        'some.name@googleMail.com': 'somename@gmail.com',
        'some.name+extension@gmail.com': 'somename@gmail.com',
        'some.Name+extension@GoogleMail.com': 'somename@gmail.com',
        'some.name.middleName+extension@gmail.com':
          'somenamemiddlename@gmail.com',
        'some.name.middleName+extension@GoogleMail.com':
          'somenamemiddlename@gmail.com',
        'some.name.midd.leNa.me.+extension@gmail.com':
          'somenamemiddlename@gmail.com',
        'some.name.midd.leNa.me.+extension@GoogleMail.com':
          'somenamemiddlename@gmail.com',
        'some.name+extension@unknown.com': 'some.name+extension@unknown.com',
        'hans@m端ller.com': 'hans@m端ller.com',
        'some.name.midd..leNa...me...+extension@GoogleMail.com':
          'somenamemidd..lena...me...@gmail.com',
        'matthew..example@gmail.com': 'matthew..example@gmail.com',
        '"foo@bar"@baz.com': '"foo@bar"@baz.com',
        'test@ya.ru': 'test@yandex.ru',
        'test@yandex.kz': 'test@yandex.ru',
        'test@yandex.ru': 'test@yandex.ru',
        'test@yandex.ua': 'test@yandex.ru',
        'test@yandex.com': 'test@yandex.ru',
        'test@yandex.by': 'test@yandex.ru',
        '@gmail.com': false,
        '@icloud.com': false,
        '@outlook.com': false,
        '@yahoo.com': false,
      },
    });

    // Testing all_lowercase switch, should apply to domains not known to be case-insensitive
    test({
      sanitizer: 'normalizeEmail',
      args: [{ all_lowercase: false }],
      expect: {
        'test@foo.com': 'test@foo.com',
        'hans@m端ller.com': 'hans@m端ller.com',
        'test@FOO.COM': 'test@foo.com', // Hostname is always lowercased
        'blAH@x.com': 'blAH@x.com',
        // In case of domains that are known to be case-insensitive, there's a separate switch
        'TEST@me.com': 'test@me.com',
        'TEST@ME.COM': 'test@me.com',
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name.middleName+extension@GoogleMail.com':
          'somenamemiddlename@gmail.com',
        'SOME.name.midd.leNa.me.+extension@gmail.com':
          'somenamemiddlename@gmail.com',
        'SOME.name@gmail.com': 'somename@gmail.com',
        'SOME.name@yahoo.ca': 'some.name@yahoo.ca',
        'SOME.name@outlook.ie': 'some.name@outlook.ie',
        'SOME.name@me.com': 'some.name@me.com',
        'SOME.name@yandex.ru': 'some.name@yandex.ru',
      },
    });

    // Testing *_lowercase
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          all_lowercase: false,
          gmail_lowercase: false,
          icloud_lowercase: false,
          outlookdotcom_lowercase: false,
          yahoo_lowercase: false,
          yandex_lowercase: false,
        },
      ],
      expect: {
        'TEST@FOO.COM': 'TEST@foo.com', // all_lowercase
        'ME@gMAil.com': 'ME@gmail.com', // gmail_lowercase
        'ME@me.COM': 'ME@me.com', // icloud_lowercase
        'ME@icloud.COM': 'ME@icloud.com', // icloud_lowercase
        'ME@outlook.COM': 'ME@outlook.com', // outlookdotcom_lowercase
        'JOHN@live.CA': 'JOHN@live.ca', // outlookdotcom_lowercase
        'ME@ymail.COM': 'ME@ymail.com', // yahoo_lowercase
        'ME@yandex.RU': 'ME@yandex.ru', // yandex_lowercase
      },
    });

    // Testing all_lowercase
    // Should overwrite all the *_lowercase options
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          all_lowercase: true,
          gmail_lowercase: false, // Overruled
          icloud_lowercase: false, // Overruled
          outlookdotcom_lowercase: false, // Overruled
          yahoo_lowercase: false, // Overruled
        },
      ],
      expect: {
        'TEST@FOO.COM': 'test@foo.com', // all_lowercase
        'ME@gMAil.com': 'me@gmail.com', // gmail_lowercase
        'ME@me.COM': 'me@me.com', // icloud_lowercase
        'ME@icloud.COM': 'me@icloud.com', // icloud_lowercase
        'ME@outlook.COM': 'me@outlook.com', // outlookdotcom_lowercase
        'JOHN@live.CA': 'john@live.ca', // outlookdotcom_lowercase
        'ME@ymail.COM': 'me@ymail.com', // yahoo_lowercase
      },
    });

    // Testing *_remove_dots
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_remove_dots: false,
        },
      ],
      expect: {
        'SOME.name@GMAIL.com': 'some.name@gmail.com',
        'SOME.name+me@GMAIL.com': 'some.name@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_remove_dots: true,
        },
      ],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'some.name..multiple@gmail.com': 'somename..multiple@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    // Testing *_remove_subaddress
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_remove_subaddress: false,
          icloud_remove_subaddress: false,
          outlookdotcom_remove_subaddress: false,
          yahoo_remove_subaddress: false, // Note Yahoo uses "-"
        },
      ],
      expect: {
        'foo+bar@unknown.com': 'foo+bar@unknown.com',
        'foo+bar@gmail.com': 'foo+bar@gmail.com', // gmail_remove_subaddress
        'foo+bar@me.com': 'foo+bar@me.com', // icloud_remove_subaddress
        'foo+bar@icloud.com': 'foo+bar@icloud.com', // icloud_remove_subaddress
        'foo+bar@live.fr': 'foo+bar@live.fr', // outlookdotcom_remove_subaddress
        'foo+bar@hotmail.co.uk': 'foo+bar@hotmail.co.uk', // outlookdotcom_remove_subaddress
        'foo-bar@yahoo.com': 'foo-bar@yahoo.com', // yahoo_remove_subaddress
        'foo+bar@yahoo.com': 'foo+bar@yahoo.com', // yahoo_remove_subaddress
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_remove_subaddress: true,
          icloud_remove_subaddress: true,
          outlookdotcom_remove_subaddress: true,
          yahoo_remove_subaddress: true, // Note Yahoo uses "-"
        },
      ],
      expect: {
        'foo+bar@unknown.com': 'foo+bar@unknown.com',
        'foo+bar@gmail.com': 'foo@gmail.com', // gmail_remove_subaddress
        'foo+bar@me.com': 'foo@me.com', // icloud_remove_subaddress
        'foo+bar@icloud.com': 'foo@icloud.com', // icloud_remove_subaddress
        'foo+bar@live.fr': 'foo@live.fr', // outlookdotcom_remove_subaddress
        'foo+bar@hotmail.co.uk': 'foo@hotmail.co.uk', // outlookdotcom_remove_subaddress
        'foo-bar@yahoo.com': 'foo@yahoo.com', // yahoo_remove_subaddress
        'foo+bar@yahoo.com': 'foo+bar@yahoo.com', // yahoo_remove_subaddress
      },
    });

    // Testing gmail_convert_googlemaildotcom
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_convert_googlemaildotcom: false,
        },
      ],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.com': 'somename@googlemail.com',
        'SOME.name+me@googlemail.COM': 'somename@googlemail.com',
        'SOME.name+me@googlEmail.com': 'somename@googlemail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          gmail_convert_googlemaildotcom: true,
        },
      ],
      expect: {
        'SOME.name@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@GMAIL.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.com': 'somename@gmail.com',
        'SOME.name+me@googlemail.COM': 'somename@gmail.com',
        'SOME.name+me@googlEmail.com': 'somename@gmail.com',
        'my.self@foo.com': 'my.self@foo.com',
      },
    });

    // Testing yandex_convert_yandexru
    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          yandex_convert_yandexru: false,
        },
      ],
      expect: {
        'test@yandex.kz': 'test@yandex.kz',
        'test@yandex.ru': 'test@yandex.ru',
        'test@yandex.ua': 'test@yandex.ua',
        'test@yandex.com': 'test@yandex.com',
        'test@yandex.by': 'test@yandex.by',
      },
    });

    test({
      sanitizer: 'normalizeEmail',
      args: [
        {
          yandex_convert_yandexru: true,
        },
      ],
      expect: {
        'test@yandex.kz': 'test@yandex.ru',
        'test@yandex.ru': 'test@yandex.ru',
        'test@yandex.ua': 'test@yandex.ru',
        'test@yandex.com': 'test@yandex.ru',
        'test@yandex.by': 'test@yandex.ru',
      },
    });
  });
});
