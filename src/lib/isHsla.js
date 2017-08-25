import assertString from './util/assertString';

import merge from './util/merge';

const default_ishsla_options = {
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

export default function isHsla(val, options) {
  assertString(val);
	options = merge(options, default_ishsla_options);

      if(default_ishsla_options.allow_transaprent === 'true' && val === 'transparent'){
        return true;
      };

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%,[0,1]{1}.?[0-9]*\)/i;

      if(removedSpace.match(regex)){
          var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
          var valueSliced = removeBrackets.split(',');
          var isValid = true;

          valueSliced.forEach(function(i,index){
            var value = filterFloat(i);

            if(Number.isInteger(value)){
                if(index === 0){
                  var isInRange = 0 <= value && value <= 360;
                  if(!isInRange){
                    isValid = false;
                  }
                } else {

                  console.log(value);

                  var isInRange = 0 <= value && value <= 100;
                  if(!isInRange){
                    isValid = false;
                  }
                }
            } else {
              if(isNaN(value)){
                // percent value
                value = parseInt(i);
                var isInRange = 0 <= value && value <= 100;
                if(!isInRange){
                  isValid = false;
                }
              } else {
                var isInRange = 0 <= value && value <= 1;
                if(!isInRange){
                  isValid = false;
                }
              }
            }
        });
        return isValid;
      } else {
        console.log("Bad regex");
      }

      return false;
}
