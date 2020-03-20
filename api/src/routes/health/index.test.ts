import nock, { Interceptor, Scope } from 'nock';
import healthRouter from './index';
import app, { PORT, HOST } from '../../index';
import fetch from 'node-fetch';

describe('/health', () => {
  let application;
  let server;
  let baseUri: string;

  beforeEach(done => {
    application = app;
    server = application.listen(0, done);
    baseUri = `http://${HOST}:${PORT}`;
    nock.disableNetConnect();
    nock.cleanAll();
  });

  afterEach(done => {
    nock.enableNetConnect();
    server.close(done);
  });

  afterAll(done => {
    server.close(done);
  });

  it('returns 200 OK', async () => {
    nock(baseUri)
      .get('/health')
      .reply(200, 'OK');

    const healthRouterSPy = jest.spyOn(healthRouter, 'get');

    const response = await fetch(`${baseUri}/health`);

    const text = await response.text();

    expect(text).toBe('OK');
    expect(response.status).toBe(200);
    await expect(healthRouterSPy).toBeCalled();
  });
});
