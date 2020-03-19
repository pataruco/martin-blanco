// eslint-disable-next-line no-unused-vars
import { getDirectory, Time, getOriginalTime, getNumberString } from './';
import { promises as fs } from 'fs';
import path from 'path';

describe(getDirectory, () => {
  const year = '2017';
  const month = '01';
  const day = '02';

  const directories: Array<Array<Time | string>> = [
    [{ year }, `pictures/${year}`],
    [{ year, month }, `pictures/${year}/${month}`],
    [{ year, month, day }, `pictures/${year}/${month}/${day}`],
  ];

  it.each(directories)('getDirectory(%o)', (query: Time, directory: string) => {
    expect(getDirectory(query)).toBe(directory);
  });
});

describe(getOriginalTime, () => {
  it('return an originalTime object', async () => {
    const filePath = path.resolve(__dirname, './test-helpers', '1.jpeg');
    const file = await fs.readFile(filePath);

    expect(await getOriginalTime(file)).toEqual({
      year: 1970,
      month: 0,
      day: 1,
    });
  });
});

describe(getNumberString, () => {
  const collection = [
    [1, '01'],
    [10, '10'],
    [9, '09'],
  ];

  it.each(collection)(
    'getNumberString(%i)',
    (number: number, string: string) => {
      expect(getNumberString(number)).toBe(string);
    },
  );
});
