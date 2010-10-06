var node_validator = require('../lib'),
    Filter = new node_validator.Filter();

module.exports = {
    'test #ifNull()': function(assert) {
        //Make sure sanitize returns the new string
        assert.equal(5, Filter.sanitize('').ifNull(5));
        assert.equal('abc', Filter.sanitize().ifNull('abc'));
        
        //Modify Filter.modify() to automatically replace a var with the sanitized version
        var param = '';
        Filter.modify = function(str) {
            this.str = str;
            param = str;
        }
        Filter.sanitize(param).ifNull('foobar');
        assert.equal('foobar', param);
    }, 
    
    'test #toBoolean()': function(assert) {
        assert.equal(true, Filter.sanitize('1').toBoolean());
        assert.equal(true, Filter.sanitize('true').toBoolean());
        assert.equal(true, Filter.sanitize('foobar').toBoolean());
        assert.equal(true, Filter.sanitize(5).toBoolean());
        assert.equal(true, Filter.sanitize('   ').toBoolean());
        
        assert.equal(false, Filter.sanitize('0').toBoolean());
        assert.equal(false, Filter.sanitize('false').toBoolean());
        assert.equal(false, Filter.sanitize('').toBoolean());
        assert.equal(false, Filter.sanitize('false').toBoolean());
    }, 
    
    'test #toBooleanStrict()': function(assert) {
        assert.equal(true, Filter.sanitize('1').toBooleanStrict());
        assert.equal(true, Filter.sanitize('true').toBooleanStrict());
        
        assert.equal(false, Filter.sanitize('foobar').toBooleanStrict());
        assert.equal(false, Filter.sanitize(5).toBooleanStrict());
        assert.equal(false, Filter.sanitize('   ').toBooleanStrict());
        assert.equal(false, Filter.sanitize('0').toBooleanStrict());
        assert.equal(false, Filter.sanitize('false').toBooleanStrict());
        assert.equal(false, Filter.sanitize('').toBooleanStrict());
        assert.equal(false, Filter.sanitize('false').toBooleanStrict());
    }, 
    
    'test #trim()': function(assert) {
        //Test trim() with spaces
        assert.equal('abc', Filter.sanitize('  abc').trim());
        assert.equal('abc', Filter.sanitize('abc  ').trim());
        assert.equal('abc', Filter.sanitize('   abc  ').trim());
        
        //Test trim() with \t
        assert.equal('abc', Filter.sanitize('	abc').trim());
        assert.equal('abc', Filter.sanitize('abc	').trim());
        assert.equal('abc', Filter.sanitize('	abc	').trim());
        
        //Test trim() with a mixture of \t, \s, \r and \n
        assert.equal('abc', Filter.sanitize('	\r\n  abc\r\n	  ').trim());
    }, 
    
    'test #ltrim()': function(assert) {
        //Test ltrim() with spaces
        assert.equal('abc', Filter.sanitize('  abc').ltrim());
        assert.equal('abc  ', Filter.sanitize('   abc  ').ltrim());
        
        //Test ltrim() with \t
        assert.equal('abc', Filter.sanitize('	abc').ltrim());
        assert.equal('abc	', Filter.sanitize(' abc	').ltrim());
        
        //Test ltrim() with a mixture of \t, \s, \r and \n
        assert.equal('abc\r\n', Filter.sanitize('	\r\n  abc\r\n').ltrim());
    },
    
    'test #rtrim()': function(assert) {
        //Test rtrim() with spaces
        assert.equal('  abc', Filter.sanitize('  abc  ').rtrim());
        assert.equal('abc', Filter.sanitize('abc  ').rtrim());
        
        //Test rtrim() with \t
        assert.equal('	abc', Filter.sanitize('	abc').rtrim());
        assert.equal('abc', Filter.sanitize('abc	').rtrim());
        
        //Test rtrim() with a mixture of \t, \s, \r and \n
        assert.equal('	\r\n  abc', Filter.sanitize('	\r\n  abc\r\n	  ').rtrim());
    }
}    
