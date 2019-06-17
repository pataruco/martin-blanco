import { handler as date } from '../date';
import * as lib from '../lib';
import manifest from './manifest';
import { mockEvent } from './test-helpers';

describe(date, () => {
  jest.spyOn(lib, 'getManifest').mockResolvedValue(manifest);
  const getDateSpy = jest.spyOn(lib, 'getDate');

  it('return 200 with a date model', async () => {
    delete mockEvent.pathParameters.fileId;
    const dateModel = manifest.dates[0];
    const response = await date(mockEvent);
    expect(getDateSpy).toBeCalledWith(mockEvent.pathParameters.dateId);
    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify([dateModel]),
    });
  });

  it('return 400 error when value fail validation', async () => {
    const event = { ...mockEvent, pathParameters: { dateId: '', fileId: '' } };
    const response = await date(event);
    expect(response).toEqual({
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ message: '"dateId" is not allowed to be empty' }),
    });
  });
});
