import inquirer from 'inquirer';
import uploader from './uploader';
import chalk from 'chalk';

export const log = console.log;
const unixPathRegex = RegExp('^/$|(^(?=/)|^.|^..)(/(?=[^/\0])[^/\0]+)*/?$');

const sourceValidation = (value: string) =>
  unixPathRegex.test(value) ? true : 'Please a valid path.';

const start = async () => {
  log(chalk`{bold Martin Blanco API images uploader} 🚀`);
  const prompt = await inquirer.prompt([
    {
      type: 'string',
      name: 'source',
      message: 'Source directory as an absolute path, e.g.: ~/Desktop/upload:',
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
  const { source, target } = prompt;
  await uploader({ source, target });
};

if (!module.parent) {
  start().then();
}
