import assert from 'assert';
import { state } from '../bootstrap';

import { sessionInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/session';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('session', () => {
  let state;
  let permissions;
  let session;
  beforeEach(() => {
    state = {
      isLoggedIn: false
    };
    permissions = [1, 2, 3];
    session = {
      isLoggedIn: true,
      permissions: []
    };
  });

  test('initial state', () => {
    expect(reducer.session(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
    expect(reducer.session(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
  });

  test('SET_SESSION_SUCCESS', () => {
    const action = {
      type: types.SET_SESSION_SUCCESS,
      session
    };
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [],
      }
    `);
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [],
      }
    `);
  });

  test('SET_SESSION_SUCCESS', () => {
    const action = {
      type: types.SET_SESSION_SUCCESS,
      session
    };
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [],
      }
    `);
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [],
      }
    `);
  });

  test('GET_PERMISSIONS_SUCCESS', () => {
    const action = {
      type: types.GET_PERMISSIONS_SUCCESS,
      permissions
    };
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [
          1,
          2,
          3,
        ],
      }
    `);
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [
          1,
          2,
          3,
        ],
      }
    `);
  });

  test('GET_PERMISSIONS_SUCCESS', () => {
    const action = {
      type: types.GET_PERMISSIONS_SUCCESS,
      permissions
    };
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [
          1,
          2,
          3,
        ],
      }
    `);
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": true,
        "permissions": Array [
          1,
          2,
          3,
        ],
      }
    `);
  });

  test('LOG_OUT', () => {
    const action = {
      type: types.LOG_OUT,
      session
    };
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
    expect(reducer.session(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
  });

  test('LOG_OUT', () => {
    const action = {
      type: types.LOG_OUT,
      session
    };
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
    expect(reducer.session(state, action)).toMatchInlineSnapshot(`
      Object {
        "isLoggedIn": false,
        "permissions": Array [],
      }
    `);
  });
});
