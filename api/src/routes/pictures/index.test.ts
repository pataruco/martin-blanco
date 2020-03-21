import app from '../../index';
import request from 'supertest';
import * as picture from '../../models/picture';

jest.mock('../../utils/logger');

const getFilesByReturnsEmpty = () =>
  jest.spyOn(picture, 'getFilesBy').mockResolvedValueOnce([]);

const getFilesByThrowError = () =>
  jest.spyOn(picture, 'getFilesBy').mockRejectedValueOnce(new Error('💥'));

describe('/pictures', () => {
  describe('GET /pictures/date/:year', () => {
    const badRequests = [
      ['test', '"year" must be a number'],
      ['2016', '"year" must be larger than or equal to 2017'],
    ];
    it.each(badRequests)(
      'returns 422 with message when requests fail validation (/pictures/date/%s)',
      async (reqParam: string, message: string) => {
        const response = await request(app).get(`/pictures/date/${reqParam}`);
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ message });
      },
    );

    it('returns 404 when files are not found', async () => {
      getFilesByReturnsEmpty();
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Files not found', year });
    });

    it('returns 500 when getFilesBy throw an error', async () => {
      getFilesByThrowError();
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getFilesByYear, Error: Error: 💥',
      });
    });
  });
});
