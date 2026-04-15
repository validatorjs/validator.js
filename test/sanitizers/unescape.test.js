import test from '../testFunctions';

describe('unescape', () => {
  it('should unescape HTML', () => {
    test({
      sanitizer: 'unescape',
      expect: {
        '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;':
             '<script> alert("xss&fun"); </script>',

        '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;':
            "<script> alert('xss&fun'); </script>",

        'Backtick: &#96;':
            'Backtick: `',

        'Escaped string: &amp;lt;':
            'Escaped string: &lt;',
      },
    });
  });
});
