import fs from 'fs';
import path from 'path';
import { parseInput } from './utils';

const debugMode = false;
const debug = (...params: any[]) => debugMode && console.log(...params);
const log = (...params: any[]) => console.log(...params);

const start = async (file: string) => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const x = parseInput(content);
};

start('./files/example.txt');
//start('./files/input.txt');
