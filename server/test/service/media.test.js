import { request } from '../';

import * as ep from '../../service/media/endpoints';
jest.mock('../../service/media/endpoints', () => {
  return {
    uploadAudio: jest.fn(),
    uploadImage: jest.fn(),
    requestMedia: jest.fn()
  };
});

import * as mw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    requireUser: jest.fn()
  };
});

const error = new Error('something unexpected happened');

describe('/api/media/*', () => {
  let user;
  const notStatus = 404;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    ep.uploadAudio.mockImplementation(async (req, res) => {
      res.json('ok');
    });
    ep.uploadImage.mockImplementation(async (req, res) => {
      res.json('ok');
    });
    ep.requestMedia.mockImplementation(async (req, res) => {
      res.json('ok');
    });
    mw.requireUser.mockImplementation(async (req, res, next) => {
      next();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/media/audio', () => {
    const path = '/api/media/audio';

    test('success (post)', async () => {
      const method = 'post';
      await request({ path, method, notStatus });
      expect(ep.uploadAudio.mock.calls.length).toBe(1);
    });

    test('success (get)', async () => {
      await request({ path, notStatus });
      expect(mw.requireUser.mock.calls.length).toBe(1);
      expect(ep.requestMedia.mock.calls.length).toBe(1);
    });
  });

  describe('/api/media/image', () => {
    const path = '/api/media/image';

    test('success (post)', async () => {
      const method = 'post';
      await request({ path, method, notStatus });
      expect(ep.uploadImage.mock.calls.length).toBe(1);
    });

    test('success (get)', async () => {
      await request({ path, notStatus });
      expect(mw.requireUser.mock.calls.length).toBe(1);
      expect(ep.requestMedia.mock.calls.length).toBe(1);
    });
  });
});
