const path = require('node:path');
const fs = require('node:fs');

const folderSrc = path.join(__dirname, 'files');
const folderDest = path.join(__dirname, 'files-copy');

fs.mkdir(folderDest, { recursive: true }, (err) => {
  if (err) console.log(err);
});

fs.readdir(folderSrc, (err, files) => {
  if (err) console.log(err);
  let delFiles = 0;
  for (const file of files) {
    const filePath = path.join(folderDest, file);
    fs.unlink(filePath, (err) => {
      delFiles++;
      if (delFiles === files.length) {
        copyFiles();
      }
    })
  }
})

function copyFiles() {
  fs.readdir(folderSrc, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      const filePathFrom = path.join(folderSrc, file);
      const filePathTo = path.join(folderDest, file);
      fs.copyFile(filePathFrom, filePathTo, (err) => {
        if (err) console.log(err);
      });
    }
  });
}
