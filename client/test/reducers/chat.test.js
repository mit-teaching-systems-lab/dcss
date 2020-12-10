import assert from 'assert';
import { state } from '../bootstrap';

import { chatInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/chat';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let chat;
let chats;
let chatsById;

beforeEach(() => {
  chat = {
    ...original.chat
  };

  chats = [chat];
  chatsById = {
    [chat.id]: chat
  };
});

afterEach(() => {
  chat = null;
  chats = null;
  chatsById = null;
});

describe('chat', () => {
  test('initial state', () => {
    expect(reducer.chat(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });

  test('CREATE_COHORT_SUCCESS', () => {
    const action = {
      type: types.CREATE_COHORT_SUCCESS,
      chat
    };
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });
  test('SET_COHORT_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SUCCESS,
      chat
    };
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });
  test('SET_COHORT_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SCENARIOS_SUCCESS,
      chat
    };
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });
  test('GET_COHORT_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_SUCCESS,
      chat
    };
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });
  test('GET_COHORT_PARTICIPANTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_PARTICIPANTS_SUCCESS,
      chat
    };
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.chat(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "ended_at": null,
        "host_id": null,
        "id": null,
        "lobby_id": null,
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });
});

describe('chats', () => {
  test('initial state', () => {
    expect(reducer.chats(undefined, {})).toMatchInlineSnapshot(`Array []`);
  });

  test('GET_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      chats
    };
    expect(reducer.chats(undefined, action)).toMatchInlineSnapshot(`Array []`);
    expect(reducer.chats(undefined, action)).toMatchInlineSnapshot(`Array []`);
  });

  test('GET_COHORTS_SUCCESS dedupe', () => {
    const state = chats;
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      chats: [...chats, ...chats, ...chats]
    };
    expect(reducer.chats(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-12-08T21:51:33.659Z",
          "deleted_at": null,
          "ended_at": null,
          "host_id": 2,
          "id": 1,
          "lobby_id": 1,
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_muted": false,
              "is_present": true,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T22:29:11.638Z",
              "username": "super",
            },
            Object {
              "email": null,
              "id": 4,
              "is_anonymous": true,
              "is_muted": false,
              "is_present": true,
              "is_super": false,
              "personalname": null,
              "roles": Array [
                "participant",
                "facilitator",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T17:50:19.074Z",
              "username": "credible-lyrebird",
            },
          ],
        },
      ]
    `);
    expect(reducer.chats(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-12-08T21:51:33.659Z",
          "deleted_at": null,
          "ended_at": null,
          "host_id": 2,
          "id": 1,
          "lobby_id": 1,
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_muted": false,
              "is_present": true,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T22:29:11.638Z",
              "username": "super",
            },
            Object {
              "email": null,
              "id": 4,
              "is_anonymous": true,
              "is_muted": false,
              "is_present": true,
              "is_super": false,
              "personalname": null,
              "roles": Array [
                "participant",
                "facilitator",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T17:50:19.074Z",
              "username": "credible-lyrebird",
            },
          ],
        },
      ]
    `);
  });
});

describe('chatsById', () => {
  test('initial state', () => {
    expect(reducer.chatsById(undefined, {})).toMatchInlineSnapshot(`Object {}`);
  });

  test('GET_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      chats
    };
    expect(reducer.chatsById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
    expect(reducer.chatsById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
  });
  test('GET_COHORTS_SUCCESS dedupe', () => {
    const state = {
      ...chatsById
    };
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      chats: [...chats, ...chats, ...chats]
    };
    expect(reducer.chatsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "created_at": "2020-12-08T21:51:33.659Z",
          "deleted_at": null,
          "ended_at": null,
          "host_id": 2,
          "id": 1,
          "lobby_id": 1,
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_muted": false,
              "is_present": true,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T22:29:11.638Z",
              "username": "super",
            },
            Object {
              "email": null,
              "id": 4,
              "is_anonymous": true,
              "is_muted": false,
              "is_present": true,
              "is_super": false,
              "personalname": null,
              "roles": Array [
                "participant",
                "facilitator",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T17:50:19.074Z",
              "username": "credible-lyrebird",
            },
          ],
        },
      }
    `);
    expect(reducer.chatsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "created_at": "2020-12-08T21:51:33.659Z",
          "deleted_at": null,
          "ended_at": null,
          "host_id": 2,
          "id": 1,
          "lobby_id": 1,
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_muted": false,
              "is_present": true,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "participant",
                "super_admin",
                "facilitator",
                "researcher",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T22:29:11.638Z",
              "username": "super",
            },
            Object {
              "email": null,
              "id": 4,
              "is_anonymous": true,
              "is_muted": false,
              "is_present": true,
              "is_super": false,
              "personalname": null,
              "roles": Array [
                "participant",
                "facilitator",
              ],
              "single_use_password": false,
              "updated_at": "2020-12-10T17:50:19.074Z",
              "username": "credible-lyrebird",
            },
          ],
        },
      }
    `);
  });
});
