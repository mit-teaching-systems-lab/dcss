import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/notifications/db';
import * as ep from '../../service/notifications/endpoints';

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

const notificationModal = {
  id: 87,
  created_at: '2020-11-19T20:12:39.400Z',
  start_at: null,
  expire_at: null,
  props: {
    html:
      "<p>You&apos;ve been invited to join <b>an-imaginative-otter</b> (a member of the &quot;First Cohort&quot; cohort) in the scenario &quot;Party Platter Preferences&quot;. <a href='/'>Go there now</a>.</p>",
    icon: '',
    size: 'small',
    time: null,
    type: 'info',
    color: 'pink',
    header: 'Invitation',
    className: ''
  },
  rules: {
    'user.id': 999,
    'session.isLoggedIn': true
  },
  type: 'modal',
  updated_at: null,
  deleted_at: null,
  author_id: null
};

const notificationToast = {
  id: 88,
  created_at: '2020-11-19T20:12:39.400Z',
  start_at: null,
  expire_at: null,
  props: {
    icon: 'thumbs up',
    size: 'big',
    time: 5000,
    color: 'green',
    title: 'PMA Note',
    message: 'Keep up the good work!',
    className: ''
  },
  rules: {
    'user.id': 999,
    'session.isLoggedIn': true
  },
  type: 'toast',
  updated_at: null,
  deleted_at: null,
  author_id: null
};

const notificationBand = {
  id: 89,
  created_at: '2020-11-19T20:12:39.400Z',
  start_at: null,
  expire_at: null,
  props: {
    icon: 'rain',
    size: 'huge',
    time: 5000,
    color: 'blue',
    title: 'Weather Alert',
    message: "It's about to rain!",
    className: ''
  },
  rules: {
    'user.id': 999,
    'session.isLoggedIn': true
  },
  type: 'band',
  updated_at: null,
  deleted_at: null,
  author_id: 777
};
const notifications = [notificationModal, notificationToast, notificationBand];

const notificationsById = {
  [notificationModal.id]: notificationModal,
  [notificationToast.id]: notificationToast,
  [notificationBand.id]: notificationBand
};

jest.mock('../../service/notifications/db', () => {
  return {
    ...jest.requireActual('../../service/notifications/db'),
    createNotification: jest.fn(),
    getNotificationById: jest.fn(),
    setNotificationById: jest.fn(),
    expireNotificationById: jest.fn(),
    deleteNotificationById: jest.fn(),
    getNotificationsByAuthorId: jest.fn(),
    getNotificationsStartedNotExpired: jest.fn(),
    getNotifications: jest.fn(),
    setNotificationAck: jest.fn()
  };
});

import * as amw from '../../service/auth/middleware';
jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    requireUser: jest.fn()
  };
});

import * as rolesmw from '../../service/roles/middleware';
jest.mock('../../service/roles/middleware', () => {
  const rolesmw = jest.requireActual('../../service/roles/middleware');
  return {
    ...rolesmw,
    requireUserRole: jest.fn(() => [])
  };
});

describe('/api/notifications/*', () => {
  let notification = null;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    amw.requireUser.mockImplementation((req, res, next) => {
      req.session.user = user;
      next();
    });

    db.createNotification.mockImplementation(async props => {
      return {
        ...notificationBand,
        ...props
      };
    });
    db.setNotificationById.mockImplementation(async (id, updates) => {
      return {
        ...notificationsById[id],
        ...updates
      };
    });
    db.getNotificationById.mockImplementation(async id => {
      return notificationsById[id];
    });
    db.deleteNotificationById.mockImplementation(async () => {
      return {
        ...notificationsById[id],
        deleted_at: '2020-11-16T14:52:28.429Z'
      };
    });

    db.setNotificationAck.mockImplementation(
      async (notification_id, user_id) => ({
        notification_id,
        user_id,
        created_at: '2020-11-13T14:52:28.429Z'
      })
    );
    db.getNotifications.mockImplementation(async () => [...notifications]);
    db.getNotificationsByAuthorId.mockImplementation(async () => [
      notificationBand
    ]);

    rolesmw.requireUserRole.mockImplementation(() => [
      (req, res, next) => next()
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/notifications/', () => {
    const path = '/api/notifications/';

    test('get success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notifications": Array [
            Object {
              "author_id": null,
              "created_at": "2020-11-19T20:12:39.400Z",
              "deleted_at": null,
              "expire_at": null,
              "id": 87,
              "props": Object {
                "className": "",
                "color": "pink",
                "header": "Invitation",
                "html": "<p>You&apos;ve been invited to join <b>an-imaginative-otter</b> (a member of the &quot;First Cohort&quot; cohort) in the scenario &quot;Party Platter Preferences&quot;. <a href='/'>Go there now</a>.</p>",
                "icon": "",
                "size": "small",
                "time": null,
                "type": "info",
              },
              "rules": Object {
                "session.isLoggedIn": true,
                "user.id": 999,
              },
              "start_at": null,
              "type": "modal",
              "updated_at": null,
            },
            Object {
              "author_id": null,
              "created_at": "2020-11-19T20:12:39.400Z",
              "deleted_at": null,
              "expire_at": null,
              "id": 88,
              "props": Object {
                "className": "",
                "color": "green",
                "icon": "thumbs up",
                "message": "Keep up the good work!",
                "size": "big",
                "time": 5000,
                "title": "PMA Note",
              },
              "rules": Object {
                "session.isLoggedIn": true,
                "user.id": 999,
              },
              "start_at": null,
              "type": "toast",
              "updated_at": null,
            },
            Object {
              "author_id": 777,
              "created_at": "2020-11-19T20:12:39.400Z",
              "deleted_at": null,
              "expire_at": null,
              "id": 89,
              "props": Object {
                "className": "",
                "color": "blue",
                "icon": "rain",
                "message": "It's about to rain!",
                "size": "huge",
                "time": 5000,
                "title": "Weather Alert",
              },
              "rules": Object {
                "session.isLoggedIn": true,
                "user.id": 999,
              },
              "start_at": null,
              "type": "band",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getNotifications.mock.calls.length).toBe(1);
      expect(db.getNotifications.mock.calls[0]).toMatchInlineSnapshot(
        `Array []`
      );
    });

    test('post success', async () => {
      const method = 'post';
      const body = {
        ...notificationBand
      };
      const response = await request({ path, method, body });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "author_id": 777,
            "created_at": "2020-11-19T20:12:39.400Z",
            "deleted_at": null,
            "expire_at": null,
            "id": 89,
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "start_at": null,
            "type": "band",
            "updated_at": null,
          },
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(1);
      expect(db.createNotification.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "author_id": 777,
            "expire_at": null,
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "start_at": null,
            "type": "band",
          },
        ]
      `);
    });

    test('post success', async () => {
      db.createNotification.mockImplementation(async () => null);
      const method = 'post';
      const body = {
        ...notificationBand
      };
      const response = await request({ path, method, body, status: 422 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Notification could not be created.",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(1);
      expect(db.createNotification.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "author_id": 777,
            "expire_at": null,
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "start_at": null,
            "type": "band",
          },
        ]
      `);
    });

    test('post failure (partial: no type)', async () => {
      const method = 'post';
      const body = {
        ...notificationModal
      };

      delete body.type;

      const response = await request({ path, method, body, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a notification requires props, rules and a type.",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(0);
    });

    test('post failure (partial: no rules)', async () => {
      const method = 'post';
      const body = {
        ...notificationModal
      };

      delete body.rules;

      const response = await request({ path, method, body, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a notification requires props, rules and a type.",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(0);
    });

    test('post failure (partial: no props)', async () => {
      const method = 'post';
      const body = {
        ...notificationModal
      };

      delete body.props;

      const response = await request({ path, method, body, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a notification requires props, rules and a type.",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(0);
    });

    test('post failure (irrelevant data)', async () => {
      const method = 'post';
      const body = {
        foo: 1
      };
      const response = await request({ path, method, body, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Creating a notification requires props, rules and a type.",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(0);
    });

    test('post failure', async () => {
      db.createNotification.mockImplementation(async () => null);

      const method = 'post';
      const response = await request({ path, method, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "No request body!",
        }
      `);
      expect(db.createNotification.mock.calls.length).toBe(0);
    });
  });

  describe('/api/notifications/:start_at/:expire_at', () => {

    test('get success', async () => {
      const path = `/api/notifications/author/777`;
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notifications": Array [
            Object {
              "author_id": 777,
              "created_at": "2020-11-19T20:12:39.400Z",
              "deleted_at": null,
              "expire_at": null,
              "id": 89,
              "props": Object {
                "className": "",
                "color": "blue",
                "icon": "rain",
                "message": "It's about to rain!",
                "size": "huge",
                "time": 5000,
                "title": "Weather Alert",
              },
              "rules": Object {
                "session.isLoggedIn": true,
                "user.id": 999,
              },
              "start_at": null,
              "type": "band",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getNotificationsByAuthorId.mock.calls.length).toBe(1);
      expect(db.getNotificationsByAuthorId.mock.calls[0])
        .toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/notifications/author/:id', () => {
    const path = '/api/notifications/author/777';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notifications": Array [
            Object {
              "author_id": 777,
              "created_at": "2020-11-19T20:12:39.400Z",
              "deleted_at": null,
              "expire_at": null,
              "id": 89,
              "props": Object {
                "className": "",
                "color": "blue",
                "icon": "rain",
                "message": "It's about to rain!",
                "size": "huge",
                "time": 5000,
                "title": "Weather Alert",
              },
              "rules": Object {
                "session.isLoggedIn": true,
                "user.id": 999,
              },
              "start_at": null,
              "type": "band",
              "updated_at": null,
            },
          ],
        }
      `);
      expect(db.getNotificationsByAuthorId.mock.calls.length).toBe(1);
      expect(db.getNotificationsByAuthorId.mock.calls[0])
        .toMatchInlineSnapshot(`
        Array [
          999,
        ]
      `);
    });
  });

  describe('/api/notifications/:id', () => {
    const path = '/api/notifications/1';

    test('get success', async () => {
      const response = await request({ path });

      expect(await response.json()).toMatchInlineSnapshot(`Object {}`);
      expect(db.getNotificationById.mock.calls.length).toBe(1);
      expect(db.getNotificationById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
    });
  });

  describe('/api/notifications/:id', () => {
    const path = '/api/notifications/2';
    const method = 'put';

    test('put success', async () => {
      const body = {
        ...notificationToast
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "props": Object {
              "className": "",
              "color": "green",
              "icon": "thumbs up",
              "message": "Keep up the good work!",
              "size": "big",
              "time": 5000,
              "title": "PMA Note",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "toast",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
      expect(db.setNotificationById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "props": Object {
              "className": "",
              "color": "green",
              "icon": "thumbs up",
              "message": "Keep up the good work!",
              "size": "big",
              "time": 5000,
              "title": "PMA Note",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "toast",
          },
        ]
      `);
    });

    test('put success, deleted_at', async () => {
      const body = {
        ...notificationBand,
        deleted_at: '2020-11-16T14:52:28.429Z'
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "deleted_at": "2020-11-16T14:52:28.429Z",
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "band",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
      expect(db.setNotificationById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "deleted_at": "2020-11-16T14:52:28.429Z",
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "band",
          },
        ]
      `);
    });

    test('put success, expire_at', async () => {
      const body = {
        ...notificationBand,
        expire_at: '2020-11-16T14:52:28.429Z'
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "expire_at": "2020-11-16T14:52:28.429Z",
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "band",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
      expect(db.setNotificationById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "expire_at": "2020-11-16T14:52:28.429Z",
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "band",
          },
        ]
      `);
    });

    test('put success, start_at', async () => {
      const body = {
        ...notificationBand,
        start_at: '2020-11-16T14:52:28.429Z'
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "start_at": "2020-11-16T14:52:28.429Z",
            "type": "band",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
      expect(db.setNotificationById.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          2,
          Object {
            "props": Object {
              "className": "",
              "color": "blue",
              "icon": "rain",
              "message": "It's about to rain!",
              "size": "huge",
              "time": 5000,
              "title": "Weather Alert",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "start_at": "2020-11-16T14:52:28.429Z",
            "type": "band",
          },
        ]
      `);
    });

    test('put failure (partial: no type)', async () => {
      const body = {
        ...notificationModal
      };

      delete body.type;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "props": Object {
              "className": "",
              "color": "pink",
              "header": "Invitation",
              "html": "<p>You&apos;ve been invited to join <b>an-imaginative-otter</b> (a member of the &quot;First Cohort&quot; cohort) in the scenario &quot;Party Platter Preferences&quot;. <a href='/'>Go there now</a>.</p>",
              "icon": "",
              "size": "small",
              "time": null,
              "type": "info",
            },
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
    });

    test('put failure (partial: no rules)', async () => {
      const body = {
        ...notificationModal
      };

      delete body.rules;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "props": Object {
              "className": "",
              "color": "pink",
              "header": "Invitation",
              "html": "<p>You&apos;ve been invited to join <b>an-imaginative-otter</b> (a member of the &quot;First Cohort&quot; cohort) in the scenario &quot;Party Platter Preferences&quot;. <a href='/'>Go there now</a>.</p>",
              "icon": "",
              "size": "small",
              "time": null,
              "type": "info",
            },
            "type": "modal",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
    });

    test('put failure (partial: no props)', async () => {
      const body = {
        ...notificationModal
      };

      delete body.props;

      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "notification": Object {
            "rules": Object {
              "session.isLoggedIn": true,
              "user.id": 999,
            },
            "type": "modal",
          },
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(1);
    });

    test('put failure (irrelevant data)', async () => {
      const body = {
        foo: 1
      };
      const response = await request({ path, method, body });

      expect(await response.json()).toMatchInlineSnapshot(`Object {}`);
      expect(db.setNotificationById.mock.calls.length).toBe(0);
      expect(db.getNotificationById.mock.calls.length).toBe(1);
    });

    test('put failure', async () => {
      db.setNotificationById.mockImplementation(async () => null);

      const response = await request({ path, method, status: 500 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "No request body!",
        }
      `);
      expect(db.setNotificationById.mock.calls.length).toBe(0);
    });
  });

  describe('/api/notifications/ack', () => {
    const path = '/api/notifications/ack';
    const method = 'post';

    test('post success', async () => {
      const body = {
        id: 89
      };

      const response = await request({ path, body, method });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "ack": Object {
            "created_at": "2020-11-13T14:52:28.429Z",
            "notification_id": 89,
            "user_id": null,
          },
        }
      `);
      expect(db.setNotificationAck.mock.calls.length).toBe(1);
      expect(db.setNotificationAck.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          89,
          NaN,
        ]
      `);
    });

    test('post failure, no body', async () => {
      const response = await request({ path, method, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Notification acknowledgement requires a notification id.",
        }
      `);
      expect(db.setNotificationAck.mock.calls.length).toBe(0);
    });

    test('post failure, has body, missing notification id', async () => {
      const body = {};
      const response = await request({ path, body, method, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Notification acknowledgement requires a notification id.",
        }
      `);
      expect(db.setNotificationAck.mock.calls.length).toBe(0);
    });

    test('post failure, has body and notification id', async () => {
      db.setNotificationAck.mockImplementation(async () => null);

      const body = { id: 89 };
      const response = await request({ path, body, method, status: 422 });

      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "Notification could not be acknowledged.",
        }
      `);
      expect(db.setNotificationAck.mock.calls.length).toBe(1);
    });
  });
});
