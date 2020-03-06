import path from 'path';
import { promises as fs } from 'fs';
import { existsSync, mkdirSync } from 'fs';

const filesOnDesktop = '/Users/pataruco/Desktop/test-files';

const getFilesByPath = async (path: string): Promise<string[]> => {
  try {
    return await fs.readdir(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get files from ${path}. ${e}`);
  }
};

const geFile = async (path: string): Promise<Buffer> => {
  try {
    return await fs.readFile(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get file from ${path}. ${e}`);
  }
};

const start = async () => {
  await Promise.all(
    (await getFilesByPath(filesOnDesktop)).map(async file => {
      const buffer = await geFile(file);
      // rotate
      // get date
      // get ID
      // Create path
      // upload fo storage
    }),
  );
};
if (!module.parent) {
  start().then();
}
