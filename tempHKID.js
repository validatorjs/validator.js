function isHKID(str) {
    // sanitize user input
    str = str.trim();

    // HKID number starts with 1 or 2 letters, followed by 6 digits,
    // then a checksum contained in square / round brackets or nothing
    const regexHKID = new RegExp('^[A-Z]{1,2}[0-9]{6}(\\([0-9A]\\))|(\\[[0-9A]\\])|([0-9A])$', 'gm');
    
    const regexIsDigit = new RegExp('^[0-9]$');

    // convert the user input to all uppercase and apply regex
    str = str.toUpperCase();
    if (!regexHKID.exec(str)) return false;
    str = str.replace(/\[|\]|\(|\)/g, '');
    strArr = str.split('');
  
    if (strArr.length == 8) strArr.unshift('3');
    let checkSumVal = 0;
    for (let i = 0; i <= 7; i++) {
      let convertedChar;
      if (!regexIsDigit.exec(strArr[i])) convertedChar = (strArr[i].charCodeAt(0) - 55) % 11;
      else convertedChar = strArr[i];
      checkSumVal += (convertedChar * (9 - i));
    }
    
    checkSumVal %= 11;
    let checkSumConverted;
    if (checkSumVal === 0) checkSumConverted = '0';
    else if (checkSumVal === 1) checkSumConverted = 'A';
    else checkSumConverted = String(11 - checkSumVal);
    if (checkSumConverted === strArr.at(-1)) return true;
    return false;
}

console.log(isHKID("F080488[2]")) //F0804882
console.log(isHKID("TK6985057")) //F0804882
console.log(isHKID("TK6985087")) //F0804882
console.log(isHKID("D578840(5)")) //F0804882
console.log(isHKID("D576840(5)")) //F0804882
console.log(isHKID("RH265886(3)")) //F0804882
