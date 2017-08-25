import assertString from './util/assertString';

import merge from './util/merge';

const default_ishex_options = {
  allow_transaprent: true,
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

export default function isHex(val, options) {
  assertString(val);
	options = merge(options, default_ishex_options);

  if(default_ishex_options.allow_transaprent && val === 'transparent'){
        return true;
      }

      var startWithHex = val[0] === "#";
      var isCorrectLength = val.length === 4 || val.length === 7;

      if(isCorrectLength){
        var regex = /[0-9a-f]/i;
        var valueSliced = val.slice(1).split('');
        var isValid = true;
        valueSliced.forEach(function(i){
          if(i.match(regex) === null)
            isValid = false;
        });
        return isValid;
      }

      return false;
}
