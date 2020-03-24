import inquirer from 'inquirer';
import pictureUploader from './pictures/uploader';
import movieUploader from './movies/uploader';
import chalk from 'chalk';

export const log = console.log;
const unixPathRegex = RegExp('^/$|(^(?=/)|^.|^..)(/(?=[^/\0])[^/\0]+)*/?$');

const sourceValidation = (value: string) =>
  unixPathRegex.test(value) ? true : 'Please a valid path.';

const start = async () => {
  log(chalk`{bold Martin Blanco API images uploader} 🚀`);
  const prompt = await inquirer.prompt([
    {
      type: 'list',
      name: 'typeOfFiles',
      message: 'What type of files you want to process?:',
      choices: ['pictures', 'movies'],
      filter: val => val.toLowerCase(),
    },
    {
      type: 'string',
      name: 'source',
      message:
        'Source directory as an absolute path, e.g.: /Users/pataruco/Desktop/upload:',
      validate: sourceValidation,
      filter: val => val.trim(),
    },
    {
      type: 'list',
      name: 'target',
      message: 'Target environment:',
      choices: ['development', 'production'],
      filter: val => val.toLowerCase(),
    },
  ]);
  const { source, target, typeOfFiles } = prompt;
  switch (typeOfFiles) {
    case value:
      break;

    default:
      break;
  }

  await pictureUploader({ source, target });
};

if (!module.parent) {
  start().then();
}
