import { test } from './testUtils';

describe('isSlug', () => {
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
});
