import * as lib from '../lib';
import { handler as updated } from '../updated';
import manifest from './manifest';

describe(updated, () => {
  it('return an updated date', async () => {
    const getManifestSpy = jest
      .spyOn(lib, 'getManifest')
      .mockResolvedValue(manifest);

    const response = await updated();
    const updateDate = manifest.updated;

    expect(getManifestSpy).toBeCalled();
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
