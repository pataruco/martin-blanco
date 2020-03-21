import nock from 'nock';
import app, { PORT, HOST } from '../../index';
import fetch from 'node-fetch';

describe('/health', () => {
  let application;
  let server;
  let baseUri: string;

  beforeEach(done => {
    application = app;
    baseUri = `http://${HOST}:${PORT}`;
    server = application.listen(0, done);
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

    const response = await fetch(`${baseUri}/health`);

    const text = await response.text();

    expect(text).toBe('OK');
    expect(response.status).toBe(200);
  });
});
