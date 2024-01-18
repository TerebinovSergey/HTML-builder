const path = require('node:path');
const fs = require('node:fs');
 
const bundleName = path.join(__dirname, 'project-dist', 'bundle.css'); 
const pathStyles = path.join(__dirname, 'styles');
 
const writeableStream = fs.createWriteStream(bundleName);
 
fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(path.join(pathStyles, file.name), 'utf8');
      readableStream.pipe(writeableStream);
    }
  }
});