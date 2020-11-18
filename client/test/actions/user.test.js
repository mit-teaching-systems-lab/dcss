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
          "body": "{\\"password\\":\\"U2FsdGVkX18LIw6QFv4MXizw8GV/VvO5SXYJ2BsfTQw=\\"}",
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
          "body": "{\\"email\\":\\"a@a.com\\",\\"username\\":\\"username\\",\\"password\\":\\"U2FsdGVkX18KV8vlCdT7kp52nwQbSNM13EgNbuuwo6g=\\"}",
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
          "body": "{\\"username\\":\\"username\\",\\"password\\":\\"U2FsdGVkX19K2U6iuck5GdcFddgecwcE7EM97q78iH0=\\"}",
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
          "body": "{\\"email\\":\\"a@a.com\\",\\"password\\":\\"U2FsdGVkX1/wJvViOJBT6ibJ2CtI/4W/0FkWg5n6qG4=\\"}",
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
          "body": "{\\"email\\":\\"a@a.com\\",\\"username\\":\\"username\\"}",
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
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/auth/signup",
        Object {
          "body": "{\\"email\\":\\"a@a.com\\",\\"username\\":\\"username\\",\\"password\\":\\"U2FsdGVkX18e6z8Hh9QweRZSl0s0DSn7QJLCVEOxRic=\\"}",
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
          "body": "{\\"email\\":\\"U2FsdGVkX19/t+DGT2f+KM3rc4476RHgny4WPE4AQpU=\\",\\"origin\\":\\"http://localhost\\"}",
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
          "body": "{\\"email\\":\\"U2FsdGVkX1/lIfV1OmRIUHNY0IE86rKS3ZqJshxCMHk=\\",\\"origin\\":\\"http://localhost\\"}",
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
