import app from '../../index';
import request from 'supertest';

jest.mock('../../utils/logger');

describe('/pictures', () => {
  describe('/pictures/date/:year', () => {
    describe('retuns 422 with a validation message when requests fail validation', () => {
      const badRequests = [
        ['test', '"year" must be a number'],
        ['2016', '"year" must be larger than or equal to 2017'],
      ];
      it.each(badRequests)(
        'request.app.get(/pictures/date/%s)',
        async (reqParam: string, message: string) => {
          const response = await request(app).get(`/pictures/date/${reqParam}`);
          expect(response.status).toBe(422);
          expect(response.body).toEqual({ message });
        },
      );
    });
  });
});
