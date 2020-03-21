import app from '../../index';
import request from 'supertest';

jest.mock('../../utils/logger');

describe('/health', () => {
  it('returns 200 OK', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
