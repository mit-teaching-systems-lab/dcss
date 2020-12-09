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
        },
      }
    `);
  });
});
