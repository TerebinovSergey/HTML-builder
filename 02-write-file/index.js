const fs = require('node:fs');
const path = require('node:path');
const { stdin: input, stdout: output } = require('node:process');
const readline = require('node:readline');
const rl = readline.createInterface({ input, output });
const fileName = path.join(__dirname, 'text.txt');
const writetableStream = fs.createWriteStream(fileName);
let breakLine = '';
console.log('Hi. You can enter text:');
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writetableStream.write(`${breakLine}${input}`);
    breakLine = '\n';
  }
})

rl.on('close', () => console.log('Goodbye!'));