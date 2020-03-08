import inquirer from 'inquirer';
import uploader from './uploader';

const unixPathRegex = RegExp('^/$|(^(?=/)|^.|^..)(/(?=[^/\0])[^/\0]+)*/?$');

const sourceValidation = (value: string) =>
  unixPathRegex.test(value) ? true : 'Please a valid path.';

const start = async () => {
  const prompt = await inquirer.prompt([
    {
      type: 'string',
      name: 'source',
      message: 'Source directory as an absolute path, e.g.: ~/Desktop/upload:',
      validate: sourceValidation,
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
