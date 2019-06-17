import { handler as dates } from '../dates';
import * as lib from '../lib';
import manifest from './manifest';

describe(dates, () => {
  jest.spyOn(lib, 'getManifest').mockResolvedValue(manifest);

  it('return 200 with all dates', async () => {
    const response = await dates();
    const datesObject = manifest && manifest.dates;

    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        dates: datesObject,
      }),
    });
  });
});
