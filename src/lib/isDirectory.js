const fs = require('fs'); 

export default isDirectory(path){
    assertString(str);
    let sanit = path.replace("\\", "/");
    return (fs.existsSync(sanit)) ? true : false;
  }