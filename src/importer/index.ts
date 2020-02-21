import path from 'path';
import { promises as fs } from 'fs';

const inputPath = path.resolve(__dirname, 'input');
const outputPath = path.resolve(__dirname, 'output');

const getAllFiles = async () => await fs.readdir(inputPath);

const readfiles = async () => {
  await (await getAllFiles()).forEach(file => console.log({ file }));
};

readfiles();
