// eslint-disable-next-line import/no-extraneous-dependencies
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');

fse.emptyDirSync('./deno');

function parseForDeno(file) {
  const fileBuffer = fse.readFileSync(file);
  let fileContent = fileBuffer.toString();
  const importedFiles = fileContent.match(/import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g);
  if (importedFiles && importedFiles.length) {
    importedFiles.forEach((importedFile) => {
      fileContent = fileContent.replace(importedFile, importedFile.replace("';", ".js';").replace('";', '.js";'));
    });
  }
  const dest = file.replace('src', 'deno');
  fse.ensureDirSync(path.dirname(dest));
  fse.writeFileSync(dest, fileContent);
}

glob('./src/**/*.js', (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((file) => {
    parseForDeno(file);
  });
})
