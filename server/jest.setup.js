import 'regenerator-runtime/runtime';

import * as Sendgrid from '@sendgrid/mail';
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn()
}));

