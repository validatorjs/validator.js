import assertString from './util/assertString';

import merge from './util/merge';

const default_isrgb_options = {
  allow_transaprent: true,
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

export default function isRgb(val, options) {
  assertString(val);
	options = merge(options, default_isrgb_options);

if(default_isrgb_options.allow_transaprent === 'true' && val === 'transparent'){
        return true;
      };

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/i;

      if(removedSpace.match(regex)){
          var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
          var valueSliced = removeBrackets.split(',');
          var isValid = true;

          valueSliced.forEach(function(i){
            var parsedInt = parseInt(i);
            if((Number.isInteger(parsedInt) && 0 <= parsedInt && parsedInt <= 255) === false)
              isValid = false;
        });
        return isValid;
      }

      return false;
}
