import { request } from '../';

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

import * as ep from '../../service/mail/endpoints';

const ame = jest.requireActual('../../service/mail/endpoints');
jest.mock('../../service/mail/endpoints', () => {
  const ame = jest.requireActual('../../service/mail/endpoints');
  return {
    ...ame,
    sendMailMessage: jest.fn()
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

let defaultSuperUser = {
  id: 999,
  email: 'super@email.com',
  roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
  is_super: true,
  username: 'superuser',
  is_anonymous: false,
  personalname: 'Super User'
};

describe('/api/mail/*', () => {
  let user;
  let sendMail;
  const notStatus = 404;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    user = defaultSuperUser;

    mw.requireUser.mockImplementation(async (req, res, next) => {
      req.session.user = user;
      next();
    });

    sendMail = jest.fn();

    Nodemailer.createTransport.mockImplementation(() => {
      return {
        sendMail
      };
    });

    jest.spyOn(ep, 'sendMailMessage');
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.SENDGRID_API_KEY;
  });

  describe('/api/mail/send', () => {
    const path = '/api/mail/send';

    test('success (post, mailtrap)', async () => {
      const method = 'post';
      const body = {
        message: {
          to: 'x@y.com',
          from: 'a@b.com',
          subject: 'subject',
          text: 'text',
          html: 'html'
        }
      };

      const response = await request({ path, method, body });
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "reason": "",
          "sent": true,
        }
      `);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    test('success (post, sendgrid)', async () => {
      process.env.SENDGRID_API_KEY = 'x';

      const method = 'post';
      const body = {
        message: {
          to: 'x@y.com',
          from: 'a@b.com',
          subject: 'subject',
          text: 'text',
          html: 'html'
        }
      };

      const response = await request({ path, method, body });
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "reason": "",
          "sent": true,
        }
      `);
      expect(Sendgrid.send).toHaveBeenCalledTimes(1);
    });

    test('error (post, mailtrap)', async () => {
      sendMail = jest.fn(() => {
        throw error;
      });

      Nodemailer.createTransport.mockImplementation(() => {
        return {
          sendMail
        };
      });

      const method = 'post';
      const body = {
        message: {
          to: 'x@y.com',
          from: 'a@b.com',
          subject: 'subject',
          text: 'text',
          html: 'html'
        }
      };

      const response = await request({ path, method, body });
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "reason": "something unexpected happened",
          "sent": false,
        }
      `);

      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    test('error (post, sendgrid)', async () => {
      process.env.SENDGRID_API_KEY = 'x';

      Sendgrid.send.mockImplementation(() => {
        throw error;
      });

      const method = 'post';
      const body = {
        message: {
          to: 'x@y.com',
          from: 'a@b.com',
          subject: 'subject',
          text: 'text',
          html: 'html'
        }
      };

      const response = await request({ path, method, body });
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "reason": "something unexpected happened",
          "sent": false,
        }
      `);

      expect(Sendgrid.send).toHaveBeenCalledTimes(1);
    });
  });
});
