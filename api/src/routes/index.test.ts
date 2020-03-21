import app from '../index';
import request from 'supertest';

jest.mock('../utils/logger');

describe('/', () => {
  it('return 200 with an open API Swagger HTML reference', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text.includes('swagger')).toBe(true);
  });
});
