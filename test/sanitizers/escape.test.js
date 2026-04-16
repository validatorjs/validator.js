import test from '../testFunctions';

describe('escape', () => {
  it('should escape HTML', () => {
    test({
      sanitizer: 'escape',
      expect: {
        '<script> alert("xss&fun"); </script>':
            '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;',

        "<script> alert('xss&fun'); </script>":
            '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;',

        'Backtick: `':
            'Backtick: &#96;',

        'Backslash: \\':
            'Backslash: &#x5C;',
      },
    });
  });
});
