import app from '../../index';
import request from 'supertest';
import * as picture from '../../models/picture';

jest.mock('../../utils/logger');

const files = [
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/01/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/04/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/05/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/06/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/08/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/10/1.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/10/2.jpg',
  'https://storage.googleapis.com/martin-blanco/pictures/2018/01/10/3.jpg',
];

const getFilesByReturnsEmpty = () =>
  jest.spyOn(picture, 'getFilesBy').mockResolvedValueOnce([]);

const getFilesByThrowError = () =>
  jest.spyOn(picture, 'getFilesBy').mockRejectedValueOnce(new Error('💥'));

const getFilesByReturnsFiles = () =>
  jest.spyOn(picture, 'getFilesBy').mockResolvedValueOnce(files);

describe('/pictures', () => {
  describe('GET /pictures/date/:year', () => {
    const badRequests = [
      ['test', '"year" must be a number'],
      ['2016', '"year" must be larger than or equal to 2017'],
    ];
    it.each(badRequests)(
      'returns 422 with message when requests fail validation (/pictures/date/%s) ❌',
      async (reqParam: string, message: string) => {
        const response = await request(app).get(`/pictures/date/${reqParam}`);
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ message });
      },
    );

    it('returns 404 when files are not found ❌', async () => {
      getFilesByReturnsEmpty();
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Files not found', year });
    });

    it('returns 500 when getFilesBy throw an error ❌', async () => {
      getFilesByThrowError();
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getFilesByYear, Error: Error: 💥',
      });
    });

    it('returns 200 with a list of files ✅', async () => {
      getFilesByReturnsFiles();
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        year,
        files,
      });
    });
  });
});
