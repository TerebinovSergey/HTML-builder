const path = require('node:path');
const fs = require('node:fs');
const folderComponents = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const folderDist = path.join(__dirname, 'project-dist');
const components = [];

readComponents();

fs.access(folderDist, fs.constants.F_OK, (err) => {
  if (err) {
    createDirectory(folderDist);
    mergeStyles();
    copyAssets();
    mergeHTML();
  } else {
    fs.rm(folderDist, { recursive: true, force: true }, (err) => {
      if (err) throw err;
      createDirectory(folderDist);
      mergeStyles();
      copyAssets();
      mergeHTML();
    });
  }
});

function mergeStyles() {
  const styleBundle = path.join(folderDist, 'style.css');
  const folderStyles = path.join(__dirname, 'styles');
  let writeableStream = fs.createWriteStream(styleBundle);

  fs.readdir(folderStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let readableStream = fs.createReadStream(path.join(folderStyles, file.name));
        readableStream.pipe(writeableStream);
      }
    });
  });
}

function copyAssets() {
  const folderAssets = path.join(__dirname, 'assets');
  const folderAssetsDist = path.join(folderDist, 'assets');
  createDirectory(folderAssetsDist);
  fs.readdir(folderAssets, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file.isDirectory()) {
        let dist = path.join(folderAssetsDist, file.name);
        let src = path.join(folderAssets, file.name);
        createDirectory(dist);
        fs.readdir(src, (err, files) => {
          if (err) throw err;
          files.forEach(file => {
            fs.copyFile(path.join(src, file),
            path.join(dist, file), (err) => {
              if (err) throw err;
            });
          });
        });
      }
    });
  });
}

function mergeHTML() {
  fs.readFile(template, 'utf8', (error, file) => {
    if(error) throw error;
    for (let i = components.length - 1; i >= 0; i--) {
      const component = components[i];
      fs.readFile(path.join(folderComponents, `${component}.html`), 'utf8', (error, fileComp) => {
        if(error) throw error;
        let pattern = new RegExp(`{{${component}}}`, 'g');
        file = file.replace(pattern, fileComp);
        const index = components.findIndex(el => el === component);
        components.splice(index, 1);
        if (components.length === 0) {
          fs.writeFile(path.join(folderDist, 'index.html'), file, (error) => {
            if(error) throw error;
          });
        }
      });
    }
  });
}

function createDirectory(fullPath) {
  fs.mkdir(fullPath, {recursive: true}, err => {
    if (err) throw err;
  });
}

function readComponents() {
  fs.readdir(folderComponents, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const fileName = path.parse(file.name).name;
        components.push(fileName);
      }
    });
  });
}