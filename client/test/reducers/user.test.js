import assert from 'assert';
import { state } from '../bootstrap';

import { userInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/user';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('user', () => {
  let state;
  let user;
  let slides;

  beforeEach(() => {
    state = {
      id: Infinity,
      username: 'Someone Else'
    };

    user = {
      ...original.user
    };
  });

  test('initial state', () => {
    expect(reducer.user(undefined, {})).toEqual(userInitialState);
    expect(reducer.user(undefined, {})).toEqual(userInitialState);
  });

  test('GET_USER_SUCCESS', () => {
    const action = {
      type: types.GET_USER_SUCCESS,
      user
    };
    expect(reducer.user(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
    expect(reducer.user(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
  });

  test('GET_SESSION_SUCCESS', () => {
    const action = {
      type: types.GET_SESSION_SUCCESS,
      user
    };
    expect(reducer.user(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
    expect(reducer.user(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
  });

  test('SET_USER_SUCCESS', () => {
    const action = {
      type: types.SET_USER_SUCCESS,
      user
    };
    expect(reducer.user(state, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
    expect(reducer.user(state, action)).toMatchInlineSnapshot(`
      Object {
        "email": "super@email.com",
        "id": 2,
        "is_anonymous": false,
        "is_super": true,
        "personalname": "Super User",
        "roles": Array [
          "participant",
          "super_admin",
          "facilitator",
          "researcher",
        ],
        "username": "super",
      }
    `);
  });
});
