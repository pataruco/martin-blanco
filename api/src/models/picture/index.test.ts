// eslint-disable-next-line no-unused-vars
import { getDirectory, Time } from './';

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
