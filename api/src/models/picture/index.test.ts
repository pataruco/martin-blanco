import { getDirectory } from './';

describe(getDirectory, () => {
  it('return a directory string', () => {
    const year = '2017';
    const directory = getDirectory({ year });
    expect(directory).toBe(`pictures/${year}`);
  });
});
