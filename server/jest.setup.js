import 'regenerator-runtime/runtime';

// eslint-disable-next-line no-unused-vars
import * as Sendgrid from '@sendgrid/mail';
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn()
}));
