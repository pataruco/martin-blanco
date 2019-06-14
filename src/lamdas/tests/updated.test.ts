import * as lib from '../lib';
import { handler as updated } from '../updated';
import manifest from './manifest';

describe(updated, () => {
  it('return an updated date', async () => {
    const response = await updated();

    const updateDate = '2019-01-20T15:11:02.616+00:00';

    expect(response).toEqual({
      statusCode: 200,
      headers: {},
      isBase64Encoded: false,
      body: JSON.stringify({
        updated: updateDate,
      }),
    });
  });
});
