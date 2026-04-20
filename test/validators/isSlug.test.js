import test from '../testFunctions';

describe('isSlug', () => {
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
});
