import Crypto from 'crypto-js';
import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/auth/db';
import * as mw from '../../service/auth/middleware';

import * as Sendgrid from '@sendgrid/mail';
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn()
}));

import Nodemailer from 'nodemailer';
jest.mock('nodemailer', () => ({
  createTransport: jest.fn()
}));

const SESSION_SECRET = process.env.SESSION_SECRET || 'mit tsl teacher moments';
const error = new Error('something unexpected happened');

let defaultSuperUser = {
  id: 999,
  email: 'super@email.com',
  roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
  is_super: true,
  username: 'superuser',
  is_anonymous: false,
  personalname: 'Super User'
};

jest.mock('../../service/auth/db', () => {
  return {
    ...jest.requireActual('../../service/auth/db'),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByProps: jest.fn(),
    updateUser: jest.fn(),
    updateUserWhere: jest.fn()
  };
});

// This cannot be used inside the mock defined below
let amw = jest.requireActual('../../service/auth/middleware');

jest.mock('../../service/auth/middleware', () => {
  const amw = jest.requireActual('../../service/auth/middleware');
  return {
    ...amw,
    createUser: jest.fn(),
    checkForDuplicate: jest.fn(),
    loginUser: jest.fn(),
    requireUser: jest.fn(),
    respondWithUser: jest.fn(),
    refreshSession: jest.fn(),
    resetUserPassword: jest.fn(),
    updateUser: jest.fn()
  };
});

function mockRespondWithUser(user) {
  mw.respondWithUser.mockImplementation(
    asyncMiddleware(async (req, res) => {
      if (!user) {
        return res.send({ user: req.session.user });
      }
      return res.send({ user });
    })
  );
}

jest.mock('password-generator', () => () => 'GENERATED PASSWORD');

describe('/api/auth/*', () => {
  let user;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockRespondWithUser();

    mw.requireUser.mockImplementation(
      asyncMiddleware(async (req, res, next) => {
        next();
      })
    );
    process.env.DCSS_BRAND_NAME_TITLE = 'BRAND X';
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.DCSS_BRAND_NAME_TITLE;
    delete process.env.SENDGRID_API_KEY;
  });

  describe('/api/auth/me', () => {
    const path = '/api/auth/me';

    test('success', async () => {
      mockRespondWithUser(defaultSuperUser);

      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
        }
      `);
      expect(mw.requireUser.mock.calls.length).toBe(1);
      expect(mw.respondWithUser.mock.calls.length).toBe(1);
    });

    test('failure', async () => {
      let count = 0;
      mw.requireUser.mockImplementation(
        asyncMiddleware(async (req, res, next) => {
          count++;
          amw.requireUser(req, res, next);
          count++;
        })
      );

      const response = await request({ path, status: 401 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "User is not authenticated.",
        }
      `);
      expect(mw.requireUser.mock.calls.length).toBe(1);
      expect(mw.respondWithUser.mock.calls.length).toBe(0);
      expect(count).toBe(1);
    });
  });

  describe('/api/auth/session', () => {
    const path = '/api/auth/session';
    beforeEach(() => {
      mw.requireUser.mockImplementation(
        asyncMiddleware(async (req, res, next) => {
          req.session.user = defaultSuperUser;
          next();
        })
      );
      mw.respondWithUser.mockImplementation(amw.respondWithUser);
    });

    test('success', async () => {
      mw.refreshSession.mockImplementation(amw.refreshSession);
      db.getUserById.mockImplementation(async () => defaultSuperUser);
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
        }
      `);
    });

    test('failure', async () => {
      let count = 0;
      mw.refreshSession.mockImplementation(
        asyncMiddleware(async (req, res, next) => {
          count++;
          amw.refreshSession(req, res, next);
          count++;
        })
      );
      db.getUserById.mockImplementation(async () => {
        return null;
      });
      const response = await request({ path, status: 404 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "User does not exist.",
        }
      `);
      expect(count).toBe(2);
    });
  });

  describe('/api/auth/logout', () => {
    test('success', async () => {
      const response = await request({
        path: '/api/auth/logout',
        method: 'post'
      });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "logout": true,
        }
      `);
    });
  });

  // router.post('/login', [
  //   validateRequestBody,
  //   validateRequestUsernameAndEmail,
  //   loginUser,
  //   respondWithUser
  // ]);
  // Crypto.AES.encrypt(password, SESSION_SECRET).toString();
  //
  describe('/api/auth/login', () => {
    const method = 'post';
    const path = '/api/auth/login';
    const salt = 'b5a6b7c530735eba';
    const hash =
      '15e33cafdcbecf8b43c12887897411337c7085c80994cecbb36f91188aac9290e6004d1bc5e0bcd25e471f48a5f450458998bb02e663ea4963702623eb58f5d6';

    beforeEach(() => {
      mockRespondWithUser(defaultSuperUser);
      db.updateUser.mockImplementation(async () => {});
      db.getUserById.mockImplementation(async () => defaultSuperUser);
    });

    describe('success', () => {
      test('single_use_password: false', async () => {
        mw.loginUser.mockImplementation(amw.loginUser);

        const single_use_password = false;

        db.getUserByProps.mockImplementation(async () => ({
          ...defaultSuperUser,
          salt,
          hash,
          single_use_password
        }));

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();
        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, body, method });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "user": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "username": "superuser",
            },
          }
        `);
        expect(db.getUserById.mock.calls.length).toBe(1);
        expect(db.updateUser.mock.calls.length).toBe(0);
      });

      test('single_use_password: true', async () => {
        mw.loginUser.mockImplementation(amw.loginUser);

        const single_use_password = true;

        db.getUserByProps.mockImplementation(async () => ({
          ...defaultSuperUser,
          salt,
          hash,
          single_use_password
        }));

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();
        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, body, method });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "user": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "username": "superuser",
            },
          }
        `);
        expect(db.getUserById.mock.calls.length).toBe(1);
        expect(db.updateUser.mock.calls.length).toBe(1);
      });
    });

    describe('failure', () => {
      let status = 401;

      test('This account requires a password', async () => {
        let count = 0;
        mw.loginUser.mockImplementation(
          asyncMiddleware(async (req, res, next) => {
            count++;
            amw.loginUser(req, res, next);
            count++;
          })
        );

        const single_use_password = false;

        db.getUserByProps.mockImplementation(async () => ({
          ...defaultSuperUser,
          salt,
          hash,
          single_use_password
        }));

        const body = {
          username: 'superuser'
        };

        const response = await request({ path, body, method, status });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "This account requires a password.",
          }
        `);
        expect(db.getUserById.mock.calls.length).toBe(0);
        expect(db.updateUser.mock.calls.length).toBe(0);
        expect(count).toBe(2);
      });

      test('This account does not require a password', async () => {
        let count = 0;
        mw.loginUser.mockImplementation(
          asyncMiddleware(async (req, res, next) => {
            count++;
            amw.loginUser(req, res, next);
            count++;
          })
        );

        const single_use_password = false;

        db.getUserByProps.mockImplementation(async () => ({
          ...defaultSuperUser,
          single_use_password
        }));

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();
        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, body, method, status });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "This account does not require a password.",
          }
        `);
        expect(db.getUserById.mock.calls.length).toBe(0);
        expect(db.updateUser.mock.calls.length).toBe(0);
        expect(count).toBe(2);
      });

      test('Invalid password', async () => {
        let count = 0;
        mw.loginUser.mockImplementation(
          asyncMiddleware(async (req, res, next) => {
            count++;
            amw.loginUser(req, res, next);
            count++;
          })
        );

        const single_use_password = false;

        db.getUserByProps.mockImplementation(async () => ({
          ...defaultSuperUser,
          single_use_password
        }));

        const password = Crypto.AES.encrypt('nope', SESSION_SECRET).toString();
        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, body, method, status });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "This account does not require a password.",
          }
        `);
        expect(db.getUserById.mock.calls.length).toBe(0);
        expect(db.updateUser.mock.calls.length).toBe(0);
        expect(count).toBe(2);
      });
    });
  });

  describe('/api/auth/signup', () => {
    const method = 'post';
    const path = '/api/auth/signup';

    describe('success', () => {
      test('with password', async () => {
        mw.createUser.mockImplementation(amw.createUser);
        mw.checkForDuplicate.mockImplementation((req, res, next) => next());
        db.getUserByProps.mockImplementation(() => false);
        db.createUser.mockImplementation(() => defaultSuperUser);

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();

        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, method, body });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "user": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "username": "superuser",
            },
          }
        `);
        expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
        expect(mw.respondWithUser.mock.calls.length).toBe(1);
      });

      test('without password (anonymous users)', async () => {
        mw.createUser.mockImplementation(amw.createUser);
        mw.checkForDuplicate.mockImplementation((req, res, next) => next());
        db.getUserByProps.mockImplementation(() => false);
        db.createUser.mockImplementation(() => defaultSuperUser);

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();

        const body = {
          username: 'superuser'
        };

        const response = await request({ path, method, body });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "user": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "username": "superuser",
            },
          }
        `);
        expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
        expect(mw.respondWithUser.mock.calls.length).toBe(1);
      });
    });

    describe('failure', () => {
      test('User could not be created.', async () => {
        mw.createUser.mockImplementation(amw.createUser);
        mw.checkForDuplicate.mockImplementation((req, res, next) => next());
        db.getUserByProps.mockImplementation(() => false);
        db.createUser.mockImplementation(() => false);

        const password = Crypto.AES.encrypt(
          'bp7UJZQzIL5Un49xuyKV',
          SESSION_SECRET
        ).toString();

        const body = {
          username: 'superuser',
          password
        };

        const response = await request({ path, method, body, status: 500 });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "User could not be created.",
          }
        `);
        expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
        expect(mw.respondWithUser.mock.calls.length).toBe(0);
      });
    });
  });

  describe('/api/auth/signup/usernames/:username/exists', () => {
    describe('success', () => {
      test('does not exist', async () => {
        mw.checkForDuplicate.mockImplementation(amw.checkForDuplicate);
        db.getUserByProps.mockImplementation(() => false);

        const response = await request({
          path: `/api/auth/signup/usernames/whatever/exists`
        });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "username": "whatever",
          }
        `);
        expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
        expect(db.getUserByProps.mock.calls.length).toBe(1);
      });
    });

    describe('failure', () => {
      test('Username is already in use', async () => {
        mw.checkForDuplicate.mockImplementation(amw.checkForDuplicate);
        db.getUserByProps.mockImplementation(() => true);

        const response = await request({
          path: `/api/auth/signup/usernames/whatever/exists`,
          status: 409
        });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "Username is already in use.",
          }
        `);
        expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
        expect(db.getUserByProps.mock.calls.length).toBe(1);
      });
    });
  });

  describe('/api/auth/reset', () => {
    const path = '/api/auth/reset';

    describe('success', () => {
      test('success', async () => {
        mw.resetUserPassword.mockImplementation(async (req, res) => {
          res.json({ reset: true, reason: 'Success' });
        });

        const body = {
          email: 'super@email.com'
        };
        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "Success",
            "reset": true,
          }
        `);
      });
      test('Nodemailer', async () => {
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        let calls = 0;
        db.getUserByProps.mockImplementation(() => {
          if (!calls) {
            calls++;
            return false;
          }
          return defaultSuperUser;
        });

        const sendMail = jest.fn();

        Nodemailer.createTransport.mockImplementation(
          jest.fn(() => {
            return {
              sendMail
            };
          })
        );

        const body = {
          email: 'super@email.com'
        };

        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "Success",
            "reset": true,
          }
        `);

        expect(Nodemailer.createTransport.mock.calls[0][0]).toMatchSnapshot({
          auth: {
            pass: expect.any(String),
            user: expect.any(String)
          }
        });

        expect(sendMail.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            Object {
              "from": "BRAND X <teachermoments@mit.edu>",
              "html": "<p>You are receiving this email because a request was made to reset your BRAND X password. The following password may only be used once. After you've logged in, go to Settings and update your password.</p>
          <p>
          Single-use password: <code>GENERATED PASSWORD</code>
          </p>

          <p>
          <a href=\\"undefined/settings\\">Click here to update your account settings: undefined/settings</a>
          </p>

          <p>
          <small>
          Massachusetts Institute of Technology NE49<br>
          600 Technology Square<br>
          Cambridge, MA 02139
          </small>
          </p>
          ",
              "subject": "BRAND X Single-use password request",
              "text": "
          You are receiving this email because a request was made to reset your BRAND X password.
          The following password may only be used once. After you've logged in, go to Settings and update your password.



          Single-use password: GENERATED PASSWORD



          Click here to update your account settings: undefined/settings


          ------------------------------------------
          Massachusetts Institute of Technology NE49
          600 Technology Square
          Cambridge, MA 02139
          ",
              "to": "",
            },
          ]
        `);
      });

      test('Sendgrid', async () => {
        process.env.SENDGRID_API_KEY = 'x';
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        let calls = 0;
        db.getUserByProps.mockImplementation(() => {
          if (!calls) {
            calls++;
            return false;
          }
          return defaultSuperUser;
        });

        const body = {
          email: 'super@email.com'
        };

        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "Success",
            "reset": true,
          }
        `);

        expect(Sendgrid.send.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            Object {
              "from": "BRAND X <teachermoments@mit.edu>",
              "html": "<p>You are receiving this email because a request was made to reset your BRAND X password. The following password may only be used once. After you've logged in, go to Settings and update your password.</p>
          <p>
          Single-use password: <code>GENERATED PASSWORD</code>
          </p>

          <p>
          <a href=\\"undefined/settings\\">Click here to update your account settings: undefined/settings</a>
          </p>

          <p>
          <small>
          Massachusetts Institute of Technology NE49<br>
          600 Technology Square<br>
          Cambridge, MA 02139
          </small>
          </p>
          ",
              "subject": "BRAND X Single-use password request",
              "text": "
          You are receiving this email because a request was made to reset your BRAND X password.
          The following password may only be used once. After you've logged in, go to Settings and update your password.



          Single-use password: GENERATED PASSWORD



          Click here to update your account settings: undefined/settings


          ------------------------------------------
          Massachusetts Institute of Technology NE49
          600 Technology Square
          Cambridge, MA 02139
          ",
              "to": "",
            },
          ]
        `);
      });
    });

    describe('failure', () => {
      test('Raw email', async () => {
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        db.getUserByProps.mockImplementation(() => {
          return defaultSuperUser;
        });

        const body = {
          email: 'super@email.com'
        };

        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "Cannot use a plain text email address to generate a password reset request",
            "reset": false,
          }
        `);

        expect(db.getUserByProps.mock.calls.length).toBe(1);
      });

      test('Nodemailer', async () => {
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        let calls = 0;
        db.getUserByProps.mockImplementation(() => {
          if (!calls) {
            calls++;
            return false;
          }
          return defaultSuperUser;
        });

        const sendMail = jest.fn();

        Nodemailer.createTransport.mockImplementation(
          jest.fn(() => {
            return {
              sendMail() {
                throw error;
              }
            };
          })
        );

        const body = {
          email: 'super@email.com'
        };

        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "something unexpected happened",
            "reset": false,
          }
        `);

        expect(Nodemailer.createTransport.mock.calls[0][0]).toMatchSnapshot({
          auth: {
            pass: expect.any(String),
            user: expect.any(String)
          }
        });

        expect(sendMail.mock.calls.length).toBe(0);
      });

      test('Sendgrid', async () => {
        process.env.SENDGRID_API_KEY = 'x';
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        let calls = 0;
        db.getUserByProps.mockImplementation(() => {
          if (!calls) {
            calls++;
            return false;
          }
          return defaultSuperUser;
        });

        const body = {
          email: 'super@email.com'
        };

        Sendgrid.send.mockImplementation(() => {
          throw error;
        });

        const response = await request({
          path,
          body,
          method: 'post',
          status: 401
        });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "error": true,
            "message": "something unexpected happened",
          }
        `);

        expect(Sendgrid.send.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            Object {
              "from": "BRAND X <teachermoments@mit.edu>",
              "html": "<p>You are receiving this email because a request was made to reset your BRAND X password. The following password may only be used once. After you've logged in, go to Settings and update your password.</p>
          <p>
          Single-use password: <code>GENERATED PASSWORD</code>
          </p>

          <p>
          <a href=\\"undefined/settings\\">Click here to update your account settings: undefined/settings</a>
          </p>

          <p>
          <small>
          Massachusetts Institute of Technology NE49<br>
          600 Technology Square<br>
          Cambridge, MA 02139
          </small>
          </p>
          ",
              "subject": "BRAND X Single-use password request",
              "text": "
          You are receiving this email because a request was made to reset your BRAND X password.
          The following password may only be used once. After you've logged in, go to Settings and update your password.



          Single-use password: GENERATED PASSWORD



          Click here to update your account settings: undefined/settings


          ------------------------------------------
          Massachusetts Institute of Technology NE49
          600 Technology Square
          Cambridge, MA 02139
          ",
              "to": "",
            },
          ]
        `);
      });

      test('no user', async () => {
        process.env.SENDGRID_API_KEY = 'x';
        mw.resetUserPassword.mockImplementation(amw.resetUserPassword);

        let calls = 0;
        db.getUserByProps.mockImplementation(() => {
          if (!calls) {
            calls++;
            return false;
          }
          return null;
        });

        const body = {
          email: 'super@email.com'
        };

        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "The email provided does not match any existing account.",
            "reset": false,
          }
        `);
      });

      test('failure', async () => {
        mw.resetUserPassword.mockImplementation(async (req, res) => {
          res.json({
            reset: false,
            reason: 'The email provided does not match any existing account.'
          });
        });

        const body = {
          email: 'super@email.com'
        };
        const response = await request({ path, body, method: 'post' });
        expect(await response.json()).toMatchInlineSnapshot(`
          Object {
            "reason": "The email provided does not match any existing account.",
            "reset": false,
          }
        `);
      });
    });
  });

  describe('/api/auth/update', () => {
    const method = 'put';
    const path = '/api/auth/update';

    beforeEach(() => {
      mw.requireUser.mockImplementation(
        asyncMiddleware(async (req, res, next) => {
          req.session.user = defaultSuperUser;
          next();
        })
      );
    });

    test('with password', async () => {
      const body = {
        email: 'another@email.com',
        personalname: 'whatever',
        username: 'something-else'
      };

      mw.updateUser.mockImplementation(amw.updateUser);
      mw.checkForDuplicate.mockImplementation((req, res, next) => next());
      db.getUserByProps.mockImplementation(() => false);
      db.updateUser.mockImplementation((id, updates) => {
        return {
          ...defaultSuperUser,
          ...updates
        };
      });

      const password = Crypto.AES.encrypt(
        'bp7UJZQzIL5Un49xuyKV',
        SESSION_SECRET
      ).toString();

      const response = await request({ path, method, body });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "user": Object {
            "email": "another@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "whatever",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "something-else",
          },
        }
      `);
      expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
      expect(mw.respondWithUser.mock.calls.length).toBe(1);
      expect(db.updateUser.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          999,
          Object {
            "email": "another@email.com",
            "personalname": "whatever",
            "username": "something-else",
          },
        ]
      `);
    });

    test('failure', async () => {
      mw.updateUser.mockImplementation(amw.updateUser);
      mw.checkForDuplicate.mockImplementation((req, res, next) => next());
      db.getUserByProps.mockImplementation(() => false);
      db.updateUser.mockImplementation(() => false);

      const password = Crypto.AES.encrypt(
        'bp7UJZQzIL5Un49xuyKV',
        SESSION_SECRET
      ).toString();

      const body = {
        username: 'superuser',
        password
      };

      const response = await request({ path, method, body, status: 500 });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "error": true,
          "message": "User could not be updated.",
        }
      `);
      expect(mw.checkForDuplicate.mock.calls.length).toBe(1);
      expect(mw.respondWithUser.mock.calls.length).toBe(0);
    });
  });
});
