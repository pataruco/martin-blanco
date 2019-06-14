import * as lib from '../lib';
import { handler as random } from '../random';
import manifest from './manifest';
import picture from './picture';

describe(random, () => {
  it('returns 200 with a base 64 picture string', async () => {
    const getManifestSpy = jest
      .spyOn(lib, 'getManifest')
      .mockResolvedValue(manifest);

    const getRandomNumberSpy = jest
      .spyOn(lib, 'getRandomNumber')
      .mockReturnValue(1);

    const getPictureSpy = jest.spyOn(lib, 'getPicture');

    const response = await random();

    const file = manifest.dates[0].files[0].url;

    expect(response).toEqual({
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-type': 'image/jpeg',
      },
      body: picture,
    });

    expect(getPictureSpy).toBeCalledWith(file);
    expect(getManifestSpy).toBeCalled();
    expect(getRandomNumberSpy).toBeCalled();
  });

  it('returns 400 when picture is not found', async () => {
    const getManifestSpy = jest
      .spyOn(lib, 'getManifest')
      .mockResolvedValue(null);

    const response = await random();

    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({
        message: 'file not found',
      }),
    });
  });
});
