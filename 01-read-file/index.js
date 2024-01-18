const fs = require('node:fs');
const path = require('node:path');
const fileName = path.join(__dirname, 'text.txt');

const rr = fs.createReadStream(fileName);
rr.on('data', (chunk) => {
  console.log(`${chunk}`);
});
