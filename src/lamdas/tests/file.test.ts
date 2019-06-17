import { handler as file } from '../file';
import * as lib from '../lib';
import manifest from './manifest';
import picture from './picture';
import { mockEvent } from './test-helpers';

describe(file, () => {
  jest.spyOn(lib, 'getManifest').mockResolvedValue(manifest);
  const getDateSpy = jest.spyOn(lib, 'getDate');
  const getFileSpy = jest.spyOn(lib, 'getFile');
  const getPictureSpy = jest.spyOn(lib, 'getPicture');

  it('return 200 with a file content as base 64', async () => {
    const response = await file(mockEvent);
    expect(getDateSpy).toBeCalledWith(mockEvent.pathParameters.dateId);
    expect(getFileSpy).toBeCalledWith(
      [manifest.dates[0]],
      mockEvent.pathParameters.fileId,
    );
    expect(getPictureSpy).toBeCalledWith(manifest.dates[0].files[0].url);
    expect(response).toEqual({
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-type': 'image/jpeg',
      },
      body: picture,
    });
  });

  it('return a 400 error when values fail validation', async () => {
    const event = { ...mockEvent, pathParameters: { dateId: '', fileId: '' } };

    const response = await file(event);
    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ message: '"dateId" is not allowed to be empty' }),
    });
  });

  it('return 204 when fileId cannot be founde', async () => {
    const event = {
      ...mockEvent,
      pathParameters: { fileId: '10', dateId: '2017-01-25' },
    };

    const response = await file(event);
    expect(getDateSpy).toBeCalledWith(mockEvent.pathParameters.dateId);
    expect(getFileSpy).toBeCalledWith(
      [manifest.dates[0]],
      mockEvent.pathParameters.fileId,
    );
    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 204,
      headers: {},
      body: JSON.stringify({
        message: 'File not found',
      }),
    });
  });
});
