import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/users';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('users', () => {
  let users;
  let usersById;

  beforeEach(() => {
    users = [...original.users];

    usersById = {
      ...original.usersById
    };
  });

  test('initial state', () => {
    expect(reducer.users(undefined, {})).toEqual(initialState);
    expect(reducer.users(undefined, {})).toEqual(initialState);
    expect(reducer.usersById(undefined, {})).toEqual(initialStateById);
    expect(reducer.usersById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users
    };
    expect(reducer.users(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
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
          "username": "super",
        },
        Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
      ]
    `);
    expect(reducer.users(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
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
          "username": "super",
        },
        Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
      ]
    `);
  });

  test('GET_USERS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users: [...users, ...users, ...users]
    };
    expect(reducer.users(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
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
          "username": "super",
        },
        Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
      ]
    `);
    expect(reducer.users(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
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
          "username": "super",
        },
        Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
      ]
    `);
  });

  test('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users
    };
    expect(reducer.usersById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "3": Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        "4": Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        "5": Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
        "999": Object {
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
          "username": "super",
        },
      }
    `);
    expect(reducer.usersById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "3": Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        "4": Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        "5": Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
        "999": Object {
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
          "username": "super",
        },
      }
    `);
  });

  test('GET_USERS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users: [...users, ...users, ...users]
    };
    expect(reducer.usersById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "3": Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        "4": Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        "5": Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
        "999": Object {
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
          "username": "super",
        },
      }
    `);
    expect(reducer.usersById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "3": Object {
          "email": "heartfull-cougar@email.com",
          "id": 3,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Heartfull Cougar",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "heartfull-cougar",
        },
        "4": Object {
          "email": null,
          "id": 4,
          "is_anonymous": true,
          "is_super": false,
          "personalname": null,
          "roles": Array [
            "participant",
          ],
          "username": "credible-lyrebird",
        },
        "5": Object {
          "email": "perfect-oryx@email.com",
          "id": 5,
          "is_anonymous": false,
          "is_super": false,
          "personalname": "Perfect Oryx",
          "roles": Array [
            "participant",
            "facilitator",
          ],
          "username": "perfect-oryx",
        },
        "999": Object {
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
          "username": "super",
        },
      }
    `);
  });
});
