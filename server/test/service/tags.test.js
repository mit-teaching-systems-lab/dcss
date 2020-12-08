import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/tags/db';
import * as ep from '../../service/tags/endpoints';

const error = new Error('something unexpected happened');

const user = {
  id: 999,
  email: 'super@email.com',
  roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
  is_super: true,
  username: 'superuser',
  is_anonymous: false,
  personalname: 'Super User'
};

const labelsById = [
  {
    id: 3,
    name: 'Fun'
  },
  {
    id: 5,
    name: 'Easy'
  },
  {
    id: 925,
    name: 'Exciting'
  },
  {
    id: 926,
    name: 'Boring'
  }
];

const labelsByCountDesc = [
  {
    id: 5,
    name: 'Easy'
  },
  {
    id: 925,
    name: 'Exciting'
  },
  {
    id: 3,
    name: 'Fun'
  },
  {
    id: 926,
    name: 'Boring'
  }
];

jest.mock('../../service/tags/db', () => {
  return {
    ...jest.requireActual('../../service/tags/db'),
    getCategories: jest.fn(),
    createTag: jest.fn(),
    getLabelsByOccurrence: jest.fn(),
    getLabels: jest.fn(),
    getTags: jest.fn(),
    getTopics: jest.fn()
  };
});

import * as authmw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const authmw = jest.requireActual('../../service/auth/middleware');
  return {
    ...authmw,
    requireUser: jest.fn()
  };
});

describe('/api/tags/*', () => {
  let notification = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    authmw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/tags/labels/*', () => {
    describe('/api/tags/labels', () => {
      const path = '/api/tags/labels';

      test('get success', async () => {
        db.getLabels.mockImplementation(() => {
          return labelsById;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "labels": Array [
              Object {
                "id": 3,
                "name": "Fun",
              },
              Object {
                "id": 5,
                "name": "Easy",
              },
              Object {
                "id": 925,
                "name": "Exciting",
              },
              Object {
                "id": 926,
                "name": "Boring",
              },
            ],
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getLabels.mock.calls.length).toBe(1);
        expect(db.getLabels.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
      });

      test('get failure', async () => {
        db.getLabels.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "something unexpected happened",
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getLabels.mock.calls.length).toBe(1);
        expect(db.getLabels.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
      });
    });

    describe('/api/tags/labels/occurrence/desc', () => {
      const path = '/api/tags/labels/occurrence/desc';

      test('get success', async () => {
        db.getLabelsByOccurrence.mockImplementation(() => {
          return labelsByCountDesc;
        });

        const response = await request({ path });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "labels": Array [
              Object {
                "id": 5,
                "name": "Easy",
              },
              Object {
                "id": 925,
                "name": "Exciting",
              },
              Object {
                "id": 3,
                "name": "Fun",
              },
              Object {
                "id": 926,
                "name": "Boring",
              },
            ],
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getLabelsByOccurrence.mock.calls.length).toBe(1);
        expect(db.getLabelsByOccurrence.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "desc",
          ]
        `);
      });

      test('get failure', async () => {
        db.getLabelsByOccurrence.mockImplementation(() => {
          throw error;
        });

        const response = await request({ path, status: 500 });

        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "something unexpected happened",
          }
        `);
        expect(authmw.requireUser.mock.calls.length).toBe(1);
        expect(db.getLabelsByOccurrence.mock.calls.length).toBe(1);
        expect(db.getLabelsByOccurrence.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "desc",
          ]
        `);
      });
    });
  });

  describe('/api/tags/categories', () => {
    const path = '/api/tags/categories';

    test('get success', async () => {
      db.getCategories.mockImplementation(() => {
        return [];
      });

      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "categories": Array [],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getCategories.mock.calls.length).toBe(1);
      expect(db.getCategories.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('get failure', async () => {
      db.getCategories.mockImplementation(() => {
        throw error;
      });

      const response = await request({ path, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "something unexpected happened",
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getCategories.mock.calls.length).toBe(1);
      expect(db.getCategories.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });
  });

  describe('/api/tags/topics', () => {
    const path = '/api/tags/topics';

    test('get success', async () => {
      db.getTopics.mockImplementation(() => {
        return [];
      });

      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "topics": Array [],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getTopics.mock.calls.length).toBe(1);
      expect(db.getTopics.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('get failure', async () => {
      db.getTopics.mockImplementation(() => {
        throw error;
      });

      const response = await request({ path, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "something unexpected happened",
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getTopics.mock.calls.length).toBe(1);
      expect(db.getTopics.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });
  });

  describe('/api/tags', () => {
    const path = '/api/tags';

    test('get success', async () => {
      db.getTags.mockImplementation(() => {
        return [];
      });

      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "tags": Array [],
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getTags.mock.calls.length).toBe(1);
      expect(db.getTags.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('get failure', async () => {
      db.getTags.mockImplementation(() => {
        throw error;
      });

      const response = await request({ path, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "something unexpected happened",
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.getTags.mock.calls.length).toBe(1);
      expect(db.getTags.mock.calls[0]).toMatchInlineSnapshot(`Array []`);
    });

    test('post success', async () => {
      db.createTag.mockImplementation(() => {
        return {};
      });

      const response = await request({ path, method: 'post' });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "tag": Object {},
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.createTag.mock.calls.length).toBe(1);
      expect(db.createTag.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          undefined,
          undefined,
        ]
      `);
    });

    test('post failure', async () => {
      db.createTag.mockImplementation(() => {
        throw error;
      });

      const response = await request({ path, method: 'post', status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "something unexpected happened",
        }
      `);
      expect(authmw.requireUser.mock.calls.length).toBe(1);
      expect(db.createTag.mock.calls.length).toBe(1);
      expect(db.createTag.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          undefined,
          undefined,
        ]
      `);
    });
  });
});
