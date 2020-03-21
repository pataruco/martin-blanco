import app from '../../index';
import request from 'supertest';
import * as picture from '../../models/picture';

jest.mock('../../utils/logger');

describe('/pictures', () => {
  describe('GET /pictures/date/:year', () => {
    describe('returns 422 with message when requests fail validation', () => {
      const badRequests = [
        ['test', '"year" must be a number'],
        ['2016', '"year" must be larger than or equal to 2017'],
      ];
      it.each(badRequests)(
        '/pictures/date/%s',
        async (reqParam: string, message: string) => {
          const response = await request(app).get(`/pictures/date/${reqParam}`);
          expect(response.status).toBe(422);
          expect(response.body).toEqual({ message });
        },
      );
    });

    it('returns 404 when files are not found', async () => {
      jest.spyOn(picture, 'getFilesBy').mockResolvedValueOnce([]);
      const year = '2020';
      const response = await request(app).get(`/pictures/date/${year}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Files not found', year });
    });

    // it('returns 404 when files are not found', async () => {
    //   jest.spyOn(picture, 'getFilesBy').mockResolvedValueOnce([]);
    //   const year = '2020';
    //   const response = await request(app).get(`/pictures/date/${year}`);
    //   expect(response.status).toBe(404);
    //   expect(response.body).toEqual({ message: 'Files not found', year });
    // });
  });
});
