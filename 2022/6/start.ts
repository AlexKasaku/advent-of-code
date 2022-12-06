import fs from 'fs';
import path from 'path';

//const file = './files/example2.txt';
const file = './files/input.txt';

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const size = 14;
  for (let x = size - 1; x < content.length; x++) {
    const group = content.slice(x - size, x);
    const set = new Set(group);

    if (set.size == size) {
      console.log(`${group} - ${x}`);
      break;
    }
  }
};

start();
