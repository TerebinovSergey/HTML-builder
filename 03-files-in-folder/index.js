const { stat, readdir } = require('node:fs/promises');
const path = require('node:path');
const folderName = path.join(__dirname, 'secret-folder');

readdir(folderName, { withFileTypes: true })
.then((files) => {
  for (const file of files) {
    if (file.isFile()) {
      const ext = path.extname(file.name).slice(1);
      const fullFileName = path.join(folderName, file.name);
      stat(fullFileName)
      .then((stats) => {
        console.log(`${path.parse(file.name).name} - ${ext} - ${stats.size}`)
      })
    }
  }
})
.catch((err) => console.error(err))