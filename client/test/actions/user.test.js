import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/user';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  store = createPseudoRealStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
  globalThis.SESSION_SECRET = 'x';
});

afterEach(() => {
  jest.resetAllMocks();
  delete globalThis.SESSION_SECRET;
});

describe('SET_USER_SUCCESS', () => {
  test('setUser', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(actions.setUser({ x: 1 }));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/update",
        Object {
          "body": "{\\"x\\":1}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('setUser, password encryption', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(
      actions.setUser({ password: 'whatever' })
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/update",
        Object {
          "body": "{\\"password\\":\\"U2FsdGVkX1+xxYz0QxNDusd/PGpDCRPl4Ux+iYzJ/Rc=\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('No op, no error', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(actions.setUser({}));
    expect(fetch.mock.calls.length).toBe(0);
    expect(store.getState().errors.user).toBe(null);
    expect(returnValue).toBe(null);
  });
});

test('SET_USER_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setUser({ x: 1 }));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/auth/update",
      Object {
        "body": "{\\"x\\":1}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      },
    ]
  `);
  expect(store.getState().errors.user.error).toMatchInlineSnapshot(
    `[Error: something unexpected happened on the server]`
  );
  expect(returnValue).toBe(null);
});

describe('GET_USER_SUCCESS', () => {
  test('getUser', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(actions.getUser());

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/me",
      ]
    `);
    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('signUp, all params', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const params = {
      email: 'a@a.com',
      username: 'username',
      password: 'x'
    };

    const returnValue = await store.dispatch(actions.signUp(params));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/signup",
        Object {
          "body": "{\\"password\\":\\"U2FsdGVkX185FG7HgF4optlORJU17XwbdqivFSGgub4=\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('signUp, no email', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const params = {
      username: 'username',
      password: 'x'
    };

    const returnValue = await store.dispatch(actions.signUp(params));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/signup",
        Object {
          "body": "{\\"password\\":\\"U2FsdGVkX19c06Y6uoGHGIlfT4I7ihc6gVXjHbGA6QI=\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('signUp, no username', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const params = {
      email: 'a@a.com',
      password: 'x'
    };

    const returnValue = await store.dispatch(actions.signUp(params));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/signup",
        Object {
          "body": "{\\"password\\":\\"U2FsdGVkX1/hXmHvVpGGAPfUiqZGlzdRSLbAdnsyVog=\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });

  test('signUp, no password', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const params = {
      email: 'a@a.com',
      username: 'username'
    };

    const returnValue = await store.dispatch(actions.signUp(params));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/signup",
        Object {
          "body": "{}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(store.getState().user).toEqual(user);
    expect(returnValue).toEqual(user);
  });
});

describe('GET_USER_ERROR', () => {
  test('getUser', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getUser());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/me",
      ]
    `);
    expect(store.getState().errors.user.error).toMatchInlineSnapshot(
      `[Error: something unexpected happened on the server]`
    );
    expect(returnValue).toBe(null);
  });

  test('signUp', async () => {
    fetchImplementation(fetch, 200, { error });

    const user = { ...state.user };
    const params = {
      email: 'a@a.com',
      username: 'username',
      password: 'x'
    };

    const returnValue = await store.dispatch(actions.signUp(params));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`undefined`);
    expect(store.getState().errors.user.error).toMatchInlineSnapshot(
      `undefined`
    );
    expect(returnValue).toBe(null);
  });
});

describe('Reset Password, no action type', () => {
  test('success', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(
      actions.resetPassword({ email: 'a@a.com' })
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/reset",
        Object {
          "body": "{\\"email\\":\\"U2FsdGVkX1+SfKn+6FAIQY8JcIseC1rdkW05ppqGrzU=\\",\\"origin\\":\\"http://localhost\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toMatchInlineSnapshot(`undefined`);
  });

  test('No op, no error', async () => {
    const user = { ...state.user };

    fetchImplementation(fetch, 200, { user });

    const returnValue = await store.dispatch(actions.resetPassword({}));
    expect(fetch.mock.calls.length).toBe(0);
    expect(returnValue).toBe(null);
  });

  test('failure', async () => {
    fetchImplementation(fetch, 200, { error });

    globalThis.SESSION_SECRET = 'x';

    const returnValue = await store.dispatch(
      actions.resetPassword({ email: 'a@a.com' })
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/reset",
        Object {
          "body": "{\\"email\\":\\"U2FsdGVkX18Jg5rrI2GyLX0+Ns7InmJiSE2JWG9pLKg=\\",\\"origin\\":\\"http://localhost\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toBe(null);
  });
});
