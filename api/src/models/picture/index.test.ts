// eslint-disable-next-line no-unused-vars
import { getDirectory, Time, getNumberString } from './';

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
