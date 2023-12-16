import assertString from './util/assertString.js';
import InvalidArgumentException from './util/InvalidArgumentException.js'

export default function isFileValid(file, allowedTypes, maxSizeInBytes) {

    if(Array.isArray(allowedTypes)){
        allowedTypes.forEach((value) => {
            assertString(value)
        })
    }
    else{
        let invalidType = typeof allowedTypes;
        if (input === null) invalidType = 'null';
        else if (invalidType === 'object') invalidType = input.constructor.name;
        throw new InvalidArgumentException(`Expected Array of strings but received ${invalidType}`)
    }

    if (!file) {
      return false;
    }

    const fileType = file.type;

    if (!allowedTypes.includes(fileType)) {
      return false;
    }

    const fileSize = file.size;
    if (fileSize > maxSizeInBytes) {
      return false;
    }

    return true;
}