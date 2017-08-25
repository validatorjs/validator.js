import assertString from './util/assertString';

import merge from './util/merge';

const default_ishsl_options = {
  allow_transaprent: true,
};

var filterFloat = function(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}

var isBetween0and1 = function(value){
  return value > 0 && value < 1;
}

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

export default function isHsl(val, options) {
  assertString(val);
	options = merge(options, default_ishsl_options);

      if(default_ishsl_options.allow_transaprent === 'true' && val === 'transparent'){
        return true;
      };

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%\)/i;

      if(removedSpace.match(regex)){
          var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
          var valueSliced = removeBrackets.split(',');
          var isValid = true;

          valueSliced.forEach(function(i,index){
            var parsedInt = parseInt(i);

            if(Number.isInteger(parsedInt)){
                if(index === 0){
                  var isInRange = 0 <= parsedInt && parsedInt <= 360;
                  if(!isInRange){
                    isValid = false;
                  }
                } else {
                  var isInRange = 0 <= parsedInt && parsedInt <= 100;
                  if(!isInRange){
                    isValid = false;
                  }
                }
            } else {
              isValid = false;
            }
        });
        return isValid;
      }

      return false;
}
