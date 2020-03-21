import app from '../../index';
import request from 'supertest';
import * as picture from '../../models/picture';

jest.mock('../../utils/logger');

const files = [
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

const getFilesByIdReturnsEmpty = () =>
  jest.spyOn(picture, 'getFileById').mockResolvedValueOnce(undefined);

const getFilesByIdThrowError = () =>
  jest.spyOn(picture, 'getFileById').mockRejectedValueOnce(new Error('💥'));

const getRansdomFileReturnsEmpty = () =>
  jest.spyOn(picture, 'getRandomFile').mockResolvedValueOnce(undefined);

const getRansdomFilehrowError = () =>
  jest.spyOn(picture, 'getRandomFile').mockRejectedValueOnce(new Error('💥'));

const year = '2018';
const month = '01';
const day = '10';
const id = '1';

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
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        year,
        files,
      });
    });
  });

  describe('GET /pictures/date/:year/:month', () => {
    const badRequests = [
      ['test', '"month" must be a number'],
      ['0', '"month" must be greater than 0'],
      ['13', '"month" must be less than 13'],
    ];
    it.each(badRequests)(
      'returns 422 with message when requests fail validation (/pictures/date/year/%s) ❌',
      async (reqParam: string, message: string) => {
        const response = await request(app).get(
          `/pictures/date/${year}/${reqParam}`,
        );
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ message });
      },
    );

    it('returns 404 when files are not found ❌', async () => {
      getFilesByReturnsEmpty();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Files not found',
        year,
        month,
      });
    });

    it('returns 500 when getFilesBy throw an error ❌', async () => {
      getFilesByThrowError();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}`,
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getPicturesByMonth, Error: Error: 💥',
      });
    });

    it('returns 200 with a list of files ✅', async () => {
      getFilesByReturnsFiles();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        year,
        month,
        files,
      });
    });
  });

  describe('GET /pictures/date/:year/:month/:day', () => {
    const badRequests = [
      ['test', '"day" must be a number'],
      ['0', '"day" must be greater than 0'],
      ['40', '"day" must be less than 32'],
    ];

    it.each(badRequests)(
      'returns 422 with message when requests fail validation (/pictures/date/year/month/%s) ❌',
      async (reqParam: string, message: string) => {
        const response = await request(app).get(
          `/pictures/date/${year}/${month}/${reqParam}`,
        );
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ message });
      },
    );

    it('returns 404 when files are not found ❌', async () => {
      getFilesByReturnsEmpty();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Files not found',
        year,
        month,
        day,
      });
    });

    it('returns 500 when getFilesBy throw an error ❌', async () => {
      getFilesByThrowError();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}`,
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getPicturesByDay, Error: Error: 💥',
      });
    });

    it('returns 200 with a list of files ✅', async () => {
      getFilesByReturnsFiles();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        year,
        month,
        day,
        files,
      });
    });
  });

  describe('GET /pictures/date/:year/:month/:day/:id', () => {
    const badRequests = [
      ['test', '"id" must be a number'],
      ['0', '"id" must be greater than 0'],
    ];

    it.each(badRequests)(
      'returns 422 with message when requests fail validation (/pictures/date/year/month/day%s) ❌',
      async (reqParam: string, message: string) => {
        const response = await request(app).get(
          `/pictures/date/${year}/${month}/${day}/${reqParam}`,
        );
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ message });
      },
    );

    it('returns 404 when file is not found ❌', async () => {
      getFilesByIdReturnsEmpty();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}/${id}`,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'File not found',
        year,
        month,
        day,
        id,
      });
    });

    it('returns 500 when getFileById throw an error ❌', async () => {
      getFilesByIdThrowError();
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}/${id}`,
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getPictureById, Error: Error: 💥',
      });
    });

    it('returns 200 with a file ✅', async () => {
      const response = await request(app).get(
        `/pictures/date/${year}/${month}/${day}/${id}`,
      );
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('image/jpeg');
    });
  });

  describe('GET /pictures/random', () => {
    it('returns 404 when file is not found ❌', async () => {
      getRansdomFileReturnsEmpty();
      const response = await request(app).get(`/pictures/random`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'File not found',
      });
    });

    it('returns 500 when getRandomFile throw an error ❌', async () => {
      getRansdomFilehrowError();
      const response = await request(app).get(`/pictures/random`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error getRandomPicture, Error: Error: 💥',
      });
    });

    it('returns 200 with a file ✅', async () => {
      getFilesByReturnsFiles();
      const response = await request(app).get(`/pictures/random`);
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('image/jpeg');
    });
  });
});
