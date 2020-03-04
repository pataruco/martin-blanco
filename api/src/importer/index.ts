import path from 'path';
import { promises as fs } from 'fs';
import { existsSync, mkdirSync } from 'fs';

const inputPath = path.resolve(__dirname, 'input');
const outputPath = path.resolve(__dirname, 'output');

const getAllFiles = async () => {
  try {
    const files = await fs.readdir(inputPath);
    return files;
  } catch (e) {
    console.error(e);
  }
};

interface FileObject {
  year: string;
  month: string;
  date: string;
  fileName: string;
}

const getFileObject = (file: string): FileObject => {
  const [fulldate] = file.split('_');
  console.log({ fulldate });
  const fileName = file.split('_')[1];
  return {
    year: fulldate.split('-')[0],
    month: fulldate.split('-')[1],
    date: fulldate.split('-')[2],
    fileName,
  };
};

const getInputFilePath = (file: string): string =>
  path.resolve(inputPath, file);

const getInputFile = async (inputFilePath: string) =>
  await fs.readFile(inputFilePath);

interface PathByTime {
  time: 'year' | 'month' | 'date';
  file: string;
}

const getDirPathByTime = async ({
  time,
  file,
}: PathByTime): Promise<string> => {
  const { year, month, date } = getFileObject(file);
  const pathByTime = {
    year: await path.resolve(outputPath, year),
    month: await path.resolve(outputPath, year, month),
    date: await path.resolve(outputPath, year, month, date),
  };
  return pathByTime[time];
};

const start = async () => {
  try {
    Promise.resolve(
      (await getAllFiles())?.map(async (file: string) => {
        const inputFilePath = getInputFilePath(file);
        const inputFile = await getInputFile(inputFilePath);
        const { year, month, date, fileName } = getFileObject(file);
        const outputFilePath = path.resolve(
          outputPath,
          year,
          month,
          date,
          fileName,
        );

        if (!existsSync(await getDirPathByTime({ file, time: 'date' }))) {
          mkdirSync(await getDirPathByTime({ time: 'date', file }));
        }
        console.log(`Moving file: ${file} to: ${outputFilePath}`);
        await fs.writeFile(outputFilePath, inputFile);
      }),
    );
  } catch (e) {
    console.error(e);
  }
};

if (!module.parent) {
  start();
}
