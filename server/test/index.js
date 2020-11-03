import supertest from 'supertest';
import { listener } from '../server';

export const server = supertest(listener);

export const request = async settings => {
  const {
    body = {},
    headers = { 'Content-Type': 'application/json' },
    method = 'get',
    path,
    status = 200
  } = settings;

  let response;

  if (method === 'get') {
    response = await server[method](path);
  }

  if (method === 'post' || method === 'put') {
    response = await server[method](path)
      .set('Content-Type', 'application/json')
      .send(body);
  }

  expect(response.status).toBe(status);

  response.json = async () => {
    return JSON.parse(response.text || '');
  };

  return response;
};
